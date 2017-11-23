var files = []; 

function doTheDrag(e){
	e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

}
function readFile(f){
	var reader = new FileReader();
	reader.onload = (function(reader)
	 { return function(){
						  contents = reader.result;
						  var lines = contents.split('\n');
						  console.log(contents);
						}
	 })(reader);
	reader.readAsText(f);
}

function doTheDrop(e){
  	//stop normal things from	console.log(files); happening
 	e.stopPropagation();
    e.preventDefault();
	
	doTheUpload(e.dataTransfer.files[0]); //concat might break it idk?
 }		

function doTheClick(e){
	e.stopPropagation();
    e.preventDefault();
	

	$('#secretclickbox').trigger('click');
}

function doTheUpload(uploadedfile){ //checks if file is The Correct Mime Type
  //currently broken until find correct mimetype/other solution 
  readFile(uploadedfile);
 }

function parseGPX(text){
	parser = new DOMParser();
	window.xml = parser.parseFromString(text, "text/xml");
	console.log(window.xml);

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
