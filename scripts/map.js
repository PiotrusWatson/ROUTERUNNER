 /*
       * Click the map to set a new location for the Street View camera.
       */

wayPoints = JSON.parse(localStorage.getItem("wayPoints"));
$(document).ready(function(){
	if (wayPoints === undefined){
		console.error("YOU SHOULDN'T BE HERE (TODO: add UI stuff telling people how shouldn't be here they are");
	}

});


	//Psudo import long and langs

      var poss = [[46.003257147967815399169921875,8.95168307],
		 [46.0030053555965423583984375,8.95151794888079166412353515625], 
		 [46.0028466023504734039306640625,8.9511700160801410675048828125]];	
      var map;
      var panorama;

      function initMap() {
        var berkeley = {lat: 46.003257147967815399169921875, lng: 8.95168307237327098846435546875,
	linksControl: false,
        panControl: false,
        enableCloseButton: false};
        var sv = new google.maps.StreetViewService();

        panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));

        // Set up the map.
        map = new google.maps.Map(document.getElementById('map'), {
          center: berkeley,
          zoom: 16,
          streetViewControl: false
        });

        // Set the initial Street View camera to the center of the map
        sv.getPanorama({location: berkeley, radius: 50}, processSVData);

        // Look for a nearby Street View panorama when the map is clicked.
        // getPanoramaByLocation will return the nearest pano when the
        // given radius is 50 meters or less.
        map.addListener('click', function(event) {
         // sv.getPanorama({location: event.latLng, radius: 50}, processSVData);
        });
      }
    var place = 0;
    function goForward(){
    place++;
    if(place>=poss.length){
    place--;
    }else if(place==poss.length-1){
    document.getElementById("title").innerHTML = ("YOUVE FINISHED YOUR RUN GOOD JOB");
    }
    changePosition();
    }
    function goBackward(){
    place--;
    if(place<0){
    place++;
    }
    changePosition();
    }
    function changePosition(){

        panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
	var position = {lat: poss[place][0], lng: poss[place][1],
	linksControl: false,
        panControl: false,
        enableCloseButton: false}
        var sv = new google.maps.StreetViewService();
	sv.getPanorama({location: position, radius:50}, processSVData);
	console.log("running code" + place);
	}
 
      function processSVData(data, status) {
        if (status === 'OK') {
          var marker = new google.maps.Marker({
            position: data.location.latLng,
            map: map,
            title: data.location.description
          });

          panorama.setPano(data.location.pano);
          panorama.setPov({
            heading: 270,
            pitch: 0
          });
          panorama.setVisible(true);

          marker.addListener('click', function() {
            var markerPanoID = data.location.pano;
            // Set the Pano to use the passed panoID.
            panorama.setPano(markerPanoID);
            panorama.setPov({
              heading: 270,
              pitch: 0
            });
            panorama.setVisible(true);
          });
        } else {
          console.error('Street View data not found for this location.');
        }
      }

