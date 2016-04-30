// Global variables (WARNING):
var source = ""; // Text will be check
var dictionary = []; // Set of the correct words

/**
 * Read the file selected and it invoke the callback passed the content of file.
 * @param idFile {String}     Id input file
 * @param callback {Function} Function to be call when the reader have been read the file
 */
function selectFile(idFile,callback) {
    var file = document.getElementById(idFile).files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
	// The file's text will be solved
	callback(event.target.result);
    };

    reader.readAsText(file);
}

/**
 * Set global variable dictionary with the content of the file selected.
 */
function selectDictionary() {
    selectFile("ckdictionary",function (text) {
	dictionary = JSON.parse(text).dictionary;
    });
}

/**
 * Set global variable source with the content of file selected.
 */
function selectSource() {
    selectFile("cksource",function (text) {
	source = text;
    });
}

/**
 * Return the select html element. The inside options will be set with the array values.
 * @param array {Array} Array of options
 * @return {HTMLSelect} A select element with the options of the array
 */
function getSelect(array) {
    var select = document.createElement("select");
    var option = undefined;	

    array.forEach( function (value) {
	option = document.createElement("option");
	option.value = value;
	option.text = value;
	
	select.appendChild(option);
    });

    return select;
}

function solve(text) {
    var regWord = /\w+/g;

    var controls = [];

    var words = source.match(regWord);
    var before = "";

    var start = 0;

    words.forEach( function (word) {
	var pullTarget = [];

	dictionary.forEach( function (target) {
	    var distance = getEditDistance(word.toLowerCase(),target);

	    if (distance > 0 && distance <= 2) {
		pullTarget.push(word,target);
	    }
	});

	if (pullTarget.length > 0) {
	    var chunk = {
		end: source.indexOf(word,start),
		mistake: pullTarget			
	    };

	    start = chunk.end + word.length;
	    
	    controls.push(chunk);
	}
    });

    start = 0;
    var result = document.getElementById("check");

    controls.forEach( function ( chunk ) {
	if ( chunk.end - start > 0 ) {
	    result.innerHTML = 
		result.innerHTML + source.substring(start,chunk.end);
	}	

	var choice = getSelect(chunk.mistake);
	result.appendChild(choice);

	start = chunk.end + chunk.mistake[0].length; 
    });

    if ( start > 0 ) {
	result.innerHTML = result.innerHTML + source.substring(start);
    }
}




