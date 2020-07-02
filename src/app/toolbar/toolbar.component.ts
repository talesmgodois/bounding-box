import {Component, Output, EventEmitter, Input} from '@angular/core';

export enum EToolbarEvents {
  REDO='REDO', UNDO="UNDO"
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

  public undo() {
    this.undoEvent.emit(EToolbarEvents.UNDO)
  }

  public redo() {
    this.redoEvent.emit(EToolbarEvents.REDO)
  }

  public setColor(color) {
    this.colorHandler.emit(color)
  }
}
