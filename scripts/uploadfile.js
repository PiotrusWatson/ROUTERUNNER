$(document).ready(function(){

  $('#drop').on({'dragover dragenter': function(e){
	e.preventDefault();
	e.stopPropagation();
  },
  'drop': function(e) {
	var data = e.originalEvent.dataTransfer;

	if (data != null && data.files.length){
  		e.preventDefault();
  		e.stopPropagation();
		$.each(data.files, function(i, file){
		  	console.log("FILE READ" + i);
			var reader = new FileReader();
			reader.onload = $.proxy(function (file, $list, event){	
			$list.prepend($("<li>").append(file.name));
			}, this, file, $('#list'));
		  	//reader.readAsDataURL(file);	
		}		  
	}

  });
  
});
