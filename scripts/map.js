 /*
  * Click the map to set a new location for the Street View camera.
  */
 //pulls out saved waypoints item made in uploadfile.js
 wayPoints = JSON.parse(localStorage.getItem("wayPoints")).wayPoints;
 $(document).ready(function() {
   if (wayPoints === undefined) {
     console.error("YOU SHOULDN'T BE HERE (TODO: add UI stuff telling people how shouldn't be here they are)");
   } else {
     console.log(wayPoints);

   }
 });

 var map;
 var panorama;
 var options = {
   disableDefaultUI: true,
   panControl: true,
   clickToGo: false
 };
 var marker;


 /**Loops over wayPoints and pulls out only each lat and long value. Then
 draws a path with it and returns that**/
 function drawPath(maps) {
   var drawnPath = [];
   for (var i = 0; i < wayPoints.length; i++) {
     var pos = {
       lat: parseFloat(wayPoints[i].lat),
       lng: parseFloat(wayPoints[i].lon)
     };
     drawnPath.push(pos);
   }
   var path = new google.maps.Polygon({
     paths: drawnPath,
     strokeColor: 'Red',
     strokeOpacity: 1,
     strokeWeight: 3,
   });

   path.setMap(maps);

 }





 function initMap() {
   var berkeley = {
     lat: 46.003257147967815399169921875,
     lng: 8.95168307237327098846435546875
   };
   var sv = new google.maps.StreetViewService();

   panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), options);

   // Set up the map.
   map = new google.maps.Map(document.getElementById('map'), {
     center: berkeley,
     zoom: 16,
     streetViewControl: false
   });
	 drawPath(map);

   // Set the initial Street View camera to the center of the map
   sv.getPanorama({
     location: berkeley,
     radius: 50
   }, processSVData);

   // Look for a nearby Street View panorama when the map is clicked.
   // getPanoramaByLocation will return the nearest pano when the
   // given radius is 50 meters or less.
   map.addListener('click', function(event) {
     // sv.getPanorama({location: event.latLng, radius: 50}, processSVData);
   });
 }
 var place = 0;

 function goForward() {
   place++;
   if (place >= wayPoints.length) {
     place--;
   } else if (place == wayPoints.length - 1) {
     document.getElementById("title").innerHTML = ("YOUVE FINISHED YOUR RUN GOOD JOB");
   }
   changePosition();
 }

 function goBackward() {
   place--;
   if (place < 0) {
     place++;
   }
   changePosition();
 }

 function changePosition() {

   //panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
   console.log(wayPointz[place].lat);
   var position = {
     lat: parseFloat(wayPointz[place].lat),
     lng: parseFloat(wayPointz[place].lon)
   }
   var sv = new google.maps.StreetViewService();
   console.log(position);
   sv.getPanorama({
     location: position,
     radius: 50
   }, processSVData);

   console.log("running code" + place);

 }
 var wayPointz = wayPoints;

 function processSVData(data, status) {
   if (status === 'OK') {
     //delete last marker
     if (marker !== undefined)
       marker.setMap(null);
     //make a marker
     marker = new google.maps.Marker({
       position: data.location.latLng,
       map: map,
       title: data.location.description
     });
     //set the position of the panorama
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
