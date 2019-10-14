// GLOBAL VARIABLES

let numOfQuestions = 3;
let correctAnswer;
// IF THE API ENDPOINTS WERE WELL GROUPED, THESE WOULD BE OBSOLETE, LOOPING TROUGH OBJECTS WOULD GIVE US MAX-VALUES
let numberOfContinents = 7;
let numberOfImages = 5;
//
let result = 0;
let questionCount = 1;
let maxQuestions = 5;
let pointsGained = 750;
let clicked = false;
let answers = document.querySelector('.answers');
let url = "https://api.myjson.com/bins/a6da9";
let next = document.querySelector('#next');
const request = new XMLHttpRequest();

document.querySelector('.max-questions').innerHTML = maxQuestions;

// RANDOM NUMBER FUNCTION 

function randomize(param) {
	return Math.floor(Math.random() * param);
}

// MAIN QUESTION REQUEST

function requestQuestion() {
	request.open('get', url, true);

	request.onreadystatechange = function() {

		if ( request.readyState == 4 && request.status == 200 ) {
			let data = JSON.parse(request.responseText);
			let string = "";

			// GENERATE ARRAY OF RANDOM NUMBERS

			var numArr = [];
			while ( numArr.length < numOfQuestions ) {
			    var num = Math.floor(Math.random() * numberOfContinents);
			    if ( numArr.indexOf(num) === -1 )
			    	numArr.push(num);
			}
			numArr = (numArr.map(x => x * numberOfImages)).reverse();

			// RANDOM CORRECT ANSWER CHOICE

			correctAnswer = randomize(numOfQuestions);
			let correctAnswerImage = numArr[correctAnswer] + randomize(numberOfImages);
			document.querySelector('.image').setAttribute('src', data[correctAnswerImage].image);

			// 3 RANDOM CONTINENTS CHOICE FOR ANSWERS FIELD

			for ( let i = 0; i < numArr.length; i++ ) {
				let el = data[numArr[i]];
				string += "<li class='answer'>" + el.continent + "</li>";
			}
			answers.innerHTML = string;
			setTimeout(() => {
				document.querySelector('.app-body').classList.add('loaded');
			}, 300);
		}
	}
	request.send();
}

requestQuestion();

// ANSWER CLICK EVENT

document.querySelector('.answers').addEventListener('click', function(e){
	let i = 0;
	let el = e.target;
	if ( !clicked ) {
		while ( el.previousElementSibling !== null ) {
			i++;
			el = el.previousElementSibling;
		}
		e.target.classList.add('selected');
		if ( i == correctAnswer ) {
			result += pointsGained;
			// console.log(result)
		} else {
			e.target.classList.add('wrong');
		}
		document.getElementsByClassName('answer')[correctAnswer].classList.add('correct');
	}
	next.classList.add('conform');
	clicked = true;

});

// NEXT CLICK EVENT 

next.addEventListener('click', function(){
	if ( questionCount < maxQuestions ) {
		clicked = false;
		questionCount++;
		document.querySelector('.current-qiestion').innerHTML = questionCount;
		requestQuestion();
		this.classList.remove('conform');
		document.querySelector('.app-body').classList.remove('loaded');
	} else {
		console.log('endgamee');
		endGame();
	}
	
});

// ENDGAME FUNCTION

function endGame() {
	document.querySelector('.app-body').classList.remove('loaded');
	setTimeout(()=>{

	}, 300)
}




