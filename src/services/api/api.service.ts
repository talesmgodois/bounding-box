import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API = '/api/imgs';

  constructor(private http: HttpClient) {
  }

  public async getImgs(): Promise<Array<string>> {
    return this.http.get<Array<string>>(this.API).toPromise().then((data) => {
      return data.map(url => {
        return ApiService.getPath(url);
      })
    });
  }

  public static getPath(url): string {
    return 'api' + new URL(url).pathname;
  }
}
