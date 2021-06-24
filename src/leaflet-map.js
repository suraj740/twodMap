var L = require('leaflet');
require('leaflet-draw');
require('./twodmap.center.control.js');
require('leaflet-routing-machine');
require('leaflet-control-geocoder');
require('./mouseposition.control.js');
require('./mask.polygon.js');
require('./bouncemarker.js');
require('./twodmap-toolbar.control.js');
require('./twodmap.search.control.js');
require('./twodmap.sidebar.js');
require('./boundarycanvas.js');
require('./twodmap.dialog.js');
var $ = require('jquery');
var turf = require('@turf/turf');
var jstree = require('jstree');
class TwoDMap {
    constructor() {
        this.showLabel = true;
        this.maskAdded = {};
        this.marker = {};
        this.currentFloorDetail = {};
        this.categories = [];
        this.$ = $;
        console.log('jstree', jstree);
    }
    initMap(mapId, options) {
        this.map = L.map(mapId, options);
        // this.map.setMaxBounds(this.map.getBounds());
        // var mapBounds = L.latLngBounds(bounds);
        // this.map.setMaxBounds(mapBounds);
        this.map.fitBounds([[-35, 0], [355, 390]], {
            padding: [20, 30]
        });
        // this.map.setMaxBounds([[0, 0], [310.535, 677.664]]);
        // L.TileLayer.boundaryCanvas('https://wallpapercave.com/wp/XqRBXyO.jpg', {boundary: this.data, tileSize: 1200, }).addTo(this.map)

        // var sidebar = L.control.sidebar('sidebar', {position: 'right'}).addTo(this.map);
        L.imageOverlay('map_bg.png', [[-35, 0], [355, 390]]).addTo(this.map);
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


    _getFloorInformation(venue) {
        var toolbar = new L.Control.Toolbar(this, {
            type: 'default',
            position : 'bottomright',
            categories: null,
            venue: venue,
        }).addTo(this.map);
        // var boundSet = this._getMapBounds(data[0].floor[0].map_info);
        // this._bounds = boundSet['imagebounds'];
        // this._floorBounds = boundSet['floorbounds'];
        // this.map.fitBounds(this._bounds, {
        //     padding: [20, 30]
        // });
        this.map.setMaxBounds([[-35, 0], [355, 390]]);
        // this._addToolbar(data);
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
            if (!this.showLabel || !layer.getTooltip()) {
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
        let ploygonArea = {}
        const onEachFeature = (feature, layer) => {
            // console.log('feature', feature);
            ploygonArea[feature.properties.pid] = turf.area(turf.toWgs84(feature));
            // console.log(feature, layer);
            
            if (this.showLabel) {
                layer.bindTooltip((feature.properties.name[0].text.split(' ').map(name => {
                    return name[0]
                }).join('')), {
                    permanent: true,
                    direction: "center",
                    className: "my-labels",
                }).openTooltip();
                // console.log(layer.getTooltip());
            }


            layer.on('reclipped', function (ev) {
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
       
        this.featuresLayer = geojson;
        // console.log('geojson', geojson);

        
        this.map.on('zoom', (e) => {
            // console.log('area', ploygonArea);
            let zoomLevel = this.map.getZoom();
            console.log('zoom level', zoomLevel)
            this.featuresLayer.eachLayer((layer) => {//restore feature color
                // layer.unbindTooltip();
                var textSize = ((ploygonArea[layer.feature.properties.pid]/ 4047) * zoomLevel) / layer.feature.properties.name[0].text.length;
                var tipContent = '';
                if (textSize < 0.06) {
                    tipContent = (layer.feature.properties.name[0].text.split(' ').map(name => {
                        return name[0]
                    }).join(''));

                    layer.setTooltipContent(tipContent);
                }
                else {
                    tipContent = layer.feature.properties.name[0].text;
                    layer.setTooltipContent(tipContent);
                }
                // console.log(textSize, tipContent);
                // if(!layer.getTooltip()) {
                //     layer.bindTooltip(layer.feature.properties.name[0].text, {
                //         permanent: false,
                //         direction: "center",
                //         className: "my-labels"
                //     }).openTooltip();
                // }

                // else if (layer.getTooltip()) {
                //     layer.unbindTooltip();
                // }
            });
            
        })
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
                .bindPopup(data.properties.name[0].text, { className: 'popup-marker', closeOnClick: false, closeButton: false }).openPopup([center[1], center[0]]);
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
                    .bindPopup(data.properties.name[0].text, { className: 'popup-marker', closeOnClick: false, closeButton: false, autoClose: false }).openPopup([centers[key][1], centers[key][0]]);
            });
        }
    }
    _selectCategory(id) {
        this._clearPreviousLayers();

        // console.log('this.data', this.data);
        var data = this.data.filter(item => item.properties.category_ids ? item.properties.category_ids.includes(id) : false);
        var mask = [];
        var centers = [];
        if (data.length) {
            data.map((id) => {
                // if (data.geometry.type === 'Polygon') {
                mask.push([]);
                // }
            });
            data.map((item, key) => {
                
                if (item.geometry.type === 'Polygon') {
                    var latLngs = item.geometry.coordinates[0];
                    // var latLngs = area.area.polygon.coordinates[0];
                    centers.push(
                        turf.centerOfMass(item).geometry.coordinates
                    );
                    // console.log('latLngs', latLngs, key, mask.length);
                    latLngs.map((latlng) => {
                        mask[key].push(new L.LatLng(latlng[1], latlng[0]));
                    });
                }
            });
            // console.log('mask', mask, centers);
            this.maskAdded[id] = L.mask(mask, {
                stroke: false,
                color: '#333',
                fillOpacity: 0.5,
                clickable: true,
                className: 'mask',
                outerBounds: new L.LatLngBounds([[-35, 0], [355, 390]])
            }).addTo(this.map);

            var myIcon = L.icon({
                iconUrl: './marker.png',
                iconSize: [28, 45],
                iconAnchor: [10, 44],
                popupAnchor: [5, -50],
                // shadowUrl: './pngegg.png',
                // shadowSize: [28, 65],
                // shadowAnchor: [22, 64]
            });
            data.map((item, key) => {
                // var data = this.data.find(item => item.properties.pid === id);
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
                this.marker[key] = L.marker([centers[key][1], centers[key][0]], {
                    icon: myIcon, bounceOnAdd: true,
                    bounceOnAddOptions: { duration: 500, height: 150, loop: 1 },
                    bounceOnAddCallback: function () { console.log("done"); }
                })
                    .addTo(this.map)
                    .bindPopup(item.properties.name[0].text, { className: 'popup-marker', closeOnClick: false, closeButton: false, autoClose: false }).openPopup([centers[key][1], centers[key][0]]);
            });
        }
    }

    _addCategoriesToolbar(data) {
        this._engageControl = new L.Control.Toolbar(this, {
            type: 'default',
            position : 'bottomleft',
            categories: data,
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


    addSearchControl() {
        // console.log('this.featuresLayer', this.featuresLayer)
        var searchControl = new L.Control.Search({
            layer: this.featuresLayer,
            propertyName: "name.0.text",
            collapsed: false,
            autoCollapse: false,
            position: 'topright',
            marker: false,
            position: 'topcenter',
            categories: this.categories,
            $: $,
            dialog: this.dialog,
            moveToLocation: function (latlng, title, map) {
                //map.fitBounds( latlng.layer.getBounds() );
                var zoom = map.getBoundsZoom(latlng.layer.getBounds());
                map.setView(latlng, zoom); // access the zoom
            }
        });


        searchControl.on('search:locationfound',(e) => {

            //console.log('search:locationfound', );

            //map.removeLayer(this._markerSearch)

            e.layer.setStyle({ fillColor: '#3f0', color: '#0f0' });

            // e.layer.bindTooltip(e.layer.feature.properties.name[0].text, {
            //     permanent: false,
            //     direction: "center",
            //     className: "my-labels"
            // }).openTooltip();
            if (e.layer._popup)
                e.layer.openPopup();

        })
        .on('search:collapsed', (e) => {
            this.featuresLayer.eachLayer((layer) => {	//restore feature color
                this.featuresLayer.resetStyle(layer);
            });
        });

        this.map.addControl(searchControl);
    }


    _addDialog() {
        this.dialog = L.control.dialog({
            position: 'topcenter',
            anchor: [50],
            initOpen: false
        }).addTo(this.map);
        this.dialog.freeze();
    }

    changeTheme(data) {
        // const data1 = {
        //     'primary_color': '',
        //     'secondary_color': '',
        //     'primary_text_color': '',
        //     'secondary_text_color': '',
        //     'hover': '',
        //     'clicked': '',
        //     'background': '',
        //     // "default": "",
        //     // "icon": {
        //     //     "marker": "",
        //     //     "offer": "",
        //     //     "": ""
        //     // }
        // }
        let r = document.querySelector(':root');
        Object.entries(data).map((item, key) => {
            r.style.setProperty('--' + item[0], item[1]);
        });
    }

    _getReadableString(value) {
        value = value.toLowerCase()
        .replace(/([^a-z])([a-z])(?=[a-z]{2})|^([a-z])/g,
        function (_, g1, g2, g3) {
            return (typeof g1 === 'undefined') ?
            g3.toUpperCase() :
            g1 + g2.toUpperCase();
        });
        value = value.replace(/[_]/g, ' ');
        return value;
    }

    _getTranslatedText(translateArray, languageCode) {
        var text = '';
        languageCode = languageCode ? languageCode: 'en_US';
        if (translateArray !== undefined) {
            translateArray.map((value, index) => {
                languageCode = languageCode.replace(/['"]+/g, '');
                // self._log('value in languageArr:', value.language , languageCode);
                if (value.language === languageCode) {
                    text = value.text;
                    // self._log('test', text);
                }
            });
        }
        return text;
    }
    // showLabel() {
    //     return this.showLabel;
    // }
}

export default TwoDMap;