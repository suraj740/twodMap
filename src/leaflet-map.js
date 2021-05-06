var L = require('leaflet');
require('leaflet-routing-machine');
require('leaflet-control-geocoder');
require('./mouseposition.control.js');
require('./mask.polygon.js');
require('./bouncemarker.js');
var turf = require('@turf/turf');
class TwoDMap {
    constructor() {
        this.showLabel = true;
    }
    initMap(mapId, options) {
        this.map = L.map(mapId, options);
        L.control.mousePosition({ position: 'bottomright', lngFirst: true }).addTo(this.map)
    }

    setGeoJsonData(data) {
        this.data = data;
        // console.log('states', states);
        const getColor = d => {
            return d > 1000 ? '#800026' :
                d > 500 ? '#BD0026' :
                    d > 200 ? '#E31A1C' :
                        d > 100 ? '#FC4E2A' :
                            d > 50 ? '#FD8D3C' :
                                d > 20 ? '#FEB24C' :
                                    d > 10 ? '#FED976' :
                                        '#FFEDA0';
        }
        const style = feature => {
            return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: getColor(feature.properties.density)
            };
        }
        const highlightFeature = e => {
            const layer = e.target;
            // console.log(layer)
            if (!this.showLabel) {
                layer.bindTooltip(layer.feature.properties.name[0].text, {
                    permanent: false,
                    direction: "center",
                    className: "my-labels"
                }).openTooltip();
            }
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }
        let geojson;

        const resetHighlight = e => {
            geojson.resetStyle(e.target);
        }

        const zoomToFeature = e => {
            var layer = e.target;

            if (layer.feature.geometry.type === "Polygon") {
                // L.marker(center, {icon: smallIcon}).addTo(this.map);
                var bounds = layer.getBounds();
                // Get center of bounds
                var center = bounds.getCenter();
                // Use center to put marker on map
                var marker = L.marker(center).addTo(this.map);
            }
            this.map.fitBounds(e.target.getBounds());
        }

        const onEachFeature = (feature, layer) => {

            // console.log(feature, layer);
            if (this.showLabel) {
                layer.bindTooltip(feature.properties.name[0].text, {
                    permanent: true,
                    direction: "center",
                    className: "my-labels"
                }).openTooltip();
            }
            // var smallIcon = L.icon({
            //     iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
            //     // options: {
            //     //     iconSize: [27, 27],
            //     //     iconAnchor: [13, 27],
            //     //     popupAnchor:  [1, -24],
            //     //     iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png'
            //     // }
            // });

            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature,
            });
            // layer._leaflet_id = feature.properties.pid;
        }
        geojson = L.geoJson(data, {
            // style: style,
            onEachFeature: onEachFeature
        }).addTo(this.map);
        // console.log('geojson', geojson);
    }

    addRouting(start, end, autoRoute = false) {
        // var startCoord = L.latLng(data.features[0].geometry.coordinates[0][1], data.features[0].geometry.coordinates[0][0]);
        // console.log('startCoord', startCoord);
        var routeControl = L.Routing.control({
            waypoints: [
                new L.Routing.Waypoint(start, 'Alabama'),
                end
            ],
            lineOptions: {
                styles: [{ color: '#0066ff', opacity: 0.7, weight: 5 }]
            },
            autoRoute: autoRoute,
            routeWhileDragging: false,
            // geocoder: L.Control.Geocoder.nominatim(),
        }).addTo(this.map);
        routeControl.hide();

        routeControl.on('routeselected', function (e) {
            console.log('routeselected', e)
        });
    }

    _selectPlaces(id) {
        // console.log('_selectPlaces', this.data);
        var data = this.data.find(item => item.properties.pid === id);
        // console.log('data', data);
        let latLngs = data.geometry.coordinates[0];
        let center = turf.centerOfMass(data).geometry.coordinates;
        let mask = [];
        for (var i = 0; i < latLngs.length; i++) {
            mask.push(new L.LatLng(latLngs[i][1], latLngs[i][0]));
        }
        // this.areaMode.bounds = mask;
        // self._map.setView([center[1], center[0]], self._map.getMaxZoom());
        // self._map.dragging.disable();
        // self._map.touchZoom.disable();
        // self._map.doubleClickZoom.disable();
        // self._map.scrollWheelZoom.disable();
        var maskAdded = L.mask(mask, {
            stroke: false,
            color: '#333',
            fillOpacity: 0.5,
            clickable: true,
            outerBounds: new L.LatLngBounds({
                "_southWest": {
                    "lat": 30.247195,
                    "lng": -88.471115
                },
                "_northEast": {
                    "lat": 35.00118,
                    "lng": -84.889196
                }
            })
        }).addTo(this.map);
        
        // .bindTooltip(data.properties.name[0].text,
        //     {
        //         className: 'tooltip-area-label',
        //         offset: L.point(0, 9),
        //         direction: 'top',
        //         permanent: true,
        //         sticky: true,
        //         opacity: 0.7
        //     }).openTooltip([center[1], center[0]]);
        var myIcon = L.icon({
            iconUrl: './pngegg.png',
            iconSize: [38, 95],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
            shadowUrl: './pngegg.png',
            shadowSize: [38, 95],
            shadowAnchor: [22, 94]
        });
        var marker = L.marker(center, {
            icon: myIcon, bounceOnAdd: true,
            bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
            bounceOnAddCallback: function () { console.log("done"); }
        })
            .addTo(this.map)
            .bindPopup(data.properties.name[0].text, {className: 'popup-marker', closeOnClick: false, closeButton: false}).openPopup();
    }

    _selectMultiplePlaces(dataList) {
        var mask = [];
        var centers = [];
        dataList.map((data) => {
            // if (data.geometry.type === 'Polygon') {
            mask.push([]);
            // }
        });
        dataList.map((data, key) => {
            if (data.geometry.type === 'Polygon') {
                var latLngs = data.geometry.coordinates[0];
                // var latLngs = area.area.polygon.coordinates[0];
                centers.push(
                    turf.centerOfMass(data).geometry.coordinates
                );
                console.log('latLngs', latLngs, key, mask.length);
                latLngs.map((latlng) => {
                    mask[key].push(new L.LatLng(latlng[1], latlng[0]));
                });
            }
        });
        // console.log('mask', mask, centers);
        var maskAdded = L.mask(mask, {
            stroke: false,
            color: '#333',
            fillOpacity: 0.5,
            clickable: true,
            // outerBounds: new L.LatLngBounds(this._bounds)
        }).addTo(this.map);
        dataList.map((id, key) => {
            // var area = this._getAreaInfo(id);
            // this.maskAdded.bindTooltip(new LanguageStorePipe().transform(area.name),
            // {
            //     className: 'tooltip-area-label',
            //     offset: L.point(0, 9),
            //     direction: 'top',
            //     permanent: true,
            //     sticky: true,
            //     opacity: 0.7,
            //     interactive: true
            // }).openTooltip([centers[key][1], centers[key][0]]);

        });
    }

    changeTheme() {

    }
    // showLabel() {
    //     return this.showLabel;
    // }
}

export default TwoDMap;