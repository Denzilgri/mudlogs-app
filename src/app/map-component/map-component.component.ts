import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import { HttpClient } from '@angular/common/http';
import TileLayer from 'ol/layer/Tile';
import {Fill, Stroke, Style, Text} from 'ol/style.js';

@Component({
  selector: 'map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})
export class MapComponentComponent implements OnInit {

  map: Map;
  source: XYZ;
  layer: TileLayer;
  view: View;
  key: string = 'sk.eyJ1IjoiZGVuemlsZ3JpIiwiYSI6ImNqemU4bzFpcTAxenUzbXA0YTdpMjAzdXYifQ.-7juqj-TZYBdyJejAxawFw';

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.source = new XYZ({
      url: 'https://api.mapbox.com/styles/v1/denzilgri/cjzjxbwl803ws1dphvsrz8mny/tiles/256/{z}/{x}/{y}?access_token=' + this.key
    });

    this.layer = new TileLayer({
      source: this.source
    })

    this.view = new View({
      center: fromLonLat([-94.57857, 39.09973]),
      zoom: 5.5
    });

    this.map = new Map({
      target: 'map-container',
      layers: [this.layer],
      view: this.view
    });
  }

}
