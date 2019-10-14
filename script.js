
let numOfQuestions = 3;
let numArr = [];

function randomize(param) {
	return Math.floor(Math.random() * (param + 1));
}

function generateQuestions() {
	while ( numArr.length < numOfQuestions ) {
	    var num = Math.floor(Math.random() * (10 + 1));
	    if ( numArr.indexOf(num ) === -1 )
	    	numArr.push(num);
	}
}

// generateQuestions()

const request = new XMLHttpRequest();
var url = "https://api.myjson.com/bins/a6da9";
request.open('get', url, true);
request.onreadystatechange = function() {
	if ( request.readyState == 4 && request.status == 200 ) {
		let data = JSON.parse(request.responseText);
		generateQuestions();
		for ( let i = 0; i < numArr.length; i++ ) {
			console.log(data[numArr[i]]);
		}
	}
}
request.send()