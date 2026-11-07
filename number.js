// Number facts. numbersapi.com no longer serves HTTPS (and now returns 404), so
// the facts are computed right here: no network, instant, and good logic practice.

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};
const divisors = (n) => {
  const out = [];
  for (let i = 1; i * i <= n; i++) if (n % i === 0) out.push(i, ...(i !== n / i ? [n / i] : []));
  return out.sort((a, b) => a - b);
};
const isFib = (n) => {
  const sq = (x) => Number.isInteger(Math.sqrt(x));
  return sq(5 * n * n + 4) || sq(5 * n * n - 4);
};
const toRoman = (n) => {
  if (n < 1 || n > 3999) return null;
  const map = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  let s = "";
  for (const [v, r] of map) while (n >= v) { s += r; n -= v; }
  return s;
};

function numberFacts(n) {
  const facts = [];
  facts.push(`${n} is ${n % 2 === 0 ? "even" : "odd"}.`);
  if (n >= 0 && n <= 1e7) {
    facts.push(isPrime(n) ? `${n} is a prime number.` : n > 1 ? `${n} is not prime; its divisors are ${divisors(n).join(", ")}.` : `${n} is neither prime nor composite.`);
    if (n > 1) {
      const sum = divisors(n).slice(0, -1).reduce((a, b) => a + b, 0);
      if (sum === n) facts.push(`${n} is a perfect number!`);
    }
  }
  if (Number.isInteger(Math.sqrt(n))) facts.push(`${n} is a perfect square (${Math.sqrt(n)}²).`);
  if (Number.isInteger(Math.round(Math.cbrt(n))) && Math.round(Math.cbrt(n)) ** 3 === n) facts.push(`${n} is a perfect cube (${Math.round(Math.cbrt(n))}³).`);
  if (n >= 0 && isFib(n)) facts.push(`${n} is a Fibonacci number.`);
  facts.push(`In binary it's ${n.toString(2)}, in hex ${n.toString(16).toUpperCase()}.`);
  const roman = toRoman(n);
  if (roman) facts.push(`In Roman numerals: ${roman}.`);
  return facts.join(" ");
}

if (typeof document !== "undefined") {
  const numberFactsBtn = document.getElementById("number-facts-btn");
  const displayNumFacts = document.getElementById("display-num-facts");
  const userInputBtn = document.getElementById("userInputBtn");
  const userInput = document.getElementById("userInput");
  const displayUserInput = document.getElementById("dis-input-facts");

  numberFactsBtn.addEventListener("click", () => {
    displayNumFacts.textContent = numberFacts(Math.floor(Math.random() * 100));
  });

  userInputBtn.addEventListener("click", () => {
    const raw = userInput.value.trim();
    const n = Number(raw);
    if (raw === "" || !Number.isSafeInteger(n)) {
      displayUserInput.textContent = "Please type a whole number, like 28 or 144.";
      return;
    }
    displayUserInput.textContent = numberFacts(n);
  });

  displayNumFacts.textContent = numberFacts(Math.floor(Math.random() * 100));
}

// Exported for unit tests (Node); ignored in the browser.
if (typeof module !== "undefined") module.exports = { numberFacts, isPrime, toRoman, isFib, divisors };
