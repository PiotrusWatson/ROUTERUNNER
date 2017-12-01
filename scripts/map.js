//  pulls out saved waypoints item made in uploadfile.js
var wayPoints = JSON.parse(localStorage.getItem('wayPoints')).wayPoints;
$(document).ready(function () {
  if (wayPoints === undefined) {
    console.error("YOU SHOULDN'T BE HERE (TODO: add UI stuff telling people how shouldn't be here they are)")
  } else {
    console.log(wayPoints)
  }

  hideStepButtons();
})

var map
var panorama
var options = {
  disableDefaultUI: true,
  panControl: true,
  clickToGo: false
}
var marker
var position
var place = 0

/** Loops over wayPoints and pulls out only each lat and long value. Then
draws a path with it and returns that**/
function drawPath (maps) {
  var drawnPath = []
  // get all positions, build path + points
  for (var i = 0; i < wayPoints.length; i++) {
    // get position
    var pos = {
      lat: parseFloat(wayPoints[i].lat),
      lng: parseFloat(wayPoints[i].lon)
    }
    // add to path
    drawnPath.push(pos)
    // slap a circle there
    var point = new google.maps.Circle({
      strokeColor: 'Black',
      strokeOpacity: 1,
      strokeWeight: 0.5,
      fillColor: 'Red',
      fillOpacity: 1,
      map: maps,
      center: pos,
      radius: 1
    })
  }
  // draw the path
  var path = new google.maps.Polygon({
    paths: drawnPath,
    strokeColor: 'Red',
    strokeOpacity: 0.5,
    strokeWeight: 3,
  })
  path.setMap(maps)
}

function initMap () {
  var sv = new google.maps.StreetViewService();
  panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), options);
  position = {
    lat: parseFloat(wayPoints[place].lat),
    lng: parseFloat(wayPoints[place].lon)
  }
  //  Set up the map.
  map = new google.maps.Map(document.getElementById('map'), {
    center: position,
    zoom: 16,
    streetViewControl: false
  })
  drawPath(map)

  //  Set the initial Street View camera to the center of the map
  sv.getPanorama(
    {
      location: position,
      radius: 50
    },
    processSVData
  )
}

function onClickGoForward(e){
  console.log(e);
  goForward();
  pause();
}

function onClickGoBackward(e){
  goBackward();
  pause();
}

function goBackToIndex(){
  window.location.href = "index.html";
}


function goForward () {
  place++
  if (place === wayPoints.length - 1) {
    place = -1
    pause()
  }
  changePosition()
  nextStep()
}

function goBackward () {
  place--
  changePosition()
  nextStep()
}

function changePosition () {
  position = {
    lat: parseFloat(wayPointz[place].lat),
    lng: parseFloat(wayPointz[place].lon)
  }
  var sv = new google.maps.StreetViewService()
  hideStepButtons();
  sv.getPanorama(
    {
      location: position,
      radius: 50
    },
    processSVData
  )
}

/* Hides go backwards if we're at start, and forwards if we're at end*/
function hideStepButtons(){
  var back = $('#step-backward');
  var forward = $('#step-forward');
  if (place <= 0){
    back.addClass('hide');
  }
  else if (place >= wayPoints.length - 1 || place === -1){
    forward.addClass('hide');
  }
  else{
    back.removeClass('hide');
    forward.removeClass('hide');
  }
}

var wayPointz = wayPoints

// set where we're facing to be either 270 or an angle calculated from the
// last place we went to
// please note: i have no idea if this faces forward or backwards, looks like backwards :P
function getAngle (thisPos, nextPos) {
  return google.maps.geometry.spherical.computeHeading(thisPos, nextPos)
}

function processSVData (data, status) {
  if (status === 'OK') {
    // delete last marker
    if (marker !== undefined) marker.setMap(null)
    // make a marker
    marker = new google.maps.Marker({
      position: position,
      map: map,
      title: data.location.description
    })
    map.setCenter(position)
    // set the position of the panorama
    panorama.setPano(data.location.pano)
    panorama.setPov({
      heading: getAngle(
        data.location.latLng,
        {
          lat: function () { return parseFloat(wayPointz[place + 1].lat) },
          lng: function () { return parseFloat(wayPointz[place + 1].lon) }
        }
      ),
      pitch: 0
    })
    panorama.setVisible(true)
  } else {
    console.error('Street View data not found for this location.')
  }
}

var id
var di
var width
function animate () {
  if (width > 100) {
    clearInterval(id)
  } else {
    var elem = document.getElementById('streatch')
    width++
    elem.style.width = width + '%'
  }
}

function nextStep () {
  if (playing) {
    const time = wayPointz[place + 1].datetime - wayPointz[place].datetime
    di = setTimeout(goForward, time)
    width = 0
    id = setInterval(animate, time / 100)
  }
}

var playing = false;

function play () {
  $('#cover').addClass('hide');
  $('#play').addClass('hide');
  $('#pause').removeClass('hide');
  playing = true;
  nextStep();
}

function pause () {
  playing = false
  clearInterval(id)
  clearTimeout(di)
//  $('#cover').removeClass('hide')
  $('#pause').addClass('hide');
  $('#play').removeClass('hide');
}
