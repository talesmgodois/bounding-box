import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {rect} from 'p5';
import Store, {EActions} from "../lib/Store";
import {ApiService} from "../../services/api/api.service";
import {ImgPickerComponent} from "../img-picker/img-picker.component";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {b64toBlob} from '../../common/helpers';
import ImgData from "../../types/ImgData";

@Component({
  selector: 'app-painter',
  templateUrl: './painter.component.html',
  styleUrls: ['./painter.component.scss']
})
export class PainterComponent implements AfterViewInit, OnInit {

  @ViewChild('painter')
  public canvasRef: ElementRef<HTMLCanvasElement>;

  @ViewChild('imgPicker')
  public imgPicker: ImgPickerComponent;

  @ViewChild('toolabr')
  public toolbar: ToolbarComponent;

  public ctx: CanvasRenderingContext2D;

  public canvas: HTMLCanvasElement;
  public store: Store = new Store();

  public imgMap: Map<string, ImgData> = new Map();

  public state = {
    mouseX: null,
    mouseY: null,
    width: null,
    height: null,
    color: 'black',
    currentImg: null
  };

  constructor(private apiService: ApiService) {
  }

  dispatch(action, payload?) {
    this.setState(payload);
    this.store.dispatch(action, payload);
  }

  setCanvasSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  ngOnInit(): void {
    this.apiService.getImgs().then(async (data: Array<string>) => {
      this.imgMap = await this.cacheImages(data);
    });
  }

  cacheImages(imgsUrls: Array<string>): Promise<Map<string, ImgData>> {
    return new Promise((resolve) => {
      const img_map = new Map();
      for (const img of imgsUrls) {
        const imgDOM = new Image();
        imgDOM.onload = () => {
          img_map.set(img, {
            obj: imgDOM,
            url: img,
            dataUrl: null
          });
          if (img_map.size === imgsUrls.length) {
            resolve(img_map)
          }
        };
        imgDOM.src = img;
      }
    });
  }

  ngAfterViewInit(): void {

    this.canvas = this.canvasRef.nativeElement;
    this.setCanvasSize(1114, 625);
    this.ctx = this.canvas.getContext('2d');

    this.store = new Store({
      isMouseDown: false,
      currentImg: null,
      rect: {}
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.dispatch(EActions.FINISH_DRAW_RECT, {
        isMouseDown: false,
        rect: {
          ...this.state
        }
      });
      this.redraw();

    }, false);

    this.canvas.addEventListener("mousedown", (e) => {
      const canvasX = this.canvas.offsetLeft;
      const canvasY = this.canvas.offsetTop;
      this.dispatch(EActions.DRAW_RECT, {
        isMouseDown: true,
        rect: {
          evX: e.clientX,
          evY: e.clientY,
          mouseX: e.clientX - canvasX,
          mouseY: e.clientY - canvasY,
          color: this.state.color
        }
      });

    }, false);
    
    this.canvas.addEventListener("mousemove", (e) => {
      const {rect, isMouseDown} = this.store.state;
      if (isMouseDown) {
        this.drawRect({
          ...rect,
          evX: e.clientX,
          evY: e.clientY,
        });
      }
    })
  }

  drawSquare(state) {

    const ctx = this.ctx;
    const {mouseX, mouseY, width, height, color} = state;

    ctx.beginPath();
    ctx.rect(mouseX, mouseY, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawRect(state) {
    const ctx = this.ctx;
    const canvasX = this.canvas.offsetLeft;
    const canvasY = this.canvas.offsetTop;
    const {mouseX, mouseY, evX, evY, color} = state;
    const x = evX - canvasX;
    const y = evY - canvasY;
    const width = x - mouseX;
    const height = y - mouseY;

    this.setState({
      mouseX,
      mouseY,
      width,
      height,
      color
    });

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.redraw();
    ctx.beginPath();
    ctx.rect(mouseX, mouseY, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  clean() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  cleanHistory() {
    this.store = new Store({
      isMouseDown: false,
      currentImg: null,
      rect: {}
    });
    this.clean();
  }


  redraw(redo = false) {
    const stack = redo ? this.store.redoHistory : this.store.undoHistory;

    if (stack.length > 0) {
      stack.map(state => this.draw(state));
    }
  }


  draw(state): void {
    const {action, rect, currentImg} = state;
    switch (action) {
      case EActions.FINISH_DRAW_RECT:
        return this.drawSquare(rect);
      case EActions.DRAW_IMG:
        this.drawImg({currentImg});
    }
  }


  setImg(img: ImgData) {
    const {currentImg} = this.state;
    if (currentImg && currentImg.url === img.url) return;

    const mappedImg = this.imgMap.get(img.url);
    mappedImg.obj = img.obj;

    if (currentImg) {
      currentImg.dataUrl = this.canvas.toDataURL('image/png');
      currentImg.obj = img.obj;
    }
    this.dispatch(EActions.DRAW_IMG, {currentImg: mappedImg});
    console.log(this.imgMap);
    this.redraw();
  }

  drawImg({currentImg}) {
    this.setState({currentImg});
    this.ctx.drawImage(currentImg.obj, 0, 0, this.canvas.width, this.canvas.height);
  }

  undo() {
    this.store.undo();
    this.clean();
    this.redraw();
  }

  redo() {
    this.store.redo();
    this.clean();
    this.redraw();
  }

  setColor(color) {
    this.setState({color});
  }

  public getFormData() {
    const fd = new FormData();
    const {currentImg} = this.state;

    /**
     * The following code saves the current changes into the img
     */
    if (currentImg) {
      const mappedImg = this.imgMap.get(currentImg.url);
      mappedImg.obj = currentImg.obj;

      if (currentImg) {
        currentImg.dataUrl = this.canvas.toDataURL('image/png');
      }
    }


    const processedImgs = [...this.imgMap.values()].filter(imgData => imgData.dataUrl).map(imgData => {
      fd.append('files', b64toBlob(imgData.dataUrl));
      return imgData;
    });
    console.log(processedImgs);
    console.log(fd);
  }

  private setState(state) {
    this.state = {
      ...this.state,
      ...state
    }
  }
}
