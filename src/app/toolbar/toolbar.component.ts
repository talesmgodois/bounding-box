import {Component, EventEmitter, Input, Output} from '@angular/core';

export enum EToolbarEvents {
  REDO = 'REDO', UNDO = "UNDO"
}


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Input() redoDisabled = false;
  @Input() undoDisabled = false;

  @Output()
  redoEvent = new EventEmitter();

  @Output()
  undoEvent = new EventEmitter();

  @Output()
  colorHandler = new EventEmitter();


  public colors = [
    'red',
    'green',
    'blue',
    'black'
  ];


  @Input()
  public currentColor: string = this.colors[0];

  public undo() {
    this.undoEvent.emit(EToolbarEvents.UNDO)
  }

  public redo() {
    this.redoEvent.emit(EToolbarEvents.REDO)
  }

  getBorder(color) {
    return this.currentColor === color ? 'groove' : '';
  }

  public setColor(color) {
    this.currentColor = color;
    this.colorHandler.emit(color)
  }
}
