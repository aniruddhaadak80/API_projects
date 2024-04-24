const adviceBtn = document.getElementById("adviceBtn");

const displayDiv = document.getElementById("display-advice");

let generateAdvice = async () => {
  let apiUrl = await fetch("https://api.adviceslip.com/advice");
  let result = await apiUrl.json();
  //   display advice from api endpoint
  displayDiv.innerHTML = result.slip.advice;
  console.table(result);
};

adviceBtn.addEventListener("click", generateAdvice);

generateAdvice();
