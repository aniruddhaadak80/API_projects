const inputYear = document.getElementById("inputYear");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");

// Define the function to check for leap year
let getYear = (year) => {
  if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
    result.innerHTML = `${year} is a leap year .`;
  } else {
    result.innerHTML = `${year} is not a leap year .`;
  }
};

// Add event listener to the button
submitBtn.addEventListener("click", () => {
  // Get the year from input field
  const year = parseInt(inputYear.value);

  // Check if input is a valid number
  if (!isNaN(year)) {
    // If it's a valid number, check if it's a leap year
    getYear(year);
  } else {
    // If it's not a valid number, show an error
    result.innerHTML = ` " ${inputYear.value} " is not a valid year!`;
  }
});
