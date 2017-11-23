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
	
	files = files.concat(e.dataTransfer.files); //concat might break it idk?
 }		

function doTheClick(e){
	e.stopPropagation();
    e.preventDefault();
	

	$('#secretclickbox').trigger('click');
}

$(document).ready(function(){


	var dropZone = document.getElementById('drop');
	var clickBox = $('#secretclickbox');
	dropZone.addEventListener('dragover', doTheDrag, false);
	dropZone.addEventListener('drop', doTheDrop, false);
	dropZone.addEventListener('click',doTheClick, false); 
	clickBox.on('change', function(e){
	  files = files.concat(e.target.files);
	  console.log(files);
	});
	
       
});
