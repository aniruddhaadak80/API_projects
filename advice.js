const adviceBtn = document.getElementById("adviceBtn");
const displayDiv = document.getElementById("display-advice");

const generateAdvice = async () => {
  try {
    // cache: "no-store" because the Advice Slip API caches the same slip for ~2 s.
    const res = await fetch("https://api.adviceslip.com/advice", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    displayDiv.textContent = result.slip.advice;
  } catch (err) {
    displayDiv.textContent = "Couldn't load advice right now. Try again in a moment.";
    console.error("advice:", err);
  }
};

adviceBtn.addEventListener("click", generateAdvice);
generateAdvice();
