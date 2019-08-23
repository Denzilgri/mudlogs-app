import { Component, OnInit } from '@angular/core';
import { Map, View, Overlay, Feature } from 'ol';
import { fromLonLat, toLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import { HttpClient } from '@angular/common/http';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { toStringHDMS } from 'ol/coordinate';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import {Point} from 'ol/geom';

/**
 * Main map component class which displays the customized map
 */
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
  popup: Overlay;
  sourceFeatures: VectorSource;
  layerFeatures: VectorLayer;
  key: string = 'sk.eyJ1IjoiZGVuemlsZ3JpIiwiYSI6ImNqemU4bzFpcTAxenUzbXA0YTdpMjAzdXYifQ.-7juqj-TZYBdyJejAxawFw';

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.createMap();
    

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

    this.createPopup();

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


    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = () => {
      this.popup.setPosition(undefined);
      closer.blur();
      return false;
    };

    /**
     * Add a click handler to the map to render the popup.
     */
    this.map.on('singleclick', (evt) => {
      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));

      content.innerHTML = `<p>You clicked here:</p><code>${hdms}</code>`;
      this.popup.setPosition(coordinate);
    });

    // add the popup to map
    this.map.addOverlay(this.popup);
    this.setStyle();
  }

  addMarker(location, name) {

  }

  setStyle() {

    this.sourceFeatures = new VectorSource();
    this.layerFeatures = new VectorLayer({source: this.sourceFeatures});

    var style1 = [
      // new Style({
      //   image: new Icon(({
      //     scale: 0.7,
      //     rotateWithView: false,
      //     anchor: [0.5, 1],
      //     anchorXUnits: 'fraction',
      //     anchorYUnits: 'fraction',
      //     opacity: 1,
      //     src: '//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png'
      //   })),
      //   zIndex: 5
      // }),
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
    const feature2 = new Feature({
      type: 'click',
      desc: long_string,
      geometry: new Point(fromLonLat([-73.935242, 40.730610]))
    });
    feature.setStyle(style1);
    this.sourceFeatures.addFeature(feature);

    feature2.setStyle(style1);
    this.sourceFeatures.addFeature(feature2);

    this.layerFeatures.setSource(this.sourceFeatures);

    this.map.addLayer(this.layerFeatures);

    this.map.on('click', (evt) => {
      var f = this.map.forEachFeatureAtPixel(
        evt.pixel,
        (ft, layer) => { return ft; }
      );
      if (f && f.get('type') == 'click') {
        var geometry = f.getGeometry();
        var coord = geometry.getCoordinates();

        var content = '<p>' + f.get('desc') + '</p>';

        this.popup.show(coord, content);

      } else { this.popup.hide(); }

    });
    this.map.on('pointermove', (e) => {
      if (e.dragging) { this.popup.hide(); return; }

      var pixel = this.map.getEventPixel(e.originalEvent);
      var hit = this.map.hasFeatureAtPixel(pixel);
      console.log(this.map.getTarget());

      if (this.map.getTarget() === 'map-container') {
        const el = document.getElementById('map-container');
        el.style.cursor = hit ? 'pointer' : '';
      } else {
        this.map.getTarget().style.cursor = hit ? 'pointer' : '';
      }
    });
  }

}

/**
 * OpenLayers 3 Popup Overlay.
 * See [the examples](./examples) for usage. Styling can be done via CSS.
 * @constructor
 * @extends {ol.Overlay}
 * @param {Object} opt_options Overlay options, extends olx.OverlayOptions adding:
 *                              **`panMapIfOutOfView`** `Boolean` - Should the
 *                              map be panned so that the popup is entirely
 *                              within view.
 */
// var Popup = function(opt_options) {

//   var options = opt_options || {};

//   this.panMapIfOutOfView = options.panMapIfOutOfView;
//   if (this.panMapIfOutOfView === undefined) {
//       this.panMapIfOutOfView = true;
//   }

//   this.ani = options.ani;
//   if (this.ani === undefined) {
//       this.ani = ol.animation.pan;
//   }

//   this.ani_opts = options.ani_opts;
//   if (this.ani_opts === undefined) {
//       this.ani_opts = {'duration': 250};
//   }

//   this.container = document.createElement('div');
//   this.container.className = 'ol-popup';

//   this.closer = document.createElement('a');
//   this.closer.className = 'ol-popup-closer';
//   this.closer.href = '#';
//   this.container.appendChild(this.closer);

//   var that = this;
//   this.closer.addEventListener('click', function(evt) {
//       that.container.style.display = 'none';
//       that.closer.blur();
//       evt.preventDefault();
//   }, false);

//   this.content = document.createElement('div');
//   this.content.className = 'ol-popup-content';
//   this.container.appendChild(this.content);

//   Overlay.call(this, {
//       element: this.container,
//       stopEvent: true
//   });

// };

// ol.inherits(Popup, Overlay);

// /**
// * Show the popup.
// * @param {ol.Coordinate} coord Where to anchor the popup.
// * @param {String} html String of HTML to display within the popup.
// */
// Popup.prototype.show = function(coord, html) {
//   this.setPosition(coord);
//   this.content.innerHTML = html;
//   this.container.style.display = 'block';

//   var content = this.content;
//   window.setTimeout(function(){
//       content.scrollTop = 0;
//   }, 100);
  
//   if (this.panMapIfOutOfView) {
//       this.panIntoView_(coord);
//   }
//   return this;
// };

// /**
// * @private
// */
// Popup.prototype.panIntoView_ = function(coord) {

//   var popSize = {
//           width: this.getElement().clientWidth + 20,
//           height: this.getElement().clientHeight + 20
//       },
//       mapSize = this.getMap().getSize();

//   var tailHeight = 20,
//       tailOffsetLeft = 60,
//       tailOffsetRight = popSize.width - tailOffsetLeft,
//       popOffset = this.getOffset(),
//       popPx = this.getMap().getPixelFromCoordinate(coord);

//   var fromLeft = (popPx[0] - tailOffsetLeft),
//       fromRight = mapSize[0] - (popPx[0] + tailOffsetRight);

//   var fromTop = popPx[1] - popSize.height + popOffset[1],
//       fromBottom = mapSize[1] - (popPx[1] + tailHeight) - popOffset[1];

//   var center = this.getMap().getView().getCenter(),
//       px = this.getMap().getPixelFromCoordinate(center);

//   if (fromRight < 0) {
//       px[0] -= fromRight;
//   } else if (fromLeft < 0) {
//       px[0] += fromLeft;
//   }
  
//   if (fromTop < 0) {
//       //px[1] = 170 + fromTop;
//       px[1] += fromTop; //original
//   } else if (fromBottom < 0) {
//       px[1] -= fromBottom;
//   }

//   if (this.ani && this.ani_opts) {
//       this.ani_opts.source = center;
//       this.getMap().beforeRender(this.ani(this.ani_opts));
//   }
//   this.getMap().getView().setCenter(this.getMap().getCoordinateFromPixel(px));

//   return this.getMap().getView().getCenter();

// };

// /**
// * Hide the popup.
// */
// Popup.prototype.hide = function() {
//   this.container.style.display = 'none';
//   return this;
// };
