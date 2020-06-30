import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API = 'https://k4px9ykgri.execute-api.us-east-2.amazonaws.com/prod';

  constructor(private http: HttpClient){

  }
  public async getImgs():Promise<Array<string>> {

    return ["https://imaging.nikon.com/lineup/dslr/df/img/sample/img_01.jpg", "https://imaging.nikon.com/lineup/dslr/df/img/sample/img_02.jpg", "https://imaging.nikon.com/lineup/dslr/df/img/sample/img_03.jpg", "https://imaging.nikon.com/lineup/dslr/df/img/sample/img_04.jpg", "https://imaging.nikon.com/lineup/dslr/df/img/sample/img_05.jpg", "https://imaging.nikon.com/lineup/dslr/df/img/sample/img_06.jpg", "https://imaging.nikon.com/lineup/dslr/df/img/sample/img_07.jpg"]
    // return fetch(this.API,{'mode':'no-cors'}).then(resp=> resp.json())
    // return fetch('https://k4px9ykgri.execute-api.us-east-2.amazonaws.com/prod').then(data=> data.json()).then(data=> console.log(data))
    //   return resp.json();
    // return this.http.get<Array<string>>(this.API).toPromise();
  }
}
