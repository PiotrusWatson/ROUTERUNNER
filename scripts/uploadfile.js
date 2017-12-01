//object that contains all relevant data :)
function wayPoint(lat, lon, datestr) {
    this.lon = lon;
    this.lat = lat;
    this.datetime = 0;
    this.datestr = datestr;
    this.addDateTime = function(datestr) {
        this.datetime = Date.parse(datestr);
    };
}
function doTheDrag(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    console.log(e.dataTransfer.files[0]);
    // changes drop box border colour to orange when file is dragged onto it
    $('#drop').css({transform: "scale(1.5) perspective(1px)",
    border: '8px solid #FFCC00'});
}

function readFile(f) {
    var reader = new FileReader();
    reader.onload = (function(reader) {
        return function() {
            parseGPX(reader.result, () => window.location.href = 'map.html');
        };
    })(reader);
    reader.readAsText(f);
}

function doTheDrop(e) {
    //stop normal things from	console.log(files); happening
    e.stopPropagation();
    e.preventDefault();
    doTheUpload(e.dataTransfer.files[0]);
}

function doTheClick(e) {
    e.stopPropagation();
    e.preventDefault();

    $('#secretclickbox').trigger('click');
}

function doTheUpload(uploadedfile) {
    //TODO: flesh out function.
    // changes drop box border colour to green if gpx file, red if not
    if (uploadedfile.name.match('.gpx$')) {
        $('#drop').css({"border": "8px solid #00FF00"});
        readFile(uploadedfile);
    } else {
        document.getElementById('drop').style.border = '8px solid #FF0000';
    }

}

/** Opens the gpx text and dumps it all into point objects.
 * Has a callback, so that things happen only when it completes**/
function parseGPX(text, _callback) {
    $.xml = $($.parseXML(text));
    var wayPoints = [];
    var trkpts = $.xml.find('trkpt');
    for (var i = 0; i < trkpts.length; i++) {
        //get a trackpoint
        var trkpt = $(trkpts[i]);
        //get its stored date string
        var datestr = trkpt.children('time').contents().text();
        //dump into obj with lat and long
        var point = new wayPoint(trkpt.attr('lat'), trkpt.attr('lon'), datestr);
        //store int version of datestr
        point.addDateTime(datestr);
        wayPoints.push(point);
    }
    var data = {};
    data.wayPoints = wayPoints;
    localStorage.setItem('wayPoints', JSON.stringify(data));
    _callback();
}

$(document).ready(function() {
    // changes drop box border colour back to default
    $('body').hover(function() {
        $('#drop').css({border: '5px solid #a83800',
      transform: "scale(1)"});
    });

    //handling all different types of interaction with that middle block - clicks + drags!!
    var dropZone = document.getElementById('drop');
    var clickBox = $('#secretclickbox');
    dropZone.addEventListener('dragover', doTheDrag, false);
    dropZone.addEventListener('drop', doTheDrop, false);
    dropZone.addEventListener('click', doTheClick, false);

    clickBox.on('change', function(e) {
        doTheUpload(e.target.files[0]);
    });
});
