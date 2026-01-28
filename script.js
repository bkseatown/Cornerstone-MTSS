// Decode the Word – SAFE SCRIPT
// This file is intentionally simple to avoid syntax errors

document.addEventListener("DOMContentLoaded", function () {

  // ----- MODAL SYSTEM -----

  var overlay = document.getElementById("overlay");
  var modals = document.querySelectorAll(".modal");
  var focusAnchor = document.getElementById("focus-anchor");

  function closeAllModals() {
    for (var i = 0; i < modals.length; i++) {
      modals[i].classList.add("hidden");
    }
    overlay.classList.add("hidden");
    focusAnchor.focus();
  }

  function openModal(name) {
    closeAllModals();
    overlay.classList.remove("hidden");
    var modal = document.querySelector('.modal[data-modal="' + name + '"]');
    if (modal) modal.classList.remove("hidden");
  }

  // Close buttons
  var closeButtons = document.querySelectorAll(".close-btn");
  for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener("click", closeAllModals);
  }

  // Overlay click
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeAllModals();
  });

  // Esc / Enter closes modal
  window.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("hidden")) {
      if (e.key === "Escape" || e.key === "Enter") {
        closeAllModals();
      }
      e.preventDefault();
    }
  });

  // ----- BUTTONS -----

  var teacherBtn = document.getElementById("teacher-btn");
  if (teacherBtn) {
    teacherBtn.addEventListener("click", function () {
      openModal("teacher");
    });
  }

  var startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", closeAllModals);
  }

  var playAgainBtn = document.getElementById("play-again-btn");
  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", closeAllModals);
  }

  // ----- FIRST LOAD -----

  if (!localStorage.getItem("decode_seen")) {
    openModal("welcome");
    localStorage.setItem("decode_seen", "1");
  }

});
