L.Control.Toolbar = L.Control.extend({
    options: {
        'default' : {
            position: 'bottomcenter'
        }
    },

    initialize: function (osMapInstance, options) {
        this._twodMap = osMapInstance;
        // console.log('featureSet', options.featureSet);
        // this.options['retail'] = this.options['default'];
        this.options['default']['position'] = options.position;
        this.options['default']['categories'] = options.categories || null;
        this.options['default']['venue'] = options.venue || null;
        if (options.type && this.options[options.type]) {
            this.options = this.options[options.type];
        }
        else {
            // console.log('inside elses');
            this.options = this.options['default'];
        }

        console.log('this.options', this.options);


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

    onAdd: function(map) {
        var self = this;

        if (self.options.categories) {
            return self.createCategoriesToolbar(self.options.categories, self);
        }
        else if (self.options.venue) {
            return self.createFloorSelection(self.options.venue, self);
        }
    },
    // onAdd: function(map) {

    //     var self = this;
    //     self.previousElement = ''
    //     self.toolbarContainer = L.DomUtil.create('div', 'zoom');
        
    //     self.zoomFab = L.DomUtil.create('a', 'zoom-fab zoom-btn-large', self.toolbarContainer);
    //     self.zoomFab.setAttribute('id', 'zoomBtn');
    //     L.DomUtil.create('i', 'mdi mdi-domain mdi-24px', self.zoomFab);

    //     self.zoomMenu = L.DomUtil.create('ul', 'zoom-menu', self.toolbarContainer);

    //     var floors = [
    //         {class: 'mdi mdi-stairs mdi-24px', id: '013be8af39c441b089f27cb936fee5c6 01f0930a08fc4996baa4ca1d5cbef56e'},
    //         // {class: 'mdi mdi-food-fork-drink mdi-24px', id: '01f0930a08fc4996baa4ca1d5cbef56e'},
    //         {class: 'mdi mdi-parking mdi-24px', id: '50428e8a52f343f594d55abc038129b2 68799e931b2949338bc20591e43adc6f 6893c9a23d0a441d93900b6c2a2a14c6 6fa02129add644d2a0d36f2ede0631b0 e11dd4a7261244d7872c2c2fd0b53405'}
    //     ];
    //     floors.map((fl) => {
    //         var list = L.DomUtil.create('li', '', self.zoomMenu);
    //         list.setAttribute('id', fl.id);
    //         var listBtn = L.DomUtil.create('a', 'zoom-fab zoom-btn-sm scale-transition scale-out', list);
    //         L.DomUtil.create('i', fl.class, listBtn);
    //         L.DomEvent
    //         .on(list, 'click', L.DomEvent.stopPropagation)
    //         .on(list, 'dblclick', L.DomEvent.stopPropagation)
    //         .on(list, 'wheel', L.DomEvent.stopPropagation)
    //         .on(list, 'click', self._selectAreas, self);
    //     });

    //     L.DomEvent
    //     .on(self.zoomFab, 'click', L.DomEvent.stopPropagation)
    //     .on(self.zoomFab, 'dblclick', L.DomEvent.stopPropagation)
    //     .on(self.zoomFab, 'wheel', L.DomEvent.stopPropagation)
    //     return self.toolbarContainer;
    // },



    createCategoriesToolbar: function (categories, self) {

        self.previousElement = ''
        self.toolbarContainer = L.DomUtil.create('div', 'scrollmenu');

        categories.filter(c => c.type === 'main').slice(0, 2).map((category) => {

            let list = L.DomUtil.create('li', 'ripple', self.toolbarContainer);
            list.style.backgroundColor = '#' + category.color;
            list.setAttribute('id', category.id);
            list.setAttribute('title', category.name);

            let listContent = L.DomUtil.create('div', '', list);
            listContent.style.display = 'flex';
            listContent.style.flexDirection = 'column';
            L.DomUtil.create('i', 'mdi mdi-' + category.icon + ' mdi-24px' , listContent);
            // let title = L.DomUtil.create('span', '', listContent);
            // title.innerHTML = category.name.substring(0, 1);
            L.DomEvent
            .on(list, 'click', L.DomEvent.stopPropagation)
            .on(list, 'dblclick', L.DomEvent.stopPropagation)
            .on(list, 'wheel', L.DomEvent.stopPropagation)
            .on(list, 'click', self._selectItem, self);
        });

        categories.filter(c => c.parent === '1722532bfca54366bdfcc0278c064877').map((category) => {

            let list = L.DomUtil.create('li', 'ripple', self.toolbarContainer);
            list.style.backgroundColor = '#' + category.color;
            list.setAttribute('id', category.id);
            list.setAttribute('title', category.name);

            let listContent = L.DomUtil.create('div', '', list);
            listContent.style.display = 'flex';
            listContent.style.flexDirection = 'column';
            listContent.style.alignItems = 'center';
            // L.DomUtil.create('i', 'mdi mdi-' + category.icon + ' mdi-24px' , listContent);
            if (category.image) {
                let img = L.DomUtil.create('img', '', listContent);
                img.setAttribute('src', `./${category.image}.png`);
                img.setAttribute('height', '25');
                img.setAttribute('width', '25');
            }
            else {
                L.DomUtil.create('i', 'mdi mdi-' + category.icon + ' mdi-24px' , listContent);
            }
            
            // let title = L.DomUtil.create('span', '', listContent);
            // title.innerHTML = category.name.substring(0, 1);
            L.DomEvent
            .on(list, 'click', L.DomEvent.stopPropagation)
            .on(list, 'dblclick', L.DomEvent.stopPropagation)
            .on(list, 'wheel', L.DomEvent.stopPropagation)
            .on(list, 'click', self._selectPois, self);
        });
        L.DomEvent
        .on(self.toolbarContainer, 'click', L.DomEvent.stopPropagation)
        .on(self.toolbarContainer, 'dblclick', L.DomEvent.stopPropagation)
        .on(self.toolbarContainer, 'wheel', L.DomEvent.stopPropagation)
        .on(self.toolbarContainer, 'scroll', L.DomEvent.stopPropagation);
        return self.toolbarContainer;
    },

    createFloorSelection: function (venue, self) {
        self.toolbarContainer = L.DomUtil.create('div', 'zoom');

        venue.building.map((building) => {
            self.zoomFab = L.DomUtil.create('a', 'zoom-fab zoom-btn-large', self.toolbarContainer);
            self.zoomFab.setAttribute('id', 'zoomBtn ' + building.building_id);
            self.zoomFab.setAttribute('title', building.name[0].text);
            L.DomUtil.create('i', 'mdi mdi-domain mdi-24px', self.zoomFab);

            self.zoomMenu = L.DomUtil.create('ul', 'zoom-menu', self.toolbarContainer);
            self.listBtn = [];
            building.floor.map((fl, key) => {
                if (key === 0 && !Object.keys(self._twodMap.currentFloorDetail).length) { // by default select first floor
                    self._twodMap.currentFloorDetail = fl;
                    self._twodMap._changeFloorMap(self._twodMap.currentFloorDetail);
                }
                var list = L.DomUtil.create('li', '', self.zoomMenu);
                list.setAttribute('id', fl.floor_id);
                self.listBtn[key] = L.DomUtil.create('a', 'zoom-fab zoom-btn-sm scale-transition scale-out', list);
                self.listBtn[key].setAttribute('title', fl.alias[0].text);
                L.DomUtil.create('i', 'mdi mdi-layers', self.listBtn[key]);
                // self.listBtn[key].innerHTML = fl.site_index;
                L.DomEvent
                .on(list, 'click', L.DomEvent.stopPropagation)
                .on(list, 'dblclick', L.DomEvent.stopPropagation)
                .on(list, 'wheel', L.DomEvent.stopPropagation)
                // .on(list, 'click', self._selectAreas, self);
                .on(list, 'click', (e) => {
                        let id = e.currentTarget.getAttribute('id');
                        self._twodMap.currentFloorDetail = building.floor.find(fl => fl.floor_id === id);
                        self._twodMap._changeFloorMap(self._twodMap.currentFloorDetail);
                }, self);
            });
            L.DomEvent
            .on(self.zoomFab, 'click', L.DomEvent.stopPropagation)
            .on(self.zoomFab, 'dblclick', L.DomEvent.stopPropagation)
            .on(self.zoomFab, 'wheel', L.DomEvent.stopPropagation)
            .on(self.zoomFab, 'click', (e) => {
                var zoomBtnSm = document.querySelectorAll('.zoom-btn-sm')
                zoomBtnSm.forEach((btn) => {
                    btn.classList.toggle('scale-out');
                });
            }, self);
            console.log('current floor', self._twodMap.currentFloorDetail);
            // L.DomEvent
            // .on(self.zoomFab, 'click', L.DomEvent.stopPropagation)
            // .on(self.zoomFab, 'dblclick', L.DomEvent.stopPropagation)
            // .on(self.zoomFab, 'wheel', L.DomEvent.stopPropagation)
            // .on(self.zoomFab, 'click', (e) => {
            //     console.log('self', self, building.floor);
            //     // console.log(L.DomUtil.getStyle(self._twodMap.dialog._container, 'display'));
            //     if (L.DomUtil.getStyle(self._twodMap.dialog._container, 'display') === 'block') {
            //         self._twodMap.dialog.close();
                    
            //     }
            //     else {
            //         self._twodMap.dialog.open();
            //     }
            //     // self._createTreeMenu(building);
            //     var treeData = [];

            //     var jstreeData = self._createMapNode(treeData, venue, '#');
            //     console.log('jstreeData', jstreeData);
            //     var treeContainer = L.DomUtil.create('div', 'twodmap-jstree');
            //     self._twodMap.dialog.setContent(treeContainer);
            //     // self._twodMap.$(document).ready(function() {

            //         self._twodMap.$('.twodmap-jstree').on('changed.jstree', function (e, data) {
            //             var i, j, r = null;
            //             for (i = 0, j = data.selected.length; i < j; i++) {
            //                 label = data.instance.get_path(data.selected[i]).join(' &#x2192; ');
            //                 r = data.instance.get_node(data.selected[i]);
            //                 if (r.data) {
            //                     r.data.venueId = data.instance.get_parent(data.instance.get_parent(data.selected[i]));
            //                     r.data.buildingId = data.instance.get_parent(data.selected[i]);
            //                     // self._mapOptions.venueId = r.data.venueId;
            //                 }
        
            //             }
        
            //             // self._log(Logger.DEBUG.name, 'Node Data', r.data);
            //             // self._currentFloorDetail = r.data;
            //             // // console.log(r.data)
            //             // self._jQuery(self.options.menuOptions.closeButton).trigger('click');
            //             // if (this.isLoaded) {
            //             //     self._changeFloorMap(self._currentFloorDetail, label);
            //             // }
        
        
            //         }).jstree({
            //             plugins: [
            //               "contextmenu",
            //               "sort",
            //               "state",
            //               "types",
            //               "unique",
            //               "wholerow",
            //               "changed",
            //               "types"
            //             ],
            //             'types': {
            //               'default': {
            //                 'icon': 'fa fa-angle-right fa-fw'
            //               },
            //               'f-open': {
            //                 'icon': 'fa fa-folder-open fa-fw'
            //               },
            //               'f-closed': {
            //                 'icon': 'fa fa-folder fa-fw'
            //               }
            //             },
            //             checkbox: {
            //               three_state: false
            //             },
            //             search: {
            //               show_only_matches: true
            //             },
            //             core: {
            //               data:jstreeData
            //             }
            //         // });
            //         //         .on('loaded.jstree', function () {
            //         //             // Do something here...
            //         //             // self._changeFloorMap(self._currentFloorDetail, label);
            //         //             // self._changeFloorMap(self._currentFloorDetail, label);
            //         //             this.isLoaded = true;
            //         //             console.log('Hello World', this, self._twodMap.$(".jstree-leaf:first-child"));
            //         //             // this.open_node(self._jQuery(".jstree-leaf:first-child"),function(){;},true)
            //         //     });
            //     });
                
                // floorList.forEach((fl, key) => {
                    
                // });
                // self.listBtn.forEach((btn) => {

                //     if (!L.DomUtil.hasClass(btn, 'scale-out')) {
                //         L.DomUtil.addClass(btn, 'scale-out');
                //     }
                //     else {
                //         L.DomUtil.removeClass(btn, 'scale-out');
                //     }
                // })
                
            // })
        });

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

    _selectItem: function (e) {
        var self = this;
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
            self._twodMap._selectCategory(id);
        }
        else {
            L.DomUtil.removeClass(e.currentTarget, 'control-enabled');
            self._twodMap._selectCategory(null);
        }
    },

    _selectPois: function (e) {
        var self = this;
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
            self._twodMap._selectPois(id);
        }
        else {
            L.DomUtil.removeClass(e.currentTarget, 'control-enabled');
            self._twodMap._selectPois(null);
        }
    },
    _createTreeMenu: function (building) {
        var self = this;
        var treeContainer = L.DomUtil.create('ul', 'tree');
        // treeContainer.setAttribute('id', 'myUL')
        // var floorList = [];
        building.floor.map((fl, key) => {
                var floorList = L.DomUtil.create('li', '', treeContainer);
                floorList.setAttribute('id', fl.floor_id);
                // var div = L.DomUtil.create('div', 'flex center', floorList);
                var icon = L.DomUtil.create('i', 'mdi mdi-chevron-right mdi-24px', floorList);
                var anchor = L.DomUtil.create('a', 'flex center', floorList);
                anchor.setAttribute('href', '#');
                anchor.innerHTML = fl.site_index;
                
                var categories = ['Stairs', 'Elevators', 'Restrooms', 'Restrooms', 'Restrooms', 'Restrooms', 'Restrooms']
                categories.forEach(category => {
                    var nestedCategory = L.DomUtil.create('ul', 'nested', floorList);
                    // L.DomEvent
                    // .on(div, 'click', (e) => {
                    //     if (!L.DomUtil.hasClass(nestedCategory, 'active')) {
                    //         L.DomUtil.addClass(nestedCategory, 'active');
                    //         L.DomUtil.addClass(icon, 'caret-down');
                    //     }
                    //     else {
                    //         L.DomUtil.removeClass(nestedCategory, 'active');
                    //         L.DomUtil.removeClass(icon, 'caret-down');
                    //     }
                    // });
                    var categoryList = L.DomUtil.create('li', '', nestedCategory);
                    var innerAnchor = L.DomUtil.create('a', '', categoryList);
                    innerAnchor.setAttribute('href', '#');
                    innerAnchor.innerHTML = category;
                });
                // L.DomEvent
                // .on(floorList, 'click', (e) => {
                //     if (!L.DomUtil.hasClass(e.currentTarget, 'control-enabled')) {
                //         L.DomUtil.addClass(e.currentTarget, 'control-enabled');
                //     }
                //     else {
                //         L.DomUtil.removeClass(e.currentTarget, 'control-enabled');
                //     }
                // })

        });
        self._twodMap.dialog.setContent(treeContainer);


        var tree = document.querySelectorAll('ul.tree a:not(:last-child), i:not(:last-child)');
        // console.log('tree', tree);
        for(var i = 0; i < tree.length; i++){
            tree[i].addEventListener('click', function(e) {
                // console.log('e', e);
                console.log('dsfdsf', e.currentTarget.parentElement.getAttribute('id'));
                var parent = e.target.parentElement;
                var classList = parent.classList;
                var closeAllOpenSiblings = function () {
                    var opensubs = parent.parentElement.querySelectorAll(':scope .open');
                    for(var i = 0; i < opensubs.length; i++){
                        opensubs[i].classList.remove('open');
                    }
                }
                if(classList.contains("open")) {
                    classList.remove('open');
                } else {
                    closeAllOpenSiblings();
                    classList.add('open');
                }
            });
        }



        var child = document.querySelectorAll('ul.tree a:last-child');
        // console.log('click', child)
        for(var i = 0; i < child.length; i++){
            child[i].addEventListener('click', function(e) {
                // console.log('click1', e.target)
                var target = e.currentTarget;
                var classList = target.classList;
                
                // console.log(e.target.parentElement.parentElement.parentElement)
                var closeAllOpenSiblings = function(){
                    var opensubs = e.target.parentElement.parentElement.parentElement
                    .querySelectorAll('ul a');
                    // console.log('opensubs', opensubs);
                    for(var i = 0; i < opensubs.length; i++){
                        opensubs[i].classList.remove('control-enabled');
                    }
                }
                if(classList.contains("control-enabled")) {
                    classList.remove('control-enabled');
                } else {
                    closeAllOpenSiblings();
                    classList.add('control-enabled');
                }
            });
        }

    },

    _createMapNode: function (treeData, venue, parent) {
        var self = this;
        var venueName = self._twodMap._getReadableString(self._twodMap._getTranslatedText(venue.full_name, 'en_US'));
        var venueNode = self._createTreeNode(venue._id, venueName, parent, 'mdi mdi-domain',
            { opened: false, disabled: true });
        // treeData.push(venueNode);
        // console.log('venueNode', venueNode);
        venue.building.forEach((buildingData, key)  => {
            //Need to implment Localization
            var buildingName = self._twodMap._getReadableString(self._twodMap._getTranslatedText(buildingData.name, 'en_US'));
            console.log('buildingName', key);
            var buildingObj = {
                id: buildingName,
                title: buildingName,
                nodes: []
            };
            var parentNode = self._createTreeNode(buildingData.building_id, buildingName, '#', 'mdi mdi-domain', { opened: false, disabled: true });
            // parentNode.id = buildingName;
            // parentNode.text = buildingName;
            // parentNode.parent = '#';
            // parentNode.icon = 'mdi mdi-domain';
            // parentNode.state = { opened: true };
            treeData.push(parentNode);

            buildingData.floor.forEach((floor, key) => {
                //Need to implment Localization

                if (floor.map_info.name && floor.map_info.image_id) {

                    // Add venue live_map_config in floormapdata
                    // console.log('venue', venue);
                    if (venue.config && venue.config['live_map_config']) {
                        floor['live_map_config'] = venue.config['live_map_config'];
                    }

                    //Add timezone data for floormapdata
                    floor.time_zone = venue.time_zone
                    floor.time_zone_offset = venue.time_offset


                    var floorName = self._twodMap._getReadableString(self._twodMap._getTranslatedText(floor.map_info.name, 'en_US'));
                    var floorObj = buildingObj;
                    var w = floor.map_info.scale_x;
                    var h = floor.map_info.scale_y;
                    // var southWest = map.unproject([0, h], map.getMaxZoom() - 1);
                    // var northEast = map.unproject([w, 0], map.getMaxZoom() - 1);
                    // var bounds = new L.LatLngBounds(southWest, northEast);
                    var bounds = [[0, 0], [w, h]];
                    floorObj.id = floor.floor_id;
                    floorObj.title = floorName;
                    floorObj.parent = buildingObj;
                    floorObj.width = w;
                    floorObj.height = h;
                    floorObj.selected = true;
                    floorObj.opened = true;
                    var layerKey = floorName.replace(' ', '_');
                    layerKey = buildingName + '_' + layerKey;
                    floorObj.layer = {
                        name: floorName,
                        type: 'imageOverlay',
                        url: floor.map_info.image_id.url,
                        bounds: bounds,
                        layerParams: {
                            noWrap: true,
                            attribution: '<a>Map ' + buildingName +
                                ' ' + floorName + ' <\/a>'
                        }
                    };
                    buildingObj.nodes.push(floorObj);
                    var childNode;
                    // if (self._mapOptions.venueId === venue._id && self.floorForAreaId && floor.floor_id === self.floorForAreaId) {
                    //     childNode = self._createTreeNode(floor.floor_id, floorName, buildingData.building_id, 'mdi mdi-layers', { opened: true, selected: true });
                    // }
                    // else if (self._mapOptions.venueId === venue._id && !self.floorForAreaId && floor.default) {
                    //     // console.log('Venue match');
                    //     childNode = self._createTreeNode(floor.floor_id, floorName, buildingData.building_id, 'mdi mdi-layers', { opened: true, selected: true });
                    // }
                    // else if (!self._mapOptions.venueId && !self.floorForAreaId && floor.default) {
                    //     // console.log('nor venue, floor default');
                    //     childNode = self._createTreeNode(floor.floor_id, floorName, buildingData.building_id, 'mdi mdi-layers', { opened: true, selected: true });
                    // }
                    // else {
                        // console.log('Else');
                        childNode = self._createTreeNode(floor.floor_id, floorName, buildingData.building_id, 'mdi mdi-layers', { opened: false, selected: false });
                    // }
                    // childNode.data = floor;
                    treeData.push(childNode);
                }
            });

        }); 

        // console.log('return treeData', treeData)
        return treeData;
    },
    _createTreeNode: function (id, name, parent, icon, state) {

        return {
            'id': id,
            'text': name,
            'parent': parent,
            'icon': icon,
            'state': state,
            'a_attr': {
                class:'map-nodes'
            },
        };
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