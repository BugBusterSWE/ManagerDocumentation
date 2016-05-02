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
 * @param tag {number}  End position of word
 * @return {HTMLSelect} A select element with the options of the array
 */
function getSelect(array,tag) {
    var select = document.createElement("select");
    select.setAttribute("tag",tag);
    var option = undefined;	

    array.forEach( function (value) {
	option = document.createElement("option");
	option.text = value;
	option.value = value;
	select.appendChild(option);
    });

    return select;
}

/**
 * Return the string with the correction selected.
 * @return {string} Correct text
 */
function correct() {
    var list = document.querySelectorAll("div#check > select");
    var buffer = "";
    var start = 0;

    for ( var select of list ) {
	var tag = select.getAttribute("tag");
	var mistake = select.options[0].value;
	var replacement = select.options[select.selectedIndex].value;
	
	// Substiture the word mistake with the work replacement.
	buffer += source.substring(start,tag).split(mistake).join(replacement);
	start = tag;
    }

    console.log(buffer);
}


function solve(text) {
    var regWord = /\w+/g;

    var controls = [];

    var words = source.match(regWord);
    var before = "";

    var start = 0;

    words.forEach( function (word) {
	// Append the uncorrect word in the array assure that it is the first 
	// option in the select element
	var pullTarget = [word];

	dictionary.forEach( function (target) {
	    var distance = getEditDistance(word.toLowerCase(),target);

	    // Append any likely matchs
	    if (distance > 0 && distance <= 2) {
		pullTarget.push(target);
	    }
	});

	if (pullTarget.length > 1) {
	    var pos = source.indexOf(word,start);

	    var chunk = {
		end: pos,
		tag: pos + word.length,
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

	var choice = getSelect(chunk.mistake,chunk.tag);
	result.appendChild(choice);

	start = chunk.end + chunk.mistake[0].length; 
    });

    if ( start > 0 ) {
	result.innerHTML = result.innerHTML + source.substring(start);
    }
}




