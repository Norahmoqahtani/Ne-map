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
var marker =[];
var infowindow;

//initMap
function initMap() {
    "use strict";
	var self = this;
    this.searchList = ko.observable("");
    this.placeList = ko.observableArray([]);
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng (24.774265, 46.738586),
        
        mapTypeId: 'roadmap'
    });
    
    self.map = initMap;
    
    infowindow = new google.maps.InfoWindow();   
    
    // to knockout
    //Source: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    locations.forEach(function (position) {
        self.placeList.push(new markerLocation(position));
    });
    self.locationsArray = ko.computed(function () {
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


//Foursquare API

function foursquare(data) {
    var venueid = data.foursquareid;
    var foursquareId = 'https://api.foursquare.com/v2/venues/' + venueid + '?oauth_token=1K3HF3KW5HLOLXDC2NJQAZMBSVASUWMF0BTA5KF4WELFFGHE&v=20170603' + this.name;
    var result = data.response.venue;
    
    $.ajax({
        url: foursquareId,
        success: function (info) {
            infowindow.setContent(info);
            infowindow.open(map, marker);
        }
    });
}

function markersMap() {
    ko.applyBindings(new initMap());
}

//Google Error
function errorMap() {
    'use strict';
    window.alert("Sorry there has been an error in Google Map, Please try refreshing the page.");
}