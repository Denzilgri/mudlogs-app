import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import { OSM, Vector } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT.js';

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
  key: string = 'sk.eyJ1IjoiZGVuemlsZ3JpIiwiYSI6ImNqemU4bzFpcTAxenUzbXA0YTdpMjAzdXYifQ.-7juqj-TZYBdyJejAxawFw';

  constructor() { }

  ngOnInit() {
    console.log(fromLonLat);

    this.source = new OSM();

    this.layer = new TileLayer({
      source: this.source,
      opacity: 0.3
    });

    this.view = new View({
      center: fromLonLat([-94.57857, 39.09973]),
      zoom: 5
    });

    this.map = new Map({
      target: 'map-container',
      layers: [this.layer,
      new VectorTileLayer({
        declutter: true,
        source: new VectorTileSource({
          attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
            '© <a href="https://www.openstreetmap.org/copyright">' +
            'OpenStreetMap contributors</a>',
          format: new MVT(),
          url: 'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/' +
            '{z}/{x}/{y}.vector.pbf?access_token=' + this.key
        }),
        style: this.getStyle()
      })],
      view: this.view
    });
  }

  getStyle() {
    return new Style({
      fill: new Fill({
        color: '#F8F8F8'
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 1
      })
    });
  }

}
