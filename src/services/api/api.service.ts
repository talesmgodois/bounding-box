import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private API = 'https://k4px9ykgri.execute-api.us-east-2.amazonaws.com/prod';
  private API = '/imgs';

  constructor(private http: HttpClient){

  }
  public async getImgs():Promise<Array<string>> {
    return this.http.get<Array<string>>(this.API).toPromise().then((data) => {
      return data.map(url => {
        return ApiService.getPath(url);
      })
    });
  }

  public static getPath(url): string{
    return new URL(url).pathname;
  }
}
