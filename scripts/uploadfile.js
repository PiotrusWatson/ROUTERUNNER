var files = []; 
//object that contains all relevant data :)
function wayPoint(lon, lat, datestr){
	this.lon = lon;
	this.lat = lat;
	this.datetime = 0;
	this.datestr = datestr;
	this.addDateTime = function(datestr){
		this.datetime = Date.parse(datestr);
	};	  
}



function doTheDrag(e){
	e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
	//TODO: change button border when it's over this

}
function readFile(f){
	var reader = new FileReader();
	reader.onload = (function(reader)
	 { return function(){
						  parseGPX(reader.result, ()=> window.location.href = "map.html");
					 	  	  
						}
	 })(reader);
	reader.readAsText(f);
}

function doTheDrop(e){
  	//stop normal things from	console.log(files); happening
 	e.stopPropagation();
    e.preventDefault();
	//TODO: fire off some cool css animation here (border gets real big?)
	doTheUpload(e.dataTransfer.files[0]); //concat might break it idk?
 }		

function doTheClick(e){
	e.stopPropagation();
    e.preventDefault();
	

	$('#secretclickbox').trigger('click');
}

function doTheUpload(uploadedfile){ //TODO: flesh out function.  
  //Will check if file currently is or isn't a gpx (if not will do some kinda
  //rejection animation?)
  readFile(uploadedfile);
 }

/** Opens the gpx text and dumps it all into point objects. 
 * Has a callback, so that things happen only when it completes**/
function parseGPX(text, _callback){
	$.xml=$($.parseXML(text));
	var	wayPoints = [];
	var trkpts = $.xml.find("trkpt");
	for (var i = 0; i < trkpts.length; i++){
	  //get a trackpoint
	  	var trkpt = $(trkpts[i]);
		//get its stored date string
		var datestr = trkpt.children('time').contents().text();
		//dump into obj with lat and long
		var point = new wayPoint(trkpt.attr('lat'), trkpt.attr('lon'), datestr);
		//store int version of datestr
		point.addDateTime(datestr); 
		wayPoints.push(point);	
	localStorage.setItem("wayPoints", wayPoints);
	_callback();
	}
}




$(document).ready(function(){

	//handling all different types of interaction with that middle block - clicks + drags!!
	var dropZone = document.getElementById('drop');
	var clickBox = $('#secretclickbox');
	dropZone.addEventListener('dragover', doTheDrag, false);
	dropZone.addEventListener('drop', doTheDrop, false);
	dropZone.addEventListener('click',doTheClick, false); 

	clickBox.on('change', function(e){
	  doTheUpload(e.target.files[0]);
	  console.log(files);
		
	  	});
	
       
});
