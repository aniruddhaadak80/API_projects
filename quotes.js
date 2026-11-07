// Random quote with author. Quotable (api.quotable.io) went offline, so this uses DummyJSON.
const generateBtn = document.getElementById("generateQuote");
const displayQuotes = document.getElementById("displayQuotes");
const authorname = document.getElementById("authorname");

const getRandomQuote = async () => {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { quote, author } = await res.json();
    // textContent, never innerHTML: API text is shown as plain text.
    displayQuotes.textContent = quote;
    authorname.textContent = `by ➡️ ${author}`;
  } catch (err) {
    displayQuotes.textContent = "Couldn't load a quote right now. Try again in a moment.";
    authorname.textContent = "";
    console.error("quotes:", err);
  }
};

generateBtn.addEventListener("click", getRandomQuote);
getRandomQuote();
// A new quote every 9 seconds, paused while the tab is hidden.
setInterval(() => { if (!document.hidden) getRandomQuote(); }, 9000);
