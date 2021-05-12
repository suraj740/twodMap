L.Control.Toolbar = L.Control.extend({
    options: {
        'default' : {
            position: 'bottomright'
        }
    },

    initialize: function (osMapInstance, options) {
        this._osMap = osMapInstance;
        console.log('featureSet', options.featureSet);
        this.options['retail'] = this.options['default'];
        if (options.type && this.options[options.type]) {
            this.options = this.options[options.type];
        }
        else {
            // console.log('inside elses');
            this.options = this.options['default'];
        }

        // console.log('this.options', this.options, options.featureSet);


        // this._osMap._jQuery.map(this.options.features, function (item) {
        //     item.enable = false;
        //     if (Array.isArray(item.sub)) {
        //         item.sub.map(function (sub) {
        //             sub.enable = false;
        //             // console.log('sub ', options.featureSet.includes(sub.label.toLowerCase()));
        //             if (options.featureSet.includes(sub.label.toLowerCase())) {
        //                 if (options.featureSet.includes(item.label.toLowerCase())) {
        //                     item.enable = true;
        //                 }
        //                 sub.enable = true;
        //             }
        //         });
        //     }
        //     else if (Array.isArray(item.sticky_sub)) {
        //         // var index = item.sticky_sub.findIndex(function (sub) {
        //         //     return sub.label === 'Abandonment';
        //         // });
        //         // if (index > -1) {
        //         //     // console.log(osMapInstance._mapOptions.venueId);
        //         //     if (osMapInstance._mapOptions.venueId === 'c0fcb3173449416fa97853f8e2261e6c' ||
        //         //      osMapInstance._mapOptions.venueId === '80736d3841be43eb84468e90d310a931') {
        //         //         item.sticky_sub.splice(index, 1);
        //         //     }
        //         // }
        //         item.sticky_sub.map(function (sub) {
        //             // console.log('sticky', sub, options.featureSet);
        //             options.featureSet = options.featureSet.map(function (item) {
        //                 return item.replace('-', ' ');
        //             });
        //             // console.log(options.featureSet);
        //             sub.enable = false;
        //             // console.log('sub ', options.featureSet.includes(sub.label.toLowerCase()));
        //             if (options.featureSet.includes(sub.label.toLowerCase())) {
        //                 if (options.featureSet.includes(item.label.toLowerCase())) {
        //                     item.enable = true;
        //                 }
        //                 sub.enable = true;
        //             }
        //         });
        //     }
        //     else {
        //         // console.log('item ', options.featureSet.includes(item.label.toLowerCase()));
        //         if (options.featureSet.includes(item.label.toLowerCase())) {
        //             item.enable = true
        //         }
        //     }
        // });
        // delete options.featureSet;

        // this._osMap._jQuery.extend(true, this.options, options);
        this.toolbarOptions = this.options;
        // console.log(this.toolbarOptions);
        // this.jquery = $;
        // this.toolbarContainer = '';
        // this.jquery.extend(true, this.options, options);
        // this._osmap = context;
    },

    // onAdd: function(map) {

    //     var self = this;
    //     self.toolbarContainer = L.DomUtil.create('div', 'wrapper');
        
    //     self.inputElement = L.DomUtil.create('input', 'customBox', self.toolbarContainer);
    //     self.inputElement.setAttribute('type', 'checkbox');
    //     self.inputElement.setAttribute('id', 'customBox');

    //     self.label = L.DomUtil.create('label', '', self.toolbarContainer);
    //     self.label.setAttribute('for', 'customBox');

    //     var floors = [
    //         {subItem: 'mdi mdi-stairs mdi-24px', class: 'one', id: '013be8af39c441b089f27cb936fee5c6'},
    //         {subItem: 'mdi mdi-food-fork-drink mdi-24px', class : 'two', id: '01f0930a08fc4996baa4ca1d5cbef56e'},
    //         {subItem: 'mdi mdi-parking mdi-24px', class: 'three', id: '04abc1a54b28424bb8881e076ebdaa65'}
    //     ];
    //     floors.map((fl) => {
    //         var subitem = L.DomUtil.create('div', fl.class, self.toolbarContainer);
    //         L.DomUtil.create('i', fl.subItem, subitem);
    //         subitem.setAttribute('id', fl.id);
    //         L.DomEvent
    //         .on(subitem, 'click', L.DomEvent.stopPropagation)
    //         .on(subitem, 'dblclick', L.DomEvent.stopPropagation)
    //         .on(subitem, 'wheel', L.DomEvent.stopPropagation)
    //         .on(subitem, 'click', self._selectAreas, self);
    //     });

    //     L.DomEvent
    //     .on(self.label, 'click', L.DomEvent.stopPropagation)
    //     .on(self.label, 'dblclick', L.DomEvent.stopPropagation)
    //     .on(self.label, 'wheel', L.DomEvent.stopPropagation)
    //     return self.toolbarContainer;
    // },
    onAdd: function(map) {

        var self = this;
        self.previousElement = ''
        self.toolbarContainer = L.DomUtil.create('div', 'zoom');
        
        self.zoomFab = L.DomUtil.create('a', 'zoom-fab zoom-btn-large', self.toolbarContainer);
        self.zoomFab.setAttribute('id', 'zoomBtn');
        L.DomUtil.create('i', 'mdi mdi-domain mdi-24px', self.zoomFab);

        self.zoomMenu = L.DomUtil.create('ul', 'zoom-menu', self.toolbarContainer);

        var floors = [
            {class: 'mdi mdi-stairs mdi-24px', id: '013be8af39c441b089f27cb936fee5c6 01f0930a08fc4996baa4ca1d5cbef56e'},
            // {class: 'mdi mdi-food-fork-drink mdi-24px', id: '01f0930a08fc4996baa4ca1d5cbef56e'},
            {class: 'mdi mdi-parking mdi-24px', id: '50428e8a52f343f594d55abc038129b2 68799e931b2949338bc20591e43adc6f 6893c9a23d0a441d93900b6c2a2a14c6 6fa02129add644d2a0d36f2ede0631b0 e11dd4a7261244d7872c2c2fd0b53405'}
        ];
        floors.map((fl) => {
            var list = L.DomUtil.create('li', '', self.zoomMenu);
            list.setAttribute('id', fl.id);
            var listBtn = L.DomUtil.create('a', 'zoom-fab zoom-btn-sm scale-transition scale-out', list);
            L.DomUtil.create('i', fl.class, listBtn);
            L.DomEvent
            .on(list, 'click', L.DomEvent.stopPropagation)
            .on(list, 'dblclick', L.DomEvent.stopPropagation)
            .on(list, 'wheel', L.DomEvent.stopPropagation)
            .on(list, 'click', self._selectAreas, self);
        });

        L.DomEvent
        .on(self.zoomFab, 'click', L.DomEvent.stopPropagation)
        .on(self.zoomFab, 'dblclick', L.DomEvent.stopPropagation)
        .on(self.zoomFab, 'wheel', L.DomEvent.stopPropagation)
        return self.toolbarContainer;
    },

    _processToolbarFeatures: function (item, self) {
        var uiItem, element, spanLabel;
        // console.log(item);
        if (item.independent) {
            uiItem = L.DomUtil.create('div', 'ui-item', self.independentElements);
            uiItem.setAttribute('independent', item.independent);
        }
        else {
            uiItem = L.DomUtil.create('div', 'ui-item', self.toolbarElements);
        }
        spanLabel = L.DomUtil.create('span', 'item-label', uiItem);
        spanLabel.innerHTML = item.label;
        if (item.alternate) {
            spanLabel.innerHTML = item.alternate;
        }
        element = L.DomUtil.create('li', 'mdi mdi-' + item.icon + ' mdi-18px', uiItem);
        self.controlElements[item.layerName] = item;
        uiItem.setAttribute('action', item.event);
        uiItem.setAttribute('id', item.layerName);
        uiItem.setAttribute('data-title', item.label);
        if ((!item.sub && !item.sticky_sub) && item.layerName) {
            uiItem.setAttribute('layer', item.layerName);
        }
        if (item.sub) {
            L.DomUtil.create('i', 'sub-options mdi mdi-chevron-down', uiItem);
            L.DomEvent
                .on(uiItem, 'click', L.DomEvent.stopPropagation)
                .on(uiItem, 'dblclick', L.DomEvent.stopPropagation)
                .on(uiItem, 'wheel', L.DomEvent.stopPropagation)
                .on(uiItem, 'click', self._createSuboptions, self);
        }
        else if (item.sticky_sub) {
            // console.log('inside else if', uiItem);
            // L.DomUtil.create('i', 'sticky-sub-options mdi mdi-chevron-down', uiItem);
            L.DomEvent
                .on(uiItem, 'click', L.DomEvent.stopPropagation)
                .on(uiItem, 'dblclick', L.DomEvent.stopPropagation)
                .on(uiItem, 'wheel', L.DomEvent.stopPropagation)
                .on(uiItem, 'click', self._createStickySuboptions, self);
        }
        else {
            //start, --> to enable journey map by default when area is selected --sg #1211
            if (self._osMap._mapOptions.areaId && $(uiItem).attr('layer') === '_journeyMapLayer') {
                setTimeout(function () {
                    self._enableFeature(undefined, '_shuffleLayers', '_journeyMapLayer', true, uiItem);
                }, 100);
                // self._enableFeature();
            }//end

            //start, --> to enable journey map by default when area is selected --sg #1211
            if (self._osMap._mapOptions.areaId && $(uiItem).attr('layer') === '_trafficFlowLayer') {
                setTimeout(function () {
                    self._enableFeature(undefined, '_shuffleLayers', '_trafficFlowLayer', true, uiItem);
                }, 100);
                // self._enableFeature();
            }//end

            L.DomEvent
                .on(uiItem, 'click', L.DomEvent.stopPropagation)
                .on(uiItem, 'dblclick', L.DomEvent.stopPropagation)
                .on(uiItem, 'wheel', L.DomEvent.stopPropagation)
                .on(uiItem, 'click', self._enableFeature, self);
        }
    },

    removeSub: function (e) {
        var self = this;
        // console.log('Map click ', e);
        var subId = self.subMenuId;
        var parent = self.current;
        // console.log('subId', self, subId, parent, L.DomUtil.get(subId));
        if (parent && subId && L.DomUtil.get(subId)) {
            L.DomUtil.addClass(L.DomUtil.get(subId), 'slideMenuUp');
            L.DomUtil.removeClass(L.DomUtil.get(parent), 'control-enabled');
            var timeOut = setTimeout(function () {
                if (L.DomUtil.get(subId)) {
                    L.DomUtil.remove(L.DomUtil.get(subId));
                }
                clearTimeout(timeOut);
            }, 500);
        }

    },

    _addToolbarFeature: function (feature) {
        // var self = this;
        // this.toolbarOptions.features.push(feature);
        this._processToolbarFeatures(feature, this);
        // console.log('Toolbar options', this.toolbarOptions);
    },

    _selectAreas: function (e) {
        var self = this;
        // console.log('_selectAreas', e.currentTarget.getAttribute('id'), self._osMap);
        let id = e.currentTarget.getAttribute('id');
        if (!self.previousElement) {
            self.previousElement = e.currentTarget; 
        }
        if (!L.DomUtil.hasClass(e.currentTarget, 'control-enabled')) {
            L.DomUtil.addClass(e.currentTarget, 'control-enabled');
            if (self.previousElement && self.previousElement !== e.currentTarget) {
                L.DomUtil.removeClass(self.previousElement, 'control-enabled');
                self.previousElement = e.currentTarget;
            }
            self._osMap._selectMultiplePlaces(id.split(' '));
        }
        else {
            L.DomUtil.removeClass(e.currentTarget, 'control-enabled');
            self._osMap._selectMultiplePlaces([]);
        }
        

    },

    _createSuboptions: function (e) {
        // console.log('inside sub options');
        var self = this;
        var id = e.currentTarget.getAttribute('id');
        if (self.subMenuId && self.subMenuId !== 'sub' + id) {
            self.removeSub();
        }
        self.current = id;
        self.subMenuId = 'sub' + id;
        // var timeOut = setTimeout(function () {
        //     self.current = id;
        //     self.subMenuId = 'sub' + id;
        //     clearTimeout(timeOut);
        // }, 500);

        if (!L.DomUtil.hasClass(e.currentTarget, 'control-enabled')) {
            var subContainer = L.DomUtil.create('ul', 'engage-sub-control slideMenuDown', e.currentTarget);
            subContainer.setAttribute('id', 'sub' + id);
            L.DomUtil.addClass(e.currentTarget, 'control-enabled');
            self._osMap._jQuery.map(self.controlElements[id].sub, function (subItem) {

                if (!subItem.tester) {
                    var subElement = L.DomUtil.create('div', 'ui-item', subContainer);
                    subElement.setAttribute('id', subItem.layerName);
                    var spanLabel = L.DomUtil.create('span', 'item-label', subElement);
                    spanLabel.innerHTML = subItem.label;
                    L.DomUtil.create('li', 'mdi mdi-' + subItem.icon + ' mdi-18px', subElement);

                    // var subElement = L.DomUtil.create('li', 'sub-control', subContainer);
                    subElement.setAttribute('action', subItem.event);
                    subElement.setAttribute('layer', subItem.layerName);

                    if (subItem.independent) {
                        subElement.setAttribute('independent', subItem.independent);
                    }
                    // if (subItem.layer) {
                    // }
                    if (self._osMap.mapLayers[subItem.layerName].options.toggle) {
                        L.DomUtil.addClass(subElement, 'control-enabled');
                    }
                    // var option = L.DomUtil.create('span', '', subElement);
                    // subElement.innerHTML = subItem.name;
                    L.DomEvent
                        .on(subElement, 'click', L.DomEvent.stopPropagation)
                        .on(subElement, 'dblclick', L.DomEvent.stopPropagation)
                        .on(subElement, 'wheel', L.DomEvent.stopPropagation)
                        .on(subElement, 'click', self._enableFeature, self);
                }
            });
        }
        else {
            // console.log('Remove sub options');
            self.removeSub();
        }

        return subContainer;
    },

    _enableFeature: function (e, action, layer, independent, uiItem) {
        var self = this;
        // console.log('enable Feature', e, action, layer);
        if (e) {
            // console.log(e.currentTarget);
            var action = e.currentTarget.getAttribute('action');
            var layer = e.currentTarget.getAttribute('layer');
        }
        // console.log(e);
        // console.log('self', self, layer, action);
        if (layer === '_journeyMapLayer' || layer === '_trafficFlowLayer') {
            //  Todo: Temporary to clear areaMap layer when clicking on journeyMap Layer
            // self.subMenuId = 'sticky_sub_areaMapLayer';
            self.subMenuId = 'sticky_sub' + self.current; //dynamically removing layers when journey layer is enabled --sg
        }
        // self.removeSub();
        if (e) {
            var independent = e.currentTarget.getAttribute('independent');
        }
        // console.log('independent', independent);
        // added !layer.includes('areaMap') so that it will not remove buttons inside areamap 
        if (layer && !layer.includes('heatMap') && !layer.includes('areaMap') && !layer.includes('live') && !layer.includes('historical') && independent) {
            // console.log('isnide sticky enabkle feature')
            self.removeSub();
        }
        self._osMap._jQuery.each(self._osMap.mapLayers, function (key, value) {
            if (self._osMap.mapLayers[layer].options.type === 'floormap' && value.options.type === 'floormap' && value.options.toggle) {
                // console.log('inside if');
                self._osMap._map.parent[action](key);
                if (L.DomUtil.get(key)) {
                    L.DomUtil.removeClass(L.DomUtil.get(key), 'control-enabled');
                }
            }
            if (independent && !value.options.overlay && value.options.toggle && key !== layer) {
                // console.log('inside if', key);
                self._osMap._map.parent[action](key);
                if (L.DomUtil.get(key)) {
                    L.DomUtil.removeClass(L.DomUtil.get(key), 'control-enabled');
                }
            }
            // else if (!independent) { // for sticky sub
            //     if (!value.options.overlay && value.options.toggle && key !== layer) {
            //         // self._osMap._map.parent[action](key);
            //         if (L.DomUtil.get(key)) {
            //             L.DomUtil.removeClass(L.DomUtil.get(key), 'control-enabled');
            //         }
            //     }
            // }
        });
        if (layer) {
            // console.log(self._osMap._map.parent[action], layer);
            self._osMap._map.parent[action](layer);
            // console.log(self._osMap.mapLayers[layer].options, layer);
            // if (layer === '_historicalViewLayer') {
            //     // self._osMap.mapLayers['_historicalViewLayer'].options.toggle = true;
            //     self._osMap.mapLayers[layer].options.toggle = false;
            // }

            if (self._osMap.mapLayers[layer].options.toggle) {
                // console.log('inside if');
                if (e) {
                    L.DomUtil.addClass(e.currentTarget, 'control-enabled');
                }
                else {
                    // add control on journey map by default --sg #1211
                    L.DomUtil.addClass(uiItem, 'control-enabled');
                }
            }
            else {
                // console.log('inside else');
                if (e) {
                    L.DomUtil.removeClass(e.currentTarget, 'control-enabled');
                }
                else {
                    // remove control on journey map by default --sg #1211
                    L.DomUtil.removeClass(uiItem, 'control-enabled');
                }
            }
        } else {
            // console.log('inside else');
            self._osMap._map.parent[action]();
        }
    },
    onRemove: function(map) {
        L.DomUtil.remove(this.toolbarContainer);
    }
});