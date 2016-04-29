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

function solve() {
    var targets = ["provaro","pass"];
    var regWord = /\w+/g;

    var controls = [];

    var text = document.getElementById("prova").innerHTML;
    var words = text.match(regWord);
    var before = "";

    var start = 0;

    words.forEach( function (word) {
	var pullTarget = [];

	targets.forEach( function (target) {
	    var distance = getEditDistance(word.toLowerCase(),target);

	    if (distance > 0 && distance <= 2) {
		pullTarget.push(word,target);
	    }
	});

	if (pullTarget.length > 0) {
	    var chunk = {
		end: text.indexOf(word,start),
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
		result.innerHTML + text.substring(start,chunk.end);
	}	

	var choice = getSelect(chunk.mistake);
	result.appendChild(choice);

	start = chunk.end + chunk.mistake[0].length; 
    });
    
    if ( start > 0 ) {
	result.innerHTML = result.innertHTML + text.substring(start);
    }

    console.log(resul.innerHTML);
}




