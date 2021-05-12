// console.log('test');
// var newLeaflet = new leafletModule();
// console.log('test');
// newLeaflet.initMap();
console.log('laeflert', Lf);
// Lf.leafletModule.initMap();
var twod = new Lf.TwoDMap();
var options = {
    // layers: [ this.ikeaMaps, this.ikeaOverlay],
    // layers: [this.brooklynMaps],
    // zoomControl: false,
    attributionControl: false,
    crs: L.CRS.Simple, // vvv imp.
    // minZoom: 1,
    // zoomOffset: -1,
    // maxZoom: 18,
    // projection: L.Projection.LonLat,
    // minZoom: 1,
    zoom: 0,
    // rotate: true,
    // maxBounds: [[0, 0], [310.535, 677.664]],
    projection: L.Projection.LonLat,
    // center: L.latLng(123.0,322),
    center: [0, 0],
    zoomSnap: 0.25,
    zoomControlPosition: "bottomright",
    // center: L.latLng(37.8, -96)
    // center: latLng([ 46.879966, -121.726909 ])
};
twod.showLabel = false;

twod.initMap('mapid', options);
fetch('./assets/pois.json')
    .then(response => {
        return response.json();
    })
    .then(data => {
        twod.setGeoJsonData(data)
        // twod.addRouting(L.latLng(32.8, -96), L.latLng(37.8, -96), true);
        // twod._selectPlaces("01f0930a08fc4996baa4ca1d5cbef56e")
        // twod._selectMultiplePlaces(data);
        twod._getFloorInformation([
            {
                "image_list_id": "",
                "name": [
                    {
                        "text": "Southgate Plaza",
                        "language": "en_US"
                    }
                ],
                "floor": [
                    {
                        "site_index": "Ground Level",
                        "default": true,
                        "floor_id": "e5fb0ba76b094919be2b69d227a91c8f",
                        "number": "1",
                        "alias": [
                            {
                                "text": "Ground Level",
                                "language": "en_US"
                            }
                        ],
                        "e_map": {
                            "bn": "",
                            "sn": "",
                            "fn": ""
                        },
                        "type": "shopping",
                        "floor_zones": [
                            "c2ff9951936742fbae80ffcf004f8197",
                            "730a330b53d14e95b4321acccc7a3033",
                            "94a6ded9a46740ccbcf455daf005dc96",
                            "ab75f8ef05284e9e864ecf5529fe49eb",
                            "7d5c0d47f9124083b773a3574d83007b",
                            "d1261aa01f224e93b764a9b5d01de80f",
                            "43d84138183040a7b7532d6aaebda3d7"
                        ],
                        "map_info": {
                            "origin": "123.0,322",
                            "floor_offset": {
                                "production": [
                                    [-12.34, -12.43],
                                    [43, 50]
                                ]
                            },
                            "name": [
                                {
                                    "text": "Ground Level",
                                    "language": "en_US"
                                }
                            ],
                            "title": [
                                {
                                    "text": "Ground Level",
                                    "language": "en_US"
                                }
                            ],
                            "file_type": "png",
                            "use_scope": "INTERNAL",
                            "coordinate_system": "WGS84",
                            "ref_geo2": "10.0,10.0",
                            "ref_geo1": "10.0,10.0",
                            "image_id": {
                                "production": "85693da63af7456f83296cdcffe9a037",
                                "dev": "85693da63af7456f83296cdcffe9a037",
                                "calibration": "85693da63af7456f83296cdcffe9a037"
                            },
                            "url": [
                                {
                                    "text": "Ground Level",
                                    "language": "en_US"
                                }
                            ],
                            "scale_x": "677.664",
                            "scale_y": "310.535",
                            "dim_x": 677.664,
                            "dim_y": 310.535,
                            "orig_x": 0,
                            "orig_y": 0,
                            "map_type": "vg_3d"
                        }
                    }
                ],
                "gla": 36000,
                "number": "3",
                "geo_location": {
                    "type": "Point",
                    "coordinates": [-25.7656675, 57.4970622]
                },
                "building_id": "91a338c5ad99430681bd7db772bddc01"
            }
        ]);
        var zoomBtn = document.querySelector('#zoomBtn')

        zoomBtn.addEventListener('click', function(event) {
            var zoomBtnSm = document.querySelectorAll('.zoom-btn-sm')
            zoomBtnSm.forEach((btn) => {
            btn.classList.toggle('scale-out');
            })
        });
    });
    


function _getMapBounds(map_info) {
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

var mapInfo = {
    "origin": "123.0,322",
    "floor_offset": {
        "production": [
            [
                -12.34,
                -12.43
            ],
            [
                43,
                50
            ]
        ]
    },
    "name": [
        {
            "text": "Ground Level",
            "language": "en_US"
        }
    ],
    "title": [
        {
            "text": "Ground Level",
            "language": "en_US"
        }
    ],
    "file_type": "png",
    "use_scope": "INTERNAL",
    "coordinate_system": "WGS84",
    "ref_geo2": "10.0,10.0",
    "ref_geo1": "10.0,10.0",
    "image_id": {
        "production": "85693da63af7456f83296cdcffe9a037",
        "dev": "85693da63af7456f83296cdcffe9a037",
        "calibration": "85693da63af7456f83296cdcffe9a037"
    },
    "url": [
        {
            "text": "Ground Level",
            "language": "en_US"
        }
    ],
    "scale_x": "677.664",
    "scale_y": "310.535",
    "dim_x": 677.664,
    "dim_y": 310.535,
    "orig_x": 0.0,
    "orig_y": 0.0,
    "map_type": "vg_3d"
}

var boundSet = self._getMapBounds(mapInfo);
console.log('boundSet', boundSet);