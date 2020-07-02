import {Component, EventEmitter, Input, Output} from '@angular/core';
import ImgData from "../../types/ImgData";


@Component({
  selector: 'app-img-picker',
  templateUrl: './img-picker.component.html',
  styleUrls: ['./img-picker.component.scss']
})
export class ImgPickerComponent {

  @Input()
  public imgMap: Map<string, ImgData> = new Map();

  @Input()
  public disabledIds: Array<number>;

  @Output()
  public imgSelectEvent = new EventEmitter();

  @Output()
  public submitHandler = new EventEmitter();

  selectImage(ev, img: ImgData) {
    this.imgSelectEvent.emit({
      ...img,
      obj: ev.target
    })
  }

  submit(ev) {
    this.submitHandler.emit(ev)
  }

  getImageUrl(img: ImgData) {
    return img.dataUrl ? img.dataUrl : img.url;
  }

  get imgs() {
    return [...this.imgMap.values()]
  }

}
