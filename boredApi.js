const boredBtn = document.getElementById("boredBtn");

const displayActivities = document.getElementById("displayActivities");

let generateActivities = async () => {
  let apiUrl = await fetch(
    "https://www.boredapi.com/api/activity?participants=1"
  );
  let result = await apiUrl.json();
  //   display activity from api endpoint
  displayActivities.innerHTML = result.activity;
  console.table(result);
};

boredBtn.addEventListener("click", generateActivities);
