import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WellDataService {

  constructor(private http: HttpClient) { }

  getWellData(): void {
    this.http
      .get('app/data/countries-geo.json')
      .subscribe(responseData => {
        console.log(responseData);
      });
  }
}
