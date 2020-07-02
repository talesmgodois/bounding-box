import {AfterViewInit, OnInit,Component, ElementRef, ViewChild} from '@angular/core';
import {rect} from 'p5';
import Store, {EActions} from "../lib/Store";
import {ApiService} from "../../services/api/api.service";
import {ImgPickerComponent} from "../img-picker/img-picker.component";

@Component({
  selector: 'app-painter',
  templateUrl: './painter.component.html',
  styleUrls: ['./painter.component.scss']
})
export class PainterComponent implements AfterViewInit, OnInit {

  @ViewChild('painter')
  canvasRef: ElementRef<HTMLCanvasElement>;

  @ViewChild('imgPicker')
  imgPicker: ImgPickerComponent;

  ctx: CanvasRenderingContext2D;
  
  canvas: HTMLCanvasElement;
  store:Store = new Store();
  
  public imgs:Array<string> = [];

  state = {
    mouseX:null,
    mouseY: null,
    width: null,
    height: null,
    color: 'black',
    currentImg: null
  };

  constructor(private apiService:ApiService) { }

  dispatch(action, payload?) {
      this.setState(payload);
      this.store.dispatch(action, payload);
  }

  setCanvasSize(width, height){
      this.canvas.width = width;
      this.canvas.height = height;
  }

    ngOnInit(): void {
        this.apiService.getImgs().then(async (data: Array<string>) => {
            this.imgs = data;
        });
    }

  ngAfterViewInit(): void {

    this.canvas = this.canvasRef.nativeElement;
    this.setCanvasSize(1114,625);
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
      if(isMouseDown) {
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
    const {mouseX,mouseY,width,height, color} = state;

    ctx.beginPath();
    ctx.rect(mouseX,mouseY,width,height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawRect(state) {
    const ctx = this.ctx;
    const canvasX = this.canvas.offsetLeft;
    const canvasY = this.canvas.offsetTop;
    const {mouseX, mouseY,  evX, evY, color} = state;
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


    ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.redraw();
    ctx.beginPath();
    ctx.rect(mouseX,mouseY,width,height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();


  }

  clean() {
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
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
    const stack = redo? this.store.redoHistory: this.store.undoHistory;

    if(stack.length > 0) {
      stack.map(state => this.draw(state));
    }
  }


  draw(state):void {
    const {action, rect, currentImg, fillCanvas} = state;
    switch (action) {
      case EActions.FINISH_DRAW_RECT:
        return this.drawSquare(rect);
      case EActions.DRAW_IMG:
        this.drawImg({currentImg, fillCanvas});
    }
  }

  setImg(img) {

      const {currentImg} = this.state;
      if(currentImg){
        const dataUrl = this.canvas.toDataURL('image/png');
        const image = new Image();
        image.src = dataUrl;
        console.log(image);
        debugger;
        // this.imgPicker.setImg(currentImg.src, dataUrl);
      }
      const fillCanvas = confirm('Do you want the image to fill the canvas?');
      this.dispatch(EActions.DRAW_IMG, {currentImg:img, fillCanvas});

      this.redraw();
  }

  drawImg({currentImg, fillCanvas}){
      this.setState({currentImg, fillCanvas});
      if(fillCanvas){
          this.ctx.drawImage(currentImg,0,0,this.canvas.width, this.canvas.height);
      }else {
          this.ctx.drawImage(currentImg,0,0);
      }
  }

  public getImageData() {
    const ctx = this.ctx;
    const imgData = ctx.getImageData(0,0,this.canvas.width, this.canvas.height);
    ctx.putImageData(imgData,0,0);

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

  setColor(color){
      this.setState({color});
  }

  private setState(state) {
      this.state = {
          ...this.state,
          ...state
      }
  }

}
