
// *******  for random quotes with author name ***** 
const generateBtn = document.getElementById("generateQuote");

const displayQuotes = document.getElementById("displayQuotes");

const authorname = document.getElementById("authorname");

let getRandonQuote = async () => {
  let api = await fetch("https://api.quotable.io/random");
  let result = await api.json();

  //   Display the quote
  displayQuotes.innerHTML = result.content;

  // Display the author name
  authorname.innerHTML = `by ➡️ ${result.author}`;
  console.table(result);
};

generateBtn.addEventListener("click", getRandonQuote);




