const jokesh2 = document.getElementById("jokes");
const ans_joke = document.getElementById("ans-joke");
const joke_btn = document.getElementById("joke-btn");

const randomJoke = async () => {
  try {
    const res = await fetch("https://official-joke-api.appspot.com/random_joke");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    jokesh2.textContent = result.setup;
    ans_joke.textContent = result.punchline;
  } catch (err) {
    jokesh2.textContent = "Couldn't load a joke right now.";
    ans_joke.textContent = "Try again in a moment.";
    console.error("jokes:", err);
  }
};

joke_btn.addEventListener("click", randomJoke);
randomJoke();
