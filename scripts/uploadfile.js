var files = []; 
trkpts= [];
//object that contains all relevant data :)
function wayPoint(lon, lat){
	this.lon = lon;
	this.lat = lat;
	this.datetime = 0;

	this.addDateTime = function(datestr){
		this.datetime = Date.parse(datestr);
	};	  
}

wayPoints = [];


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
						  parseGPX(reader.result);
						 
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

function parseGPX(text){
	$.xml=$($.parseXML(text));	
	trkpts = $.xml.find("trkpt");
	for (var i = 0; i < trkpts.length; i++){
	  //get a trackpoint
	  	var trkpt = $(trkpts[i]);
	//store its lat/lon
		var point = new wayPoint(trkpt.attr('lat'), trkpt.attr('lon'));
		console.log(trkpt.children('time').contents().text());
		//get its datetime text, convert into a nice int :)
		point.addDateTime(trkpt.children('time').contents().text()); 
		console.log(point);
		wayPoints.push(point);	

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
