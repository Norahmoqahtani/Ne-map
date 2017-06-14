
var locations =[ {
    name: "King Salman Safari Park",
    lat: 25.0054,
    lng: 46.6020
}, {
    name: "King Abdullah Park",
    lat: 24.6660,
    lng: 46.7376
}, {
    name: "Salam Park",
    lat: 24.6213,
    lng: 46.7083
}, {
    name: "Riyadh Hills Park",
    lat: 24.550297,
    lng: 46.724340
}, {
    name: "Rawdah Park",
    lat: 24.7317,
    lng: 46.7756
}, {
    name: "King Abdul Aziz Park",
    lat: 24.62105,
    lng: 46.77263
}];
var map;
var markers;[];
var infowindow;

//initMap
function initMap() {
    "use strict";
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng (24.774265, 46.738586),
        
        mapTypeId: 'roadmap'
    });
    
    
    infowindow = new google.maps.InfoWindow();
    
    var self = this;
    self.searchList = ko.observable("");
    self.placeList = ko.observableArray([]);
    self.map = initMap;
    
    
    
    // to knockout
    //Source: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    locations.forEach(function (position) {
        self.placeList.push(new markerLocation(position));
    });
    this.locationsArray = ko.computed(function () {
        var filteredList = self.searchList().toLowerCase();
        if (filteredList) {
            return ko.utils.arrayFilter(this.placeList(), function (position) {
                var name = position.name.toLowerCase();
                var result = (name.search(filteredList) >= 0);
                position.observable(result);
                return result;
            });
        } else {
            this.placeList().forEach(function (position) {
                position.observable(true);
            });
            return this.placeList();
        }
    },
    self);
}
//Mrkers
var markerLocation = function (data) {
    
    var self = this;
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    
    self.observable = ko.observable(true);
    
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        animation: google.maps.Animation.DROP
    });
    
    
    //SOURCE: UDACITY LESSONS
    function populateInfoWindow(locations, infowindow) {
        
        // Check to make sure the infowindow is not already open on this marker
        if (infowindow.marker !== marker) {
            infowindow.marker = marker;
            marker.setAnimation(google.maps.Animation.BOUNCE);
            
            infowindow.setContent('<div>' + locations.name + '</div>');
            infoWindow.open(map, markerLocation);
            
            infowindow.addListener('closeclick', function () {
                infowindow.setMarker = null;
            });
        }
    }
};
function markersMap() {
    ko.applyBindings(new initMap());
}
//Google Error
function errorMap() {
    'use strict';
    window.alert("Sorry there has been an error in Google Map, Please try refreshing the page.");
}