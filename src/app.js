'use-strict'

//-------------Constants-------------//
const WIDTH = 1860;
const HEIGHT = 930;
const STARS = 1000;
const PLANETS = 200;
const G = .005;
const VEL = .2;
const MASS = 1000;
const TRAIL_LENGTH = 100;
const TRAIL_QUALITY = 4; //Higher is worse.

//-------------Refs-------------//
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')
const stars = [];
const planets = [];
const trails = [];

//-------------Vars-------------//
let paused;
let count = 0;


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
    count++;
    update();
  }
  render();
}

function update() {
  applyGravity();
  updateTrails();
  updatePlanets();
}

function render() {
  renderBG();
  renderTrails();
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
    const angle = Math.random() * 2 * Math.PI;
    const planet = new Planet(
      { x: Math.random() * WIDTH, y: Math.random() * HEIGHT },
      { x: Math.sin(angle) * VEL, y: Math.cos(angle) * VEL },
      Math.random() * (MASS - 20) + 20,
      'hsl(' + Math.random() * 360 + ', 60%, 70%)');
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
    recalcRadius: function() {
      this.radius = Math.cbrt(this.mass * 3/(4 * Math.PI))
    }
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
    createTrail(planet);
    const j = collidesWithAny(planet)
    if(j >= 0) {
      impact(i, j);
      planets.splice(i, 1);
      i--;
    }
  }
}

function updateTrails() {
  if(count % TRAIL_QUALITY === 0) {
    for (let i = 0; i < trails.length; i ++) {
      trail = trails[i];
      trail.lifespan--;
      if (trail.lifespan <= 0) {
        trails.splice(i, 1);
        i--;
      }
    }
  }
}

function impact(i, j) {
  const p1 = planets[i];
  const p2 = planets[j];
  const totalMass = p1.mass + p2.mass;
  p2.pos.x = p1.pos.x * p1.mass / totalMass + p2.pos.x * p2.mass / totalMass;
  p2.pos.y = p1.pos.y * p1.mass / totalMass + p2.pos.y * p2.mass / totalMass;
  p2.vel.x = p1.vel.x * p1.mass / totalMass + p2.vel.x * p2.mass / totalMass;
  p2.vel.y = p1.vel.y * p1.mass / totalMass + p2.vel.y * p2.mass / totalMass;
  p2.mass = p1.mass + p2.mass;
  if (p2.mass < p1.mass) {
    p2.color = p1.color;
  }
  p2.recalcRadius();
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

function createTrail(planet) {
  if(count % TRAIL_QUALITY === 0) {
    trails.push({
      p1: {
        x: planet.pos.x - (planet.vel.x * TRAIL_QUALITY),
        y: planet.pos.y - (planet.vel.y * TRAIL_QUALITY),
      },
      p2: {
        x: planet.pos.x,
        y: planet.pos.y,
      },
      color: planet.color,
      lifespan: TRAIL_LENGTH,
    });
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
    ctx.closePath();
  }
}

function renderTrails() {
  for(let i = 0; i < trails.length; i ++) {
    const trail = trails[i];
    ctx.beginPath();
    ctx.moveTo(trail.p1.x, trail.p1.y);
    ctx.lineTo(trail.p2.x, trail.p2.y);
    ctx.strokeStyle = trail.color;
    ctx.stroke();
    ctx.closePath();
  }
}
