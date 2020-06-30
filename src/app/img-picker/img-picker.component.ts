import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import {ApiService} from "../../services/api/api.service";


@Component({
  selector: 'app-img-picker',
  templateUrl: './img-picker.component.html',
  styleUrls: ['./img-picker.component.scss']
})
export class ImgPickerComponent implements OnInit {
  @Output()
  imgSelectEvent = new EventEmitter();

  public imgs: Array<string>;

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.apiService.getImgs().then((data: Array<string>) => {
      this.imgs = data;
    });
  }

  selectImage(ev) {
    this.imgSelectEvent.emit(ev);
  }


}
