const boredBtn = document.getElementById("boredBtn");
const displayActivities = document.getElementById("displayActivities");

const generateActivities = async () => {
  try {
    const res = await fetch("https://www.boredapi.com/api/activity?participants=1");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    displayActivities.textContent = result.activity;
  } catch (err) {
    displayActivities.textContent = "Couldn't load an activity right now. Try again in a moment.";
    console.error("bored:", err);
  }
};

boredBtn.addEventListener("click", generateActivities);
