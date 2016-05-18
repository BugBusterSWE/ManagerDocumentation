const fs = require("fs");

// Global variables (WARNING):
var source = ""; // Text will be check
var dictionary = []; // Set of the correct words
var fileSource = "";

function cleanLatexStress(text) {
    return text
	.replace(/\\`o/g,"ò")
	.replace(/\\'o/g,"ò")
	.replace(/\\`a/g,"à")
	.replace(/\\'a/g,"à")
	.replace(/\\`u/g,"ù")
	.replace(/\\'u/g,"ù")
	.replace(/\\`e/g,"è")
	.replace(/\\'e/g,"é")
	.replace(/\\`i/g,"ì")
	.replace(/\\'i/g,"ì");
}

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
    fileSource = document.getElementById("cksource").files[0];  

    selectFile("cksource",function (text) {
	source = cleanLatexStress(text);
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
 * Clean the content of check and correction insert a empty string
 */
function clean() {
    document.getElementById("check").innerHTML = "";
    document.getElementById("correction").innerHTML = "";
}

/**
 * Return the string with the correction selected.
 * @return {string} Correct text
 */
function correct() {
    var list = document.querySelectorAll("div#check > select");
    var buffer = "";
    var start = 0;

    for ( var i = 0; i < list.length; i++ ) {
    var select = list[i];
	var tag = select.getAttribute("tag");
	var mistake = select.options[0].value;
	var replacement = select.options[select.selectedIndex].value;
	
	// Substiture the word mistake with the work replacement.
	buffer += source.substring(start,tag).split(mistake).join(replacement);
	start = tag;
    }
    
    // Complete with remaining source
    buffer += source.substring(start);

    fs.writeFile(fileSource.path, buffer, (err) => {
        var message = "Done!!";
        
        if (err) {
            message = "Error occurred!!";        
        }

        document.getElementById("correction").innerHTML = message;
    });
}


function solve(text) {
    var regWord = /[a-zA-Zàáèéìíòóùú]+/g;

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
        var measure = distance / word.length;
    
	    // Append any likely matchs
	    if (word.length === 1 || (measure > 0 && measure < 0.5)) {
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




