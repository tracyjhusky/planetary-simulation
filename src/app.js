'use-strict'

//-------------Constants-------------//
const WIDTH = 800;
const HEIGHT = 450;
const STARS = 1000;

//-------------Refs-------------//
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')
const stars = [];

//-------------Vars-------------//
let paused;

//-------------Control-------------//
function init() {
  paused = false;

  generateStars();

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  tick();
  setInterval(tick, 100);
}

function tick() {
  if(!paused) {
    update();
  }
  render();
}

function update() {
  // Do nothing.
}

function render() {
  renderBG();
}

init();

//-------------Model-------------//
function generateStars() {
  for(let i = 0; i < STARS; i++) {
    const star = {
      xPos: Math.floor(Math.random() * WIDTH),
      yPos: Math.floor(Math.random() * HEIGHT),
      color: 'hsl(250, 50%,' + Math.random() * 100 + '%)',
    }
    stars.push(star);
  }
}

function Planet() {
  return {

  }
}

//-------------View-------------//
function renderBG() {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  renderStars();
}

function renderStars() {
  for(let i = 0; i < stars.length; i++) {
    const star = stars[i];
    ctx.fillStyle = star.color;
    ctx.fillRect(star.xPos, star.yPos, 1, 1);
  }
}
