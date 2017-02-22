'use-strict'

//-------------Constants-------------//
const WIDTH = 800;
const HEIGHT = 450;
const STARS = 1000;

//-------------Refs-------------//
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')
const stars = [];
const planets = [];

//-------------Vars-------------//
let paused;


//-------------Control-------------//
function init() {
  paused = false;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  generateStars();
  generatePlanets();

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
  renderPlanets();
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

function generatePlanets() {
  const planet = new Planet(
    { x: 400, y: 400 },
    { x: 0, y: 0 },
    100,
    '#cc6666');
  planets.push(planet);
}

function Planet(pos, vel, mass, color) {
  return {
    pos,
    vel,
    mass,
    color,
    radius: Math.cbrt(mass * 3/(4 * Math.PI)),
    distanceTo: function(other) {
      const xDel = this.pos.x - other.pos.x;
      const yDel = this.pos.y - other.pos.y;
      return Math.sqrt(sq(xDel) + sq(yDel));
    },
    collidesWith: function(other) {
      return this.size + other.size < this.distanceTo(other);
    },
  }
}

//-------------Math-------------//
function sq(n) {
  return n * n;
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

function renderPlanets() {
  for(let i = 0; i < planets.length; i++) {
    const planet = planets[i];
    ctx.beginPath();
    ctx.arc(planet.pos.x, planet.pos.y, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();
  }
}
