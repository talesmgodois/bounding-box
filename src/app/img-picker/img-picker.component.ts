import {Component, Output, OnInit, EventEmitter, Input} from '@angular/core';


@Component({
  selector: 'app-img-picker',
  templateUrl: './img-picker.component.html',
  styleUrls: ['./img-picker.component.scss']
})
export class ImgPickerComponent {

  @Input()
  public imgs: Array<string> = [];

  @Output()
  public imgSelectEvent = new EventEmitter();

  selectImage(ev) {
    this.imgSelectEvent.emit(ev.target);
  }

  setImg(url, dataUrl){
    const index = this.imgs.indexOf(url);
    this.imgs[index] = dataUrl;
  }

  submit(){
    console.log(this.imgs);
  }

}
