// GLOBAL VARIABLES

const numOfQuestions = 3,
	numOfScores = 3,
	pointsGained = 750,
	maxQuestions = 5;

let correctAnswer,
	result = 0,
	questionCount = 1,
	clicked = false,
	localData,
	localArr = [];

// ELEMENT SELECTORS

const answersEl = document.querySelector('.answers'),
	questionEl = document.querySelector('.question'),
	nextEl = document.querySelector('#next');

// AJAX-RELATED VARIABLES

const url = "https://api.myjson.com/bins/a6da9",
	request = new XMLHttpRequest();

// RANDOM NUMBER FUNCTION 

function randomize(param) {
	return Math.floor(Math.random() * param);
}

// COMMA SEPARATOR FUNCTION FOR THOUSANDS

function separateNum(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ONLOAD EVENT

window.onload = function(){

	// LOADED LOCAL STORAGE PUSHED INTO ARRAY

	Object.keys(localStorage).forEach(function(key){
	   let el = JSON.parse(localStorage.getItem(key));
	   localArr.push(el);
	});

	// SORTING LOCAL STORAGE VALUES FROM HIGHEST TO LOWEST

	localArr.sort((a,b) => (a.highscore < b.highscore) ? 1 : ((b.highscore < a.highscore) ? -1 : 0));

	// PRINTING RESULTS OR NO RESULTS FOR HOMEPAGE

	let string = "";
	if ( localArr.length > 0 ) {
		string += "<ul>";
		for ( let i = 0; i < localArr.length; i++ ) {
			if ( i < numOfScores ) {
				string += "<li data-date='"+ localArr[i].time +"' class='score'>";
				string += "<span class='flex justify-center vertical-center'>"+ (i + 1) +"</span>";
				string += separateNum(localArr[i].highscore) + " pts";
				string += "</li>";
			}
		}
		string += "</ul>";
	} else {
		string += "<h2>Currently there are no results to show, would you like to start the game?<br>Click the button below.</h2>";
	}
	document.querySelector('.scores').innerHTML = string;
};

// MAIN QUESTION REQUEST

function gatherInfo() {

	request.open('get', url, true);

	request.onreadystatechange = function() {

		if ( request.readyState == 4 && request.status == 200 ) {

			let data = JSON.parse(request.responseText);

			// SORT DATA ASCENDING IN CASE ORDER OF OBJECTS IN API CHANGES

			data.sort((a,b) => (a.continent > b.continent) ? 1 : ((b.continent > a.continent) ? -1 : 0));

			// SCOPE VARIABLES

			let continents = [[]],
				arrayIndex = 0,
				currentContinent = data[0];

			// RE-GROUPING RECIEVED DATA FOR EASIER HANDLING

			for ( let i = 0; i < data.length; i++ ) {
				if ( currentContinent.continent != data[i].continent ) {
					arrayIndex++;
					continents.push([data[i]]);
					currentContinent = data[i];
				} else {
					continents[arrayIndex].push(data[i]);
				}
			}

			// STORING AJAX RESPONSE DATA INTO LOCAL VARIABLE, TO PREVENT REQUEST ON EACH QUESTION

			localData = continents;

			// REQUESING FIRST QUESTION

			requestQuestion();
		}
	}

	// ERROR HANDLING

	request.onerror = function() {
		alert('An error occured while loading page.');
	}
	request.send();
}

// 

function requestQuestion() {

	let string = "";

	// UNIQUE SET OF NUMBERS LIMITED BY NUMBER OF ANSWERS

	var numArr = [];
	while ( numArr.length < numOfQuestions ) {
	    var num = Math.floor(Math.random() * localData.length);
	    if ( numArr.indexOf(num) === -1 )
	    	numArr.push(num);
	}
	
	// GENERATING CORRECT ANSWER AND LOOPING FOR RANDOM IMAGE

	correctAnswer = randomize(numArr.length);
	let correctAnswerImage = localData[numArr[correctAnswer]];
	correctAnswerImage = correctAnswerImage[randomize(correctAnswerImage.length)].image;
	document.querySelector('.image').setAttribute('src', correctAnswerImage);

	// 3 RANDOM CONTINENTS CHOICE FOR ANSWERS FIELD

	for ( let i = 0; i < numArr.length; i++ ) {
		let el = localData[numArr[i]];
		el = el[0].continent;
		string += "<li class='answer'>" + el + "</li>";
	}
	answersEl.innerHTML = string;

	// SMALL DELAY TO PROVIDE ANIMATION BETWEEN QUESTIONS

	setTimeout(() => {
		document.querySelector('.app-body').classList.add('loaded');
	}, 400);
}

// START GAME EVENT

document.querySelector('#start').addEventListener('click', function(){

	// CURRENT AND MAX AMOUNT OF QUESTIONS ADDED

	document.querySelector('.current-qiestion').innerHTML = questionCount;
	document.querySelector('.max-questions').innerHTML = maxQuestions;

	// REQUEST QUESTION ON START

	gatherInfo();

	// HIDE HOME PAGE AND DISPLAY QUESTIONS LAYOUT

	document.querySelector('.home').style.display = "none";
	setTimeout(() => {
		questionEl.style.display = "block";
		questionEl.classList.add('started-app');
	}, 300);
});

// ANSWER CLICK EVENT

answersEl.addEventListener('click', function(e){
	let i = 0;
	let el = e.target;

	if ( !clicked && e.target.classList.contains('answer') ) {

		// LOOP THROUGH PREVIOUS ELEMENTS ( LOGIC )

		while ( el.previousElementSibling !== null ) {
			i++;
			el = el.previousElementSibling;
		}
		e.target.classList.add('selected');

		// RIGHT / WRONG ANSWER CONDITION

		i == correctAnswer ? result += pointsGained : e.target.classList.add('wrong');

		// CHANGE LAST BUTTON TEXT TO RESULTS INSTEAD OF NEXT

		if ( questionCount == maxQuestions ) 
			nextEl.innerHTML = "result";

		// HIGHLIGHT SELECTED ANSWER

		document.getElementsByClassName('answer')[correctAnswer].classList.add('correct');

		// HIGHLIGHT/SHOW BUTTONS

		nextEl.classList.add('conform');
		clicked = true;
	}

});

// NEXT CLICK EVENT 

nextEl.addEventListener('click', function(){

	// CONDITION TO ASK FOR NEXT QUESTION WHILE ITS LESS THAN MAX AMOUNT OF QUESTIONS

	if ( questionCount < maxQuestions ) {
		clicked = false;
		questionCount++;
		document.querySelector('.current-qiestion').innerHTML = questionCount;

		// REQUEST NEXT QUESTION

		requestQuestion();
		this.classList.remove('conform');
		document.querySelector('.app-body').classList.remove('loaded');
	} else {

		// ASK FOR ENDGAME FUNCTION AND DISPLAY USER SCORE

		endGame();
		document.querySelector('#result').innerHTML = separateNum(result) + " pts";
	}
});

// ENDGAME FUNCTION, LOCAL STORAGE REGISTRY

function endGame() {
	const resultPage = document.querySelector('.result-page');

	// HIDE QUESTIONS PAGE AND DISPLAY RESULT PAGE ( WITH SMALL DELAY, TO ANIMATE )

	questionEl.classList.remove('started-app');
	resultPage.style.display = "block";
	setTimeout(()=>{
		questionEl.style.display = "none";
		resultPage.classList.add('loaded');
	}, 300);

	// GROUPING TIME & SCORE FOR LOCAL STORAGE REGISTER

	let date = new Date();
	let score = {
		'time': 'on '+ date.getMonth() +'/' + date.getDate() + '/'+ date.getFullYear(),
		'highscore': result
	}
	localStorage.setItem(date.getTime(), JSON.stringify(score));
}

// FINISH AND HOME BUTTON LISTENER

for ( let el of document.getElementsByClassName('instant-refresh') ) {
	el.addEventListener('click', function(){
		window.location.reload();
	});
}





