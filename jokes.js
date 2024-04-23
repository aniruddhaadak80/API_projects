const jokesh2 = document.getElementById("jokes");
const ans_joke = document.getElementById("ans-joke");
const joke_btn = document.getElementById("joke-btn");

let randonjoke = async () => {
  // from https://www.postman.com/
  let api = await fetch("https://official-joke-api.appspot.com/random_joke");
  let result = await api.json();

  //randon joke in h2
  jokesh2.innerHTML = result.setup;

  // jokes result in h3
  ans_joke.innerHTML = result.punchline;

  //object in table form in console
  console.table(result);
};

joke_btn.addEventListener("click", randonjoke);

// for testing purpose . See console...
randonjoke(); //call the function
