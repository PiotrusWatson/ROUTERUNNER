var files = []; 
function doTheDrag(e){
	e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

}

function doTheDrop(e){
  	//stop normal things from happening
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
  if (uploadedfile.type() == 'text/xml'){
	files.push(uploadedfile);
	return true;
  }
  else {
	console.log("FUCK");
	return false;
  }	
}

$(document).ready(function(){


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
