const getFactBtn = document.getElementById("factBtn");
const displayFact = document.getElementById("displayFact");

const generateFacts = async () => {
  try {
    const res = await fetch("https://catfact.ninja/fact?max_length=1000");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    displayFact.textContent = result.fact;
  } catch (err) {
    displayFact.textContent = "Couldn't load a cat fact right now. Try again in a moment.";
    console.error("catFacts:", err);
  }
};

getFactBtn.addEventListener("click", generateFacts);
