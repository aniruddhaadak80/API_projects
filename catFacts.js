const getFactBtn = document.getElementById("factBtn");

const displayFact = document.getElementById("displayFact");

let generateFacts = async () => {
  let getUrl = await fetch("https://catfact.ninja/fact?max_length=1000");
  let result = await getUrl.json();

  // display fact
  displayFact.innerHTML = result.fact;

  /* for testing purpose 
    console.log(result.fact);
    */
};
getFactBtn.addEventListener("click", generateFacts);

/* testing purpose
 generateFacts();
*/
