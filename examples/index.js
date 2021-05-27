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
    zoomControl: !L.Browser.mobile,
    attributionControl: false,
    crs: L.CRS.Simple, // vvv imp.
    // minZoom: 0,
    // zoomOffset: -1,
    maxZoom: 5,
    // projection: L.Projection.LonLat,
    // minZoom: 1,
    zoom: 0,
    // rotate: true,
    // maxBounds: [[0, 0], [310.535, 677.664]],
    projection: L.Projection.LonLat,
    // center: L.latLng(123.0,322),
    center: [0, 0],
    // zoomSnap: 0.25,
    zoomControlPosition: "bottomright",
    // center: L.latLng(37.8, -96)
    // center: latLng([ 46.879966, -121.726909 ])
};
twod.showLabel = true;

twod.initMap('mapid', options);
twod.changeTheme(
    {
        'primary_color': '',
        'secondary_color': '',
        'primary_text_color': '',
        'secondary_text_color': '',
        'hover': '',
        'clicked': '',
        'background': '#bfcab4',
    }
);
(async () => {
    var response = await fetch('./assets/geojson.json');
    var pois = await response.json();
    twod.setGeoJsonData(pois);

    //floor -data
    response = await fetch('./assets/venues.json');
    var venue = await response.json();
    console.log('venue', venue);
    twod._getFloorInformation(venue);
    // twod._selectPlaces("01f0930a08fc4996baa4ca1d5cbef56e")

    //categories -data
    response = await fetch('./assets/categories.json');
    var categories = await response.json()

    twod._addCategoriesToolbar(categories);
    // var categoriesContainer = document.querySelector('#categoriesList')


    // // var categoriesList = '';
    // categories.forEach((category) => {
    //     var categoriesList = '<div class="category-item ripple" id="' + category.id + '"> ' +
    //      '<p>' + category.name + '</p>' +
    //      '<i class="mdi mdi-' + category.icon +' mdi-24px"></i>' +
    //     ' </div>';
    //     categoriesContainer.insertAdjacentHTML('beforeend', categoriesList);
    // });

    // var categoryBtn = document.querySelectorAll('.category-item');
    // categoryBtn.forEach(btn => {
    //     btn.addEventListener('click', (e) => {
    //         // console.log('event', e);
    //         var self = this;
    //         if (!self.previousElement) {
    //             self.previousElement = e.target; 
    //         }
    //         if (!e.target.classList.contains('control-enabled')) {
    //             e.target.classList.add('control-enabled');
    //             if (self.previousElement && self.previousElement !== e.target) {
    //                 self.previousElement.classList.remove('control-enabled');
    //                 self.previousElement = e.target;
    //             }
    //             twod._selectCategory(e.target.id);
    //         }
    //         else {
    //             e.target.classList.remove('control-enabled');
    //             twod._selectCategory(null);
    //         }
    //     });
    // });
    // twod._selectCategory("clothes")
    // var zoomBtn = document.querySelector('#zoomBtn')

    // zoomBtn.addEventListener('click', function(event) {
    //     var zoomBtnSm = document.querySelectorAll('.zoom-btn-sm')
    //     zoomBtnSm.forEach((btn) => {
    //     btn.classList.toggle('scale-out');
    //     })
    // });
    twod.addSearchControl();
})();
// fetch('./assets/pois.json')
//     .then(response => {
//         return response.json();
//     })
//     .then(data => {
//         twod.setGeoJsonData(data)
//         // twod.addRouting(L.latLng(32.8, -96), L.latLng(37.8, -96), true);
//         // twod._selectPlaces("01f0930a08fc4996baa4ca1d5cbef56e")
//         // twod._selectMultiplePlaces(data);
//         twod._getFloorInformation();
//         var zoomBtn = document.querySelector('#zoomBtn')

//         zoomBtn.addEventListener('click', function(event) {
//             var zoomBtnSm = document.querySelectorAll('.zoom-btn-sm')
//             zoomBtnSm.forEach((btn) => {
//             btn.classList.toggle('scale-out');
//             })
//         });
//     });
    


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