document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ script.js is running");

  var box = document.createElement("div");
  box.textContent = "JavaScript is running correctly.";
  box.style.padding = "20px";
  box.style.margin = "20px";
  box.style.background = "#e3f2fd";
  box.style.fontSize = "18px";

  document.body.appendChild(box);
});
