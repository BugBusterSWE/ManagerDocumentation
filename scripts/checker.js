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
	var targets = ["prov","pass"];
	var regWord = /\w+/g;

	var controls = [];

	var text = document.getElementById("content").innerHTML;
	var words = text.match(regWord);
	console.log(words);
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
	var result = "";
	var result = document.getElementById("result");

	controls.forEach( function ( chunk ) {
		if ( chunk.end - start > 0 ) {
			result.innerHTML = result.innerHTML + text.substring(start,chunk.end);
		}	
		
		var choice = getSelect(chunk.mistake);
		result.appendChild(choice);

		start = chunk.end + chunk.mistake[0].length; 
	});
}

window.onload = solve;


