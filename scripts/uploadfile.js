function doTheDrag(e){
	e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

}

function doTheDrop(e){
  	//stop normal things from happening
 	e.stopPropagation();
    e.preventDefault();
	
	var files = e.dataTransfer.files; // Array of all files
	var output = [];
	//placeholder crap code to replace with proper parsing stuff :)
 }		

function doTheClick(e){
	e.stopPropagation();
    e.preventDefault();
	
	$('#secretclickbox').trigger('click');

}

function doTheParse(files){
	

}
	

$(document).ready(function(){


	var dropZone = document.getElementById('drop');
	dropZone.addEventListener('dragover', doTheDrag, false);
	dropZone.addEventListener('drop', doTheDrop, false);
	dropZone.addEventListener('click',doTheClick, false); 
       
});
