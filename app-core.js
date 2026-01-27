(function(){
  const board = document.getElementById("game-board");
  const len = window.APP_CONFIG.DEFAULTS.wordLength;

  board.style.gridTemplateColumns = `repeat(${len}, 48px)`;

  for(let i=0;i<len*window.APP_CONFIG.DEFAULTS.guesses;i++){
    const d=document.createElement("div");
    d.className="tile";
    board.appendChild(d);
  }

  console.log("Phonics Wordle loaded");
})();