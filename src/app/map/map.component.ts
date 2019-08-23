import { Component, OnInit } from '@angular/core';
import { Map, View, Overlay, Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { Point } from 'ol/geom';
import { WellDataService } from '../shared/well-data/well-data.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: Map;
  source: XYZ;
  layer: TileLayer;
  view: View;
  popup: Overlay;
  sourceFeatures: VectorSource;
  layerFeatures: VectorLayer;
  key: string = 'sk.eyJ1IjoiZGVuemlsZ3JpIiwiYSI6ImNqemU4bzFpcTAxenUzbXA0YTdpMjAzdXYifQ.-7juqj-TZYBdyJejAxawFw';

  constructor(private wellDataService: WellDataService) {
    this.wellDataService.getWellData();
  }

  ngOnInit() {

    this.createMap();
    this.setStyle();

  }

  /**
   * Creates a map object and adds it to the view
   */
  createMap() {
    // Source from the map canvas is retrieved
    this.source = new XYZ({
      url: 'https://api.mapbox.com/styles/v1/denzilgri/cjzjxbwl803ws1dphvsrz8mny/tiles/256/{z}/{x}/{y}?access_token=' + this.key
    });

    // Creating a new layer
    this.layer = new TileLayer({
      source: this.source
    })

    // creating a View object that holds zoom and map center properties
    this.view = new View({
      center: fromLonLat([-94.57857, 39.09973]),
      zoom: 5
    });

    // Creating map object and setting important attributes
    this.map = new Map({
      target: 'map-container',
      layers: [this.layer],
      view: this.view
    });

  }

  /**
   * Create popup/infowindows
   */
  createPopup() {

    /**
     * Elements that make up the popup.
     */
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    /**
     * Create an overlay to anchor the popup to the map.
     */
    this.popup = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    // add the popup to map
    this.map.addOverlay(this.popup);

    // event handler to display popup whenever the orange spots are clicked
    this.map.on('singleclick', (event) => {
      this.map.forEachFeatureAtPixel(event.pixel,
        (feature) => {
          const content = feature.get('desc');
          if (content) {
            container.hidden = false;
            this.popup.setPosition(event.coordinate);
          }
        },
        {
          layerFilter: (layer) => {
            return (layer.type === new VectorLayer().type) ? true : false;
          }, hitTolerance: 6
        }
      );
      if (!content) {
          container.innerHTML = '';
          container.hidden = true;
      }
    });

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = () => {
      this.popup.setPosition(undefined);
      closer.blur();
      return false;
    };

  }

  /**
    * Method to create a label/marker.
    */
  setStyle() {

    this.sourceFeatures = new VectorSource();
    this.layerFeatures = new VectorLayer({ source: this.sourceFeatures });

    var style = [
      new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: 'rgb(255, 132, 0)'
          }),
          stroke: new Stroke({
            color: 'rgb(255, 255, 255)',
            width: 2
          })
        })
      })
    ];

    const long_string = 'zsdfzsdffs';

    const feature = new Feature({
      type: 'click',
      desc: long_string,
      geometry: new Point(fromLonLat([-99.683617, 31.169621]))
    });

    feature.setStyle(style);
    this.sourceFeatures.addFeature(feature);
    this.layerFeatures.setSource(this.sourceFeatures);

    this.map.addLayer(this.layerFeatures);

    /**
     * Method call for popup creator.
     * This call creates a popup
     */
    this.createPopup();
  }

}
