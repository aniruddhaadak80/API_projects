//********** Get random numbers with the help of button **********
const numberFactsBtn = document.getElementById("number-facts-btn");

const displayNumFacts = document.getElementById("display-num-facts");

let genetrateNumFacts = async () => {
  let randomMathNum = Math.floor(Math.random() * 100);
  //**************  notice the below line . That is how I have to manually add random number (User can Add too through input .) **********
  let apiUrl = await fetch(`http://numbersapi.com/${randomMathNum}?json`);

  let result = await apiUrl.json();
  //   from json url
  displayNumFacts.innerHTML = result.text;

  //   for testing purpose
  console.table(result);
  console.log(randomMathNum);
};

numberFactsBtn.addEventListener("click", genetrateNumFacts);
// see console
genetrateNumFacts();

//********** Get random numbers with the help of user input  **********
const userInputBtn = document.getElementById("userInputBtn");

const userInput = document.getElementById("userInput");

const displayUserInput  = document.getElementById("dis-input-facts");

let genetrateNumUsingInput = async () => {
  // user input number
  let inputNum = parseInt(userInput.value);

  let apiUrl = await fetch(`http://numbersapi.com/${inputNum}?json`);

  let result = await apiUrl.json();

  // display input-num facts in page 
  displayUserInput.innerHTML= result.text;

  console.table(result.text);
};

userInputBtn.addEventListener("click",genetrateNumUsingInput);

