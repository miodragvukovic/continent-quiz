// GLOBAL VARIABLES

let numOfQuestions = 3;
let numOfScores = 3;
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
let localArr = []
let answers = document.querySelector('.answers');
let url = "https://api.myjson.com/bins/a6da9";
let next = document.querySelector('#next');
const request = new XMLHttpRequest();

document.querySelector('.max-questions').innerHTML = maxQuestions;

// LOADING LOCAL STORAGE & COMPARISION

window.onload = function(){
	Object.keys(localStorage).forEach(function(key){
	   let el = JSON.parse(localStorage.getItem(key))
	   localArr.push(el)
	});
	localArr.sort((a,b) => (a.highscore < b.highscore) ? 1 : ((b.highscore < a.highscore) ? -1 : 0));
	
	let string = "";
	if ( localArr.length > 0 ) {
		for ( let i = 0; i < localArr.length; i++ ) {
			if ( i < numOfScores ) {
				string += "<li data-date='"+ localArr[i].time +"' class='score'>";
				string += "<span class='flex justify-center vertical-center'>"+ (i + 1) +"</span>"
				string += localArr[i].highscore + " pts"
				string += "</li>";
			}
		}
	} else {
		string += "<h2>Sorry, currently there are no results to show.</h2>";
	}
	document.querySelector('.scores').innerHTML = string;
};

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

document.querySelector('#start').addEventListener('click', function(){
	requestQuestion();
	document.querySelector('.home').style.display = "none";
	setTimeout(() => {
		document.querySelector('.question').style.display = "block";
		document.querySelector('.question').classList.add('started-app');
	}, 300)
});



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

function endGame() {
	document.querySelector('.app-body').classList.remove('loaded');
	setTimeout(()=>{

	}, 300);
	let date = new Date();
	let score = {
		'time': 'on '+ date.getMonth() +'/' + date.getDate() + '/'+ date.getFullYear(),
		'highscore': result
	}
	localStorage.setItem(date.getTime(), JSON.stringify(score));
}






