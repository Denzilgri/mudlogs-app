import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import { OSM, Vector } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';

@Component({
  selector: 'map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})
export class MapComponentComponent implements OnInit {

  map: Map;
  source: OSM;
  layer: TileLayer;
  vectorLayer: VectorLayer;
  view: View;

  constructor() { }

  ngOnInit() {
    console.log(fromLonLat);

    this.source = new OSM();

    this.layer = new TileLayer({
      source: this.source
    });

    this.view = new View({
      center: fromLonLat([-94.57857, 39.09973]),
      zoom: 5
    });

    this.map = new Map({
      target: 'map-container',
      layers: [this.layer],
      view: this.view
    });
  }

  getStyle() {
    return new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)'
      }),
      stroke: new Stroke({
        color: '#319FD3',
        width: 1
      })
    });
  }

}
