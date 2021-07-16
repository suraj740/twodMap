// console.log('test');
// var newLeaflet = new leafletModule();
// console.log('test');
// newLeaflet.initMap();
// console.log('laeflert', Lf);
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
    // minZoom: 2,
    // zoom: 2,
    // rotate: true,
    // maxBounds: [[0, 0], [310.535, 677.664]],
    projection: L.Projection.LonLat,
    // center: L.latLng(123.0,322),
    center: L.latLng(-10, 0),
    // center: [0, 0],
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

    //floor -data
    response = await fetch('./assets/venues.json');
    var venue = await response.json();
    // console.log('venue', venue);
    twod._getFloorInformation(venue);
    // twod._selectPlaces("01f0930a08fc4996baa4ca1d5cbef56e")

    // var response = await fetch('./assets/randburg_geojson.json');
    // var pois = await response.json();
    // twod.setGeoJsonData(pois);

    //categories -data
    // response = await fetch('./assets/categories.json');
    // var categories = await response.json()

    // twod._addCategoriesToolbar(categories);

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
    // twod._addDialog();

    // twod.addSearchControl();
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
