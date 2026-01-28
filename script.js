document.addEventListener("DOMContentLoaded", function () {

  // ----- MODAL (ONE AT A TIME) -----
  var overlay = document.getElementById("overlay");
  var closeBtn = document.getElementById("close-modal");
  var modalAction = document.getElementById("modal-action");

  function openModal(title, text, actionText) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-text").textContent = text;
    modalAction.textContent = actionText;
    overlay.classList.remove("hidden");
  }

  function closeModal() {
    overlay.classList.add("hidden");
  }

  closeBtn.onclick = closeModal;
  modalAction.onclick = closeModal;
  overlay.onclick = function (e) {
    if (e.target === overlay) closeModal();
  };

  window.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("hidden")) {
      if (e.key === "Escape" || e.key === "Enter") closeModal();
      e.preventDefault();
    }
  });

  // ----- BOARD -----
  var board = document.getElementById("board");

  function buildBoard() {
    board.innerHTML = "";
    for (var i = 0; i < 30; i++) {
      var tile = document.createElement("div");
      tile.className = "tile";
      board.appendChild(tile);
    }
  }

  // ----- KEYBOARD -----
  var keyboard = document.getElementById("keyboard");
  var keys = "QWERTYUIOPASDFGHJKLZXCVBNM";

  function buildKeyboard() {
    keyboard.innerHTML = "";
    for (var i = 0; i < keys.length; i++) {
      var k = document.createElement("button");
      k.className = "key";
      k.textContent = keys[i];
      keyboard.appendChild(k);
    }
  }

  // ----- BUTTONS -----
  document.getElementById("teacher-btn").onclick = function () {
    openModal("Teacher Mode", "Set a hidden word (coming next).", "OK");
  };

  document.getElementById("new-word-btn").onclick = function () {
    openModal("New Word", "Board reset.", "OK");
    buildBoard();
  };

  // ----- INIT -----
  buildBoard();
  buildKeyboard();
  openModal("Welcome 👋", "Pick a focus and decode the word.", "Start");

  console.log("✅ Full app loaded");
});
