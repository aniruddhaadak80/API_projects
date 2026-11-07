// Gregorian rule: divisible by 4, except centuries, unless divisible by 400.
const isLeapYear = (year) => year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);

if (typeof document !== "undefined") {
  const inputYear = document.getElementById("inputYear");
  const submitBtn = document.getElementById("submitBtn");
  const result = document.getElementById("result");

  const check = () => {
    const raw = inputYear.value.trim();
    const year = Number(raw);
    // textContent (not innerHTML) so the typed value is shown as plain text.
    if (raw === "" || !Number.isInteger(year)) {
      result.textContent = ` " ${inputYear.value} " is not a valid year!`;
      return;
    }
    result.textContent = `${year} is ${isLeapYear(year) ? "" : "not "}a leap year .`;
  };

  submitBtn.addEventListener("click", check);
  inputYear.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
}

if (typeof module !== "undefined") module.exports = { isLeapYear };
