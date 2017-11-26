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
 var position;
 var lastpos;
 var place = 0;


 /**Loops over wayPoints and pulls out only each lat and long value. Then
 draws a path with it and returns that**/
 function drawPath(maps) {
   var drawnPath = [];
	 //get all positions, build path + points
   for (var i = 0; i < wayPoints.length; i++) {
     //get position
     var pos = {
       lat: parseFloat(wayPoints[i].lat),
       lng: parseFloat(wayPoints[i].lon)
     };
     //add to path
     drawnPath.push(pos);
     //slap a circle there
     var point = new google.maps.Circle({
       strokeColor: 'Black',
       strokeOpacity: 1,
       strokeWeight: 0.5,
       fillColor: 'Red',
       fillOpacity: 1,
       map: maps,
       center: pos,
       radius: 1
     });

   }
   //draw the path
   var path = new google.maps.Polygon({
     paths: drawnPath,
     strokeColor: 'Red',
     strokeOpacity: 0.5,
     strokeWeight: 3,
   });

   path.setMap(maps);

 }

 function initMap() {
   var sv = new google.maps.StreetViewService();
   panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), options);
	 position = { lat: parseFloat(wayPoints[place].lat),
		lng: parseFloat(wayPoints[place].lon)};
   // Set up the map.
   map = new google.maps.Map(document.getElementById('map'), {
     center: position,
     zoom: 16,
     streetViewControl: false
   });
   drawPath(map);

   // Set the initial Street View camera to the center of the map
   sv.getPanorama({
     location: position,
     radius: 50
   }, processSVData);

 }


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

   position = {
     lat: parseFloat(wayPointz[place].lat),
     lng: parseFloat(wayPointz[place].lon)
   }
   var sv = new google.maps.StreetViewService();
   console.log(position);
   sv.getPanorama({
     location: position,
     radius: 50
   }, processSVData);


 }
 var wayPointz = wayPoints;

 //set where we're facing to be either 270 or an angle calculated from the
 //last place we went to
 //please note: i have no idea if this faces forward or backwards
 function getAngle(lastpos, thisPos) {
	 if (lastpos === undefined) {
		 var angle = 270;
	 } else {
		 var angle = google.maps.geometry.spherical.computeHeading(thisPos,
			 lastpos);
	 }
	 return angle;
 }

 function processSVData(data, status) {
   if (status === 'OK') {
     //delete last marker
     if (marker !== undefined)
       marker.setMap(null);
     //make a marker
     marker = new google.maps.Marker({
       position: position,
       map: map,
       title: data.location.description
     });


		 var angle = getAngle(lastpos, data.location.latLng);

     lastpos = data.location.latLng;

     //set the position of the panorama
     panorama.setPano(data.location.pano);
     panorama.setPov({
       heading: angle,
       pitch: 0
     });
     panorama.setVisible(true);

   } else {
     console.error('Street View data not found for this location.');
   }
 }
