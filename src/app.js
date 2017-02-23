'use-strict'

//-------------Constants-------------//
const WIDTH = 800;
const HEIGHT = 450;
const STARS = 1000;
const PLANETS = 300;
const G = 1;

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
  setInterval(tick, 10);
}

function tick() {
  if(!paused) {
    update();
  }
  render();
}

function update() {
  applyGravity();
  updatePlanets();
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
  for(let i = 0; i < PLANETS; i++) {
    const planet = new Planet(
      { x: Math.random() * WIDTH, y: Math.random() * HEIGHT },
      { x: 0, y: 0 },
      Math.random() * 100 + 20,
      '#ffffff');
    planets.push(planet);
  }
}

function Planet(pos, vel, mass, color) {
  return {
    pos,
    vel,
    force: { x: 0, y: 0 },
    mass,
    color,
    radius: Math.cbrt(mass * 3/(4 * Math.PI)),
    distanceTo: function(other) {
      const xDel = this.pos.x - other.pos.x;
      const yDel = this.pos.y - other.pos.y;
      return Math.sqrt(sq(xDel) + sq(yDel));
    },
    collidesWith: function(other) {
      return this.distanceTo(other) < this.radius + other.radius;
    },
  };
}

function applyGravity() {
  for(let i = 0; i < planets.length; i++) {
    const planet = planets[i];
    for(let j = 0; j < planets.length; j++) {
      if(i !== j) {
        const other = planets[j];
        const dist = planet.distanceTo(other);
        const ydist = other.pos.y - planet.pos.y;
        const xdist = other.pos.x - planet.pos.x;
        const force = G * planet.mass * other.mass / sq(dist);
        const xforce = (xdist / dist) * force;
        const yforce = (ydist / dist) * force;
        planet.force.x += xforce;
        planet.force.y += yforce
      }
    }
  }
}

function updatePlanets() {
  for(let i = 0; i < planets.length; i++) {
    const planet = planets[i];
    planet.vel.x += planet.force.x / planet.mass;
    planet.vel.y += planet.force.y / planet.mass;
    planet.pos.x += planet.vel.x;
    planet.pos.y += planet.vel.y;
    planet.force.x = 0;
    planet.force.y = 0;
    const j = collidesWithAny(planet)
    if(j >= 0) {
      impact(i, j);
    }
  }
}

function impact(i, j) {
  const p1 = planets[i];
  const p2 = planets[j];

  planets.splice(i, 1);
}

function collidesWithAny(planet) {
  for(let i = 0; i < planets.length; i++) {
    const other = planets[i];
    if(planet !== other) {
      if(planet.collidesWith(other)) {
        return i;
      }
    }
  }
  return -1;
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
