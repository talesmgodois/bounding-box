import {Component, ElementRef, AfterViewInit, ViewChild} from '@angular/core';
import {rect} from 'p5';
import Store, {EActions} from "../lib/Store";

@Component({
  selector: 'app-painter',
  templateUrl: './painter.component.html',
  styleUrls: ['./painter.component.scss']
})
export class PainterComponent implements AfterViewInit {

  @ViewChild('painter')
  canvasRef: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  
  canvas: HTMLCanvasElement;
  store:Store = new Store();

  mouseState = {
    evX: null,
    evY: null
  };
  // store:IStore;

  // private isMouseDown = false;
  //
  // public states = [];
  // public redoStack = [];

  constructor() { }

  dispatch(action, payload?) {
    this.store.dispatch(action, payload);
  }

  ngAfterViewInit(): void {

    this.canvas = this.canvasRef.nativeElement;
    this.canvas.width = 1114;
    this.canvas.height = 625;
    this.ctx = this.canvas.getContext('2d');
    this.store = new Store({
      isMouseDown: false,
      currentImg: null,
      rect: {
        canvasX: this.canvas.offsetLeft,
        canvasY: this.canvas.offsetTop,
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      const {canvasX, canvasY} = this.store.state.rect;
      this.dispatch(EActions.FINISH_DRAW_RECT, {
        isMouseDown: false,
        rect: {
          evX: e.clientX,
          evY:e.clientY,
          mouseX: e.clientX - canvasX,
          mouseY: e.clientY - canvasY,
        }
      });
      console.log(this.store);
      this.redraw()
    }, false);

    this.canvas.addEventListener("mousedown", (e) => {
      const { rect } = this.store.state;
      const canvasX = rect.canvasX;
      const canvasY = rect.canvasY;
      this.dispatch(EActions.DRAW_RECT, {
        isMouseDown: true,
        rect: {
          evX: e.clientX,
          evY: e.clientY,
          mouseX: e.clientX - canvasX,
          mouseY: e.clientY - canvasY,
        }
      });

    }, false);


    this.canvas.addEventListener("mousemove", (e) => {
      const {rect, isMouseDown} = this.store.state;
      if(isMouseDown) {
        this.mouseState = {
          evX: e.clientX,
          evY: e.clientY
        };
        this.drawRect({
          ...rect,
          ...this.mouseState
        });
      }
    })
  }

  drawSquare(state) {
    const {mouseX, mouseY, canvasX, canvasY, evX, evY} = state;
    const x = evX - canvasX;
    const y = evY - canvasY;
    const width = x - mouseX;
    const height = y - mouseY;

    this.ctx.beginPath();
    this.ctx.rect(mouseX,mouseY,width,height);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  drawRect(state) {

    const {mouseX, mouseY, canvasX, canvasY, evX, evY} = state;
    const x = evX - canvasX;
    const y = evY - canvasY;
    const width = x - mouseX;
    const height = y - mouseY;

    this.ctx.beginPath();
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.rect(mouseX,mouseY,width,height);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  clean() {
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
  }
  cleanHistory() {
    this.store = new Store({
      isMouseDown: false,
      currentImg: null,
      rect: {
        canvasX: this.canvas.offsetLeft,
        canvasY: this.canvas.offsetTop,
      }
    });
    this.clean();
  }


  redraw() {
    // this.clean();
    if(this.store.history.undo.length > 0) {
      // console.log(this.store.history.undo);
      // this.store.history.undo.map((state)=> {
      //   this.draw(state)
      // })
    // }
      for(let i =0; i< this.store.history.undo.length; i++){
        this.draw(this.store.history.undo[i])
      }
    }
  }


  draw(state):void {
    const {action, rect} = state;
    switch (action) {
      case EActions.FINISH_DRAW_RECT:
        console.log(rect);
        this.drawSquare(rect);
        break;
      default:
        return;
    }
  }

  drawImg(imgUrl){
    const state = this.store.state;
    state.currentImg = imgUrl;
    const background = new Image();
    background.onload = () => {
      this.ctx.drawImage(background,0,0);
    };
    background.src = imgUrl;
  }

  undo() {
    this.store.undo();
    this.redraw();
  }

  redo() {
    this.store.redo();
    this.redraw();
  }

  //
  // setState(action, payload) {
  //   this.states.push(this.state);
  //
  //   this.state = {
  //     ...payload,
  //     action
  //   }
  // }

}
