var L = require('leaflet');
require('leaflet-routing-machine');
require('leaflet-control-geocoder');
require('./mouseposition.control.js');
require('./mask.polygon.js');
require('./bouncemarker.js');
require('./twodmap-toolbar.control.js');
require('./boundarycanvas.js');
var turf = require('@turf/turf');
class TwoDMap {
    constructor() {
        this.showLabel = true;
        this.maskAdded = {};
        this.marker = {};
    }
    initMap(mapId, options) {
        this.map = L.map(mapId, options);
        // this.map.setMaxBounds(this.map.getBounds());
        // var mapBounds = L.latLngBounds(bounds);
        // this.map.setMaxBounds(mapBounds);
        // this.map.fitBounds([[0, 0], [310.535, 677.664]], {
        //     padding: [20, 30]
        // });
        // this.map.setMaxBounds([[0, 0], [310.535, 677.664]]);
        // L.TileLayer.boundaryCanvas('https://wallpapercave.com/wp/XqRBXyO.jpg', {boundary: this.data, tileSize: 1200, }).addTo(this.map)
        L.imageOverlay('https://wallpapercave.com/wp/XqRBXyO.jpg', [[0, 0], [310.535, 677.664]]).addTo(this.map);
        L.control.mousePosition({ position: 'bottomright', lngFirst: true }).addTo(this.map)
    }

    _createLayer(layerName, options, parent, layerType) {
        switch (layerType) {
            case 'layerGroup':
                parent[layerName] = L.layerGroup([]);
                break;

            case 'featureGroup':
                parent[layerName] = L.featureGroup()
                break;

            case 'geoJson':
                parent[layerName] = L.geoJson(undefined, options.geoJsonOptions);
                break;

            case 'imageOverlay':
                parent[layerName] = L.imageOverlay(options.imageOverlayOptions.url, options.imageOverlayOptions.bounds, options.imageOverlayOptions.imageOptions);
                break;
        }

        L.Util.setOptions(parent[layerName], options.layerOptions);
    }


    _getFloorInformation(data) {
        
        // this._jQuery.ajax({
        //     type: "GET",
        //     url: self.options.api.url.base + self.options.api.url.venues + this._mapOptions.venueId,
        //     headers: self.options.api.headers,
        //     dataType: 'json',
        //     data: { "projection": '{"building":1}', 'url': 1 },
        //     success: function (response) {
        //         self._log(Logger.DEBUG.name, 'Building Info', response);
                


        //         self._map.spin(false);

        //         self._map.dragging.enable();
        //     }
        // });
        var boundSet = this._getMapBounds(data[0].floor[0].map_info);
        this._bounds = boundSet['imagebounds'];
        this._floorBounds = boundSet['floorbounds'];
        // this.map.fitBounds(this._bounds, {
        //     padding: [20, 30]
        // });
        this.map.setMaxBounds(this._bounds);
        this._addToolbar(data);
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


            layer.on('reclipped', function(ev) {
                console.log('on clipped', ev);
            });
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
            style: style,
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
        this._clearPreviousLayers();

        // console.log('_selectPlaces', this.data);
        var data = this.data.find(item => item.properties.pid === id);
        // console.log('data', data);
        let latLngs = data.geometry.coordinates[0];
        let center = turf.centerOfMass(data).geometry.coordinates;
        let mask = [];
        for (var i = 0; i < latLngs.length; i++) {
            mask.push(new L.LatLng(latLngs[i][1], latLngs[i][0]));
        }
        console.log(this.maskAdded);
        // this.areaMode.bounds = mask;
        // this.map.setView([center[1], center[0]], this.map.getMaxZoom());
        // self._map.dragging.disable();
        // self._map.touchZoom.disable();
        // self._map.doubleClickZoom.disable();
        // self._map.scrollWheelZoom.disable();
        // var marker;
        if (this.maskAdded[id] != undefined) {
            this.map.removeLayer(this.maskAdded[id]);
            this.maskAdded[id] = undefined;
        }
        else {
            this.maskAdded[id] = L.mask(mask, {
                stroke: false,
                color: '#333',
                fillOpacity: 0.5,
                clickable: true,
                outerBounds: new L.LatLngBounds(this._bounds)
            }).addTo(this.map);
        }
        // .bindTooltip(data.properties.name[0].text,
        //     {
        //         className: 'tooltip-area-label',
        //         offset: L.point(0, 9),
        //         direction: 'top',
        //         permanent: true,
        //         sticky: true,
        //         opacity: 0.7
        //     }).openTooltip([center[1], center[0]]);
        console.log('marker', this.marker[id]);
        if (this.marker[id] != undefined) {
            // this.marker._removeIcon();
            this.map.removeLayer(this.marker[id]);
            this.marker[id] = undefined;
        }
        else {
            var myIcon = L.icon({
                iconUrl: './marker.png',
                iconSize: [28, 65],
                iconAnchor: [10, 64],
                popupAnchor: [5, -50],
                // shadowUrl: './pngegg.png',
                // shadowSize: [28, 65],
                // shadowAnchor: [22, 64]
            });
            this.marker[id] = L.marker([center[1], center[0]], {
                icon: myIcon, bounceOnAdd: true,
                bounceOnAddOptions: { duration: 500, height: 150, loop: 1 },
                bounceOnAddCallback: function () { console.log("done"); }
            })
                .addTo(this.map)
                .bindPopup(data.properties.name[0].text, {className: 'popup-marker', closeOnClick: false, closeButton: false}).openPopup([center[1], center[0]]);
        }
    }

    _clearPreviousLayers() {
        Object.keys(this.maskAdded).map((key) => {
            if (this.maskAdded[key]) {
                this.map.removeLayer(this.maskAdded[key]);
                // this.maskAdded[key] = undefined;
            }
        });
        Object.keys(this.marker).map((key) => {
            if (this.marker[key]) {
                this.map.removeLayer(this.marker[key]);
                // this.marker[key] = undefined;
            }
        });
    }

    _selectMultiplePlaces(idList) {
        this._clearPreviousLayers();
        var mask = [];
        var centers = [];
        if (idList.length) {
            idList.map((id) => {
                // if (data.geometry.type === 'Polygon') {
                mask.push([]);
                // }
            });
            idList.map((id, key) => {
                var data = this.data.find(item => item.properties.pid === id);
                if (data.geometry.type === 'Polygon') {
                    var latLngs = data.geometry.coordinates[0];
                    // var latLngs = area.area.polygon.coordinates[0];
                    centers.push(
                        turf.centerOfMass(data).geometry.coordinates
                    );
                    // console.log('latLngs', latLngs, key, mask.length);
                    latLngs.map((latlng) => {
                        mask[key].push(new L.LatLng(latlng[1], latlng[0]));
                    });
                }
            });
            // console.log('mask', mask, centers);
            this.maskAdded[idList.join()] = L.mask(mask, {
                stroke: false,
                color: '#333',
                fillOpacity: 0.5,
                clickable: true,
                outerBounds: new L.LatLngBounds(this._bounds)
            }).addTo(this.map);

            var myIcon = L.icon({
                iconUrl: './marker.png',
                iconSize: [28, 65],
                iconAnchor: [10, 64],
                popupAnchor: [5, -50],
                // shadowUrl: './pngegg.png',
                // shadowSize: [28, 65],
                // shadowAnchor: [22, 64]
            });
            idList.map((id, key) => {
                var data = this.data.find(item => item.properties.pid === id);
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
                this.marker[id] = L.marker([centers[key][1], centers[key][0]], {
                    icon: myIcon, bounceOnAdd: true,
                    bounceOnAddOptions: { duration: 500, height: 150, loop: 1 },
                    bounceOnAddCallback: function () { console.log("done"); }
                })
                    .addTo(this.map)
                    .bindPopup(data.properties.name[0].text, {className: 'popup-marker', closeOnClick: false, closeButton: false, autoClose: false}).openPopup([centers[key][1], centers[key][0]]);
            });
        }
    }

    _addToolbar(data) {
        this._engageControl = new L.Control.Toolbar(this, {
            type: 'default',
            featureSet: data
        }).addTo(this.map);
    }

    _getMapBounds(map_info) {
        // Format follows [y-coordinate, x-coordinate]
    
        map_info.scale_y = parseFloat(map_info.scale_y, 10);
        map_info.scale_x = parseFloat(map_info.scale_x, 10);
        var bottomLeft = [0, 0], topRight = [map_info.scale_y, map_info.scale_x];
    
        if (map_info.orig_x) {
            bottomLeft[1] = -map_info.orig_x
        }
    
        if (map_info.orig_y) {
            bottomLeft[0] = -map_info.orig_y
        }
    
        return {
            'floorbounds': [bottomLeft, topRight],
            'imagebounds': [[0, 0], [map_info.scale_y, map_info.scale_x]],
        };
    };

    changeTheme() {

    }
    // showLabel() {
    //     return this.showLabel;
    // }
}

export default TwoDMap;