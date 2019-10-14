// GLOBAL VARIABLES

let numOfQuestions = 3;
let numArr = [];
let correctAnswer;
// IF THE API WAS WELL GROUPED, THESE WOULD BE OBSOLETE...
let numberOfContinents = 7;
let numberOfImages = 5;
let answers = document.querySelector('.answers');

// RANDOM NUMBER FUNCTION 

function randomize(param) {
	return Math.floor(Math.random() * param);
}


// ARRAY OF RADOM NUMBERS FUNCTION

function generateUniqueNumbers(max) {
	while ( numArr.length < numOfQuestions ) {
	    var num = Math.floor(Math.random() * max);
	    if ( numArr.indexOf(num) === -1 )
	    	numArr.push(num);
	}
}

// MAIN API REQUEST

const request = new XMLHttpRequest();
var url = "https://api.myjson.com/bins/a6da9";
request.open('get', url, true);
request.onreadystatechange = function() {
	if ( request.readyState == 4 && request.status == 200 ) {
		let data = JSON.parse(request.responseText);
		let string = "";
		generateUniqueNumbers(numberOfContinents);
		let arrIndex = (numArr.map(x => x * numberOfImages)).reverse();

		// RANDOM CORRECT ANSWER CHOICE

		correctAnswer = randomize(numOfQuestions);
		console.log(correctAnswer)
		let correctAnswerImage = arrIndex[correctAnswer] + randomize(numberOfImages);
		document.querySelector('.image').setAttribute('src', data[correctAnswerImage].image)

		console.log(correctAnswerImage)

		// 3 RANDOM CONTINENTS CHOICE FOR ANSWERS FIELD

		console.log(arrIndex)
		for ( let i = 0; i < arrIndex.length; i++ ) {
			let el = data[arrIndex[i]];
			string += "<li>" + el.continent + "</li>";

		}
		answers.innerHTML = string;
	}
}
request.send()