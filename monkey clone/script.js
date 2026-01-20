const words = [
  "time","people","year","way","day","thing","man","world","life","hand",
  "part","child","eye","woman","place","work","week","case","point","government",
  "company","number","group","problem","fact","be","have","do","say","get"
];

const WORD_COUNT = 25;

let chars = [];
let index = 0;
let correctChars = 0;
let totalChars = 0;
let startTime = null;
let finished = false;

const testArea = document.getElementById("test-area");
const correctEl = document.getElementById("correct");
const totalEl = document.getElementById("total");

function generateText() {
  return Array.from({ length: WORD_COUNT }, () =>
    words[Math.floor(Math.random() * words.length)]
  ).join(" ");
}

function renderTest() {
  testArea.innerHTML = "";
  chars = generateText().split("");

  chars.forEach((c, i) => {
    const span = document.createElement("span");
    span.textContent = c;
    span.className = "char";
    if (i === 0) span.classList.add("cursor");
    testArea.appendChild(span);
  });
}

renderTest();

document.addEventListener("keydown", (e) => {
  if (finished) return;
  if (e.key.length > 1 && e.key !== "Backspace") return;

  if (!startTime) startTime = Date.now();

  const spans = document.querySelectorAll(".char");
  spans[index].classList.remove("cursor");

  if (e.key === chars[index]) {
    spans[index].classList.add("correct");
    correctChars++;
  } else {
    spans[index].classList.add("wrong");
  }

  totalChars++;
  index++;

  correctEl.textContent = correctChars;
  totalEl.textContent = totalChars;

  if (index < spans.length) {
    spans[index].classList.add("cursor");
  } else {
    finishTest();
  }
});

function finishTest() {
  finished = true;
  const timeMinutes = (Date.now() - startTime) / 60000;

  const wpm = Math.round((correctChars / 5) / timeMinutes);
  const rawWpm = Math.round((totalChars / 5) / timeMinutes);
  const accuracy = Math.round((correctChars / totalChars) * 100);

  document.getElementById("wpm").textContent = wpm;
  document.getElementById("rawWpm").textContent = rawWpm;
  document.getElementById("accuracy").textContent = accuracy;
  document.getElementById("result").classList.remove("hidden");

  saveScore(wpm, accuracy);
  loadLeaderboard();
}

function saveScore(wpm, accuracy) {
  if (accuracy < 90) return;

  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push({ wpm, accuracy });

  scores.sort((a, b) => b.wpm - a.wpm);
  localStorage.setItem("scores", JSON.stringify(scores.slice(0, 50)));
}

function loadLeaderboard() {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.forEach(score => {
    const li = document.createElement("li");
    li.textContent = `${score.wpm} WPM | ${score.accuracy}%`;
    list.appendChild(li);
  });
}

loadLeaderboard();

function restart() {
  index = 0;
  correctChars = 0;
  totalChars = 0;
  startTime = null;
  finished = false;
  correctEl.textContent = "0";
  totalEl.textContent = "0";
  document.getElementById("result").classList.add("hidden");
  renderTest();
}
