const inputYear = document.getElementById("inputYear");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");

// Define the function to check for leap year
let getYear = (year) => {
  if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
    result.textContent = `${year} is a leap year .`;
  } else {
    result.textContent = `${year} is not a leap year .`;
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
    // If it's not a valid number, show an error.
    // textContent (not innerHTML) so the typed value is shown as plain text
    // instead of being parsed as HTML.
    result.textContent = ` " ${inputYear.value} " is not a valid year!`;
  }
});
