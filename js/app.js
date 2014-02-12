// Define behavior for the textboxes




function Storage(dbPath){
	var DB = new Firebase(dbPath);

	function dayKey(dayOffset){
		return moment().add('days',dayOffset).startOf('day').format("YYYY-MM-DD")
	}

	this.setDay = function(text, dayOffset){
		dayOffset = dayOffset === undefined ? 0 : dayOffset
		DB.child( dayKey(dayOffset) ).set( text )
	}

	this.setYesterday = function(text){
		DB.child( dayKey(-1) ).set( text )
	}

	this.setYesterday = function(text){
		DB.child( dayKey(-1) ).set( text )
	}

	this.onUpdate = function(callback){
		DB.child( dayKey(0) ).on('value', function(snapshot){
			callback(snapshot.val(), "today")
		})

		DB.child( dayKey(1) ).on('value', function(snapshot){
			callback(snapshot.val(), "tomorrow")
		})

		DB.child( dayKey(-1) ).on('value', function(snapshot){
			callback(snapshot.val(), "yesterday")
		})
	}
}

var storage = new Storage('https://forgetfultodo.firebaseIO.com/')

$(function(){
	function insertAtCaret(txtarea,text) {
	    var scrollPos = txtarea.scrollTop;
	    var strPos = 0;
	    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
	    	"ff" : (document.selection ? "ie" : false ) );
	    if (br == "ie") { 
	    	txtarea.focus();
	    	var range = document.selection.createRange();
	    	range.moveStart ('character', -txtarea.value.length);
	    	strPos = range.text.length;
	    }
	    else if (br == "ff") strPos = txtarea.selectionStart;

	    var front = (txtarea.value).substring(0,strPos);  
	    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
	    txtarea.value=front+text+back;
	    strPos = strPos + text.length;
	    if (br == "ie") { 
	    	txtarea.focus();
	    	var range = document.selection.createRange();
	    	range.moveStart ('character', -txtarea.value.length);
	    	range.moveStart ('character', strPos);
	    	range.moveEnd ('character', 0);
	    	range.select();
	    }
	    else if (br == "ff") {
	    	txtarea.selectionStart = strPos;
	    	txtarea.selectionEnd = strPos;
	    	txtarea.focus();
	    }
	    txtarea.scrollTop = scrollPos;
	}


	$('textarea').on('keydown', function(e){
		// On return, add "[ ]"
		
		if(e.which == 13){
			insertAtCaret( this, '\n[ ] ' )
			e.preventDefault()
		}
	}).on('keyup', function(e){
		this.value = this.value.replace(/\[ \] \[ \]/mg, "[ ]")
		storage.setDay(this.value, parseInt($(this).parent().attr('day')) )
	})


	storage.onUpdate(function(data, which){
		$('#'+which).val( data )
	})

})
