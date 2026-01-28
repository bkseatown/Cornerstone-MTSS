document.addEventListener("DOMContentLoaded", function () {

  var overlay = document.getElementById("overlay");
  var closeBtn = document.getElementById("close-modal");
  var startBtn = document.getElementById("start-btn");

  function closeModal() {
    overlay.style.display = "none";
    console.log("✅ Modal closed");
  }

  function openModal() {
    overlay.style.display = "flex";
    console.log("✅ Modal opened");
  }

  // --- CLOSE HANDLERS (ALL ROUTE HERE) ---
  closeBtn.addEventListener("click", closeModal);
  startBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  window.addEventListener("keydown", function (e) {
    if (overlay.style.display !== "none") {
      if (e.key === "Escape" || e.key === "Enter") {
        closeModal();
      }
    }
  });

  // --- DEMO BOARD ---
  var board = document.getElementById("board");
  for (var i = 0; i < 30; i++) {
    var tile = document.createElement("div");
    tile.className = "tile";
    board.appendChild(tile);
  }

  // --- DEMO KEYBOARD ---
  var keyboard = document.getElementById("keyboard");
  var letters = "QWERTYUIOPASDFGHJKLZXCVBNM";
  for (var j = 0; j < letters.length; j++) {
    var key = document.createElement("button");
    key.className = "key";
    key.textContent = letters[j];
    keyboard.appendChild(key);
  }

  // --- SPEECH DEMO ---
  document.getElementById("hear-word").onclick = function () {
    speechSynthesis.speak(new SpeechSynthesisUtterance("plant"));
  };

  document.getElementById("hear-sentence").onclick = function () {
    speechSynthesis.speak(
      new SpeechSynthesisUtterance("The plant grew in the sun.")
    );
  };

  // --- FORCE MODAL OPEN ON LOAD ---
  openModal();

  console.log("✅ App fully loaded");
});
