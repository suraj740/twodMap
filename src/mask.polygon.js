L.Mask = L.Polygon.extend({
    // options: {
    //     stroke: false,
    //     color: '#333',
    //     fillOpacity: 0.5,
    //     clickable: true,
    //     // outerBounds: new L.LatLngBounds([-90, -360], [90, 360])
    // },

    initialize: function (latLngs, options) {
        console.log(latLngs, options)
        // L.Util.setOptions(this.options, options);
        // this.options = options;

        var outerBoundsLatLngs = [
            options.outerBounds.getSouthWest(),
            options.outerBounds.getNorthWest(),
            options.outerBounds.getNorthEast(),
            options.outerBounds.getSouthEast()
        ];
        L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);
    },

});
L.mask = function (latLngs, options) {
    return new L.Mask(latLngs, options);
};