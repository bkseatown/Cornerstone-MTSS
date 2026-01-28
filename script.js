body {
  font-family: 'Lexend', sans-serif;
  margin: 0;
  background: #f4f6f8;
}

#game-board {
  display: grid;
  gap: 6px;
  justify-content: center;
  margin: 20px;
}

.tile {
  width: 50px;
  height: 50px;
  border: 2px solid #ccc;
}

/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

/* Modal */
.modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 300px;
  position: relative;
}

.hidden {
  display: none;
}

.close-btn {
  position: absolute;
  right: 12px;
  top: 10px;
  font-size: 20px;
  cursor: pointer;
}

/* Banner */
.banner {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #2c3e50;
  color: white;
  padding: 14px 24px;
  border-radius: 30px;
  z-index: 200;
}

.error {
  color: red;
  font-size: 0.85rem;
}
