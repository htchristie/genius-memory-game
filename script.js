const data = {
  gameOn: false,
  timeout: undefined,
  sounds: [],
  playerCanPlay: false,
  score: 0,
  gameSequence: [],
  playerSequence: []
};

const gui = {
  start: document.querySelector(".game__center-score"),
  pads: document.querySelectorAll(".game__pad")
};

const padSounds = [
	"audio/simonSound1.mp3",
	"audio/simonSound2.mp3",
	"audio/simonSound3.mp3",
	"audio/simonSound4.mp3"
];

padSounds.forEach(sndPath => {
  const audio = new Audio(sndPath);
  data.sounds.push(audio);
});

gui.start.addEventListener("click", () => {
  restartGame();
});

const padListener = (e) => {
  if(!data.playerCanPlay)
      return;

  let soundId;
  gui.pads.forEach((pad, key) => {
    if (pad === e.target)
        soundId = key;
  });

  e.target.classList.add("active");

  data.sounds[soundId].play();
  data.playerSequence.push(soundId);

  setTimeout(() => {
    e.target.classList.remove("active");

    const currentMove = data.playerSequence.length - 1;

    if (data.playerSequence[currentMove] !== data.gameSequence[currentMove]) {
      data.playerCanPlay = false;
      disablePads();
      gameOver();
    }
    else if (currentMove === data.gameSequence.length - 1) {
      newColor();
      playSequence();
    }
  
    waitForPlayer();
  }, 250);

}

gui.pads.forEach(pad => {
  pad.addEventListener("click", padListener);
});

const startGame = () => {
  newColor();
  playSequence();
}

const newColor = () => {
  data.gameSequence.push(Math.floor(Math.random() * 4));
  data.score++;
  gui.start.innerHTML = data.score;
}

const playSequence = () => {
  let counter = 0,
      padOn = true;

  data.playerSequence = [];
  data.playerCanPlay = false;

  changeCursor("auto");

  const interval = setInterval(() => {
    if(padOn){
      if(counter === data.gameSequence.length){
        clearInterval(interval);
        disablePads();
        waitForPlayer();
        changeCursor("pointer");
        data.playerCanPlay = true;
        return;
      }

      const sndId = data.gameSequence[counter];
      const pad = gui.pads[sndId];

      data.sounds[sndId].play();
      pad.classList.add("active");
      counter++;
    }

    else {
      disablePads();
    }

    padOn = !padOn;
  }, 500);
}

const waitForPlayer = () => {
  clearTimeout(data.timeout);

  data.timeout = setTimeout (() => {
    if(!data.playerCanPlay)
        return;
    
    disablePads();
    playSequence();
  }, 5000);
}

const gameOver = () => {
  window.alert(`Game over. Your score was ${data.score}. Restarting the game...`);
  restartGame();
}

const restartGame = () => {
  data.gameOn = true;
  gui.start.innerHTML = "0";

  data.playerCanPlay = false;
  data.score = 0;
  data.gameSequence = [];
  data.playerSequence = [];

  disablePads();
  changeCursor("auto");
  startGame();
}

const changeCursor = (cursorType) => {
  gui.pads.forEach(pad => {
    pad.style.cursor = cursorType;
  });
}

const disablePads = () => {
  gui.pads.forEach(pad => {
    pad.classList.remove("active");
  })
}
