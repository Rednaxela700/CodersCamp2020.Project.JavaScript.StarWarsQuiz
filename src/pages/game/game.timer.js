const ls = require('../../scripts/localScorage');

const TIME_TO_CHANGE_ELEMENTS_COLOR = 30;
const timer = {
  gameTime: 0,
  isTimerPaused: true,
  setGameTime: function (gameTime) {
    this.gameTime = gameTime;
  },
  getGameTime: function () {
    return this.gameTime;
  },
  getIsTimerPaused: function () {
    return this.isTimerPaused;
  },
  runTimer: function () {
    this.isTimerPaused = false;
  },
  pauseTimer: function () {
    this.isTimerPaused = true;
  },
  decreaseGameTimer: function () {
    this.gameTime--;
  }
};

const getSpeedFromLocalStorage = () => {
  const settings = ls.getSettings();
  if (!settings) throw new Error('Failed to load data from localStorage');

  return settings.speed;
};

const secondsToTime = seconds => {
  let minutes = 0;

  while (seconds >= 60) {
    seconds -= 60;
    minutes++;
  }

  return `${minutes}m ${seconds}s`;
};

const changeTimerStyleToRed = () => {
  const lightTimer = document.querySelector('.light-timer__countdown-timer');
  const timer = document.querySelector('.timer');

  lightTimer.classList.remove(`shadow--blue`);
  lightTimer.classList.add(`shadow--red`);

  timer.children[0].classList.remove(`text-shadow--blue`);
  timer.children[0].classList.add(`text-shadow--red`);

  timer.children[1].classList.remove(`text--blue`);
  timer.children[1].classList.add(`text--red`);
  timer.children[1].classList.remove(`text-shadow--blue`);
  timer.children[1].classList.add(`text-shadow--red`);
};

const updateTime = () => {
  let seconds = timer.getGameTime();

  setTimerValues(seconds);

  if (seconds == TIME_TO_CHANGE_ELEMENTS_COLOR) changeTimerStyleToRed();
  if (checkGameFinished(seconds)) timer.pauseTimer();

  timer.decreaseGameTimer();
};

const setTimerValues = seconds => {
  const lightTimer = document.querySelector('.light-timer__countdown-timer');
  const time = document.querySelector('#time');
  const timeToShow = secondsToTime(seconds);
  const lightTimerWidth = getLightTimerWidth(seconds);

  time.innerHTML = timeToShow;
  lightTimer.style.width = lightTimerWidth + '%';
};

const getLightTimerWidth = seconds => {
  const gameSpeed = getSpeedFromLocalStorage();

  let result = 100 * ((gameSpeed - seconds) / gameSpeed);
  return result;
};

const checkGameFinished = seconds => {
  return seconds <= 0 ? true : false;
};

const timerInterval = setInterval(() => {
  if (timer.getIsTimerPaused()) return;
  updateTime();
}, 1000);

const startGame = () => {
  const time = getSpeedFromLocalStorage();
  timer.setGameTime(time);
  timer.runTimer();
  timerInterval;
};

window.addEventListener('load', startGame, false);

module.exports = {
  timer,
  getSpeedFromLocalStorage,
  secondsToTime,
  changeTimerStyleToRed,
  updateTime,
  getLightTimerWidth,
  checkGameFinished,
  setTimerValues
};
