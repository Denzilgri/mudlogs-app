import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WellDataService {

  wellData: any[];

  constructor(private http: HttpClient) { }

  fetchWellData(): void {
    this.http
      .get('./assets/mudlog.json')
      .subscribe((responseData: any[]) => {
        this.wellData = responseData;
      });
  }

  getWellData() {
    return this.wellData;
  }
}
