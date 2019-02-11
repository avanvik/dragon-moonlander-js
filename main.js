const rocketElement = document.getElementById('rocket')
const containerElement = document.getElementById('container')
const controlPad = document.getElementById("control-pad")
const controlPadLines = {
  "horisontal": document.getElementById("line-h"),
  "vertical": document.getElementById("line-v")
}
const flameElementLeft = document.getElementById('thrust-flame--l')
const flameElementRight = document.getElementById('thrust-flame--r')
const outputEl = document.getElementById('output')

function output (data) {
  outputEl.innerHTML = data
}

const settings = {
  startingPoint: {
    x: (containerElement.offsetWidth - rocketElement.offsetWidth) / 2,
    y: containerElement.offsetHeight - rocketElement.offsetHeight - 30
  },
  framerate: 60,
  gravity: 0.04,
  thrustMultiplier: 0.08,
  drag: .995,
  rotDrag: 0.95
}

var acc = {
  x: 0,
  y: settings.gravity
}

var speed = {
  x: 0,
  y: 0
}

var pos = {
  x: settings.startingPoint.x,
  y: settings.startingPoint.y
}

var torque = 0
var rotation = 0

var controls = {
  horisontal: 0, // -1 to 1
  vertical: 0,
}

function renderControlPad() {
  controlPadLines.vertical.style.left = (controls.horisontal+1) / 2 * controlPad.offsetWidth -2 + "px"
  controlPadLines.horisontal.style.bottom = controls.vertical * controlPad.offsetHeight -2 + "px"
}

document.addEventListener("keydown", event => {
  if (event.isComposing || event.keyCode === 38) {
    controls.vertical = 1
  }
  if (event.isComposing || event.keyCode === 37) {
    controls.horisontal = -1
  }
  if (event.isComposing || event.keyCode === 39) {
    controls.horisontal = 1
  }
});

document.addEventListener("keyup", event => {
  if (event.isComposing || event.keyCode === 38) {
    controls.vertical -= 1
  }
  if (event.isComposing || event.keyCode === 37) {
    controls.horisontal += 1 
  }
  if (event.isComposing || event.keyCode === 39) {
    controls.horisontal -= 1
  }
});

// Mouse
controlPad.addEventListener('mousemove', (e)=>{
  controls.horisontal = (e.offsetX / controlPad.offsetWidth) * 2 - 1
  controls.vertical = 1 - e.offsetY / controlPad.offsetHeight
  e.preventDefault()
})

controlPad.addEventListener('mouseout', (e)=>{
  controls.horisontal = 0
  controls.vertical = 0
  e.preventDefault()
})

// Touch
controlPad.addEventListener('touchmove', (e)=>{
  const rect = e.target.getBoundingClientRect()
  controls.horisontal = ((e.targetTouches[0].pageX - rect.left) / controlPad.offsetWidth) * 2 - 1
  controls.vertical = 1 - (e.targetTouches[0].pageY - rect.top) / controlPad.offsetHeight
  e.preventDefault()
})

controlPad.addEventListener('touchend', (e)=>{
  controls.horisontal = 0
  controls.vertical = 0
  e.preventDefault()
})

function steerShip(){
  if (controls.vertical > 0) {
    rocketElement.classList.add('thrusting')
  } else {
    rocketElement.classList.remove('thrusting')
  }

  // Set fire lengths
  flameElementLeft.style.height = controls.vertical * 20 + controls.horisontal * 10 + "px"
  flameElementRight.style.height = controls.vertical * 20 + controls.horisontal * -10 + "px"
  
  // Do physics stuff
  speed.x *= settings.drag
  speed.y *= settings.drag
  
  torque += controls.horisontal * 0.2
  torque *= settings.rotDrag
  
  acc.x = Math.sin(rotation * (Math.PI / 180)) * controls.vertical * settings.thrustMultiplier
  acc.y = settings.gravity - (controls.vertical * settings.thrustMultiplier * Math.cos(rotation * (Math.PI / 180)))
  
  speed.x += acc.x
  speed.y += acc.y
  
  pos.x += speed.x
  pos.y += speed.y

  rotation += torque
}

function checkCollisions(){
  if (pos.y + rocketElement.offsetHeight + 5 >= container.offsetHeight) {
		torque *= 0.2
    acc.y = 0
    speed.y = -0.5 * Math.abs(speed.y)
		speed.x *= .2
    pos.y = container.offsetHeight - (rocketElement.offsetHeight + 5)

  } else if (pos.x <= 0) {
    acc.x = 0
    speed.x = 0.5 * Math.abs(speed.x)
    pos.x = 0

  } else if (pos.x + rocketElement.offsetWidth >= container.offsetWidth) {
    acc.x = 0
    speed.x = -0.5 * Math.abs(speed.x)
    pos.x = container.offsetWidth - rocketElement.offsetWidth
  }
}

function moveShip() {
  rocketElement.style.transform = `rotate(${rotation}deg)`
  rocketElement.style.left = pos.x + 'px'
  rocketElement.style.top = pos.y + 'px'
}

// ---

function renderShip () {
  steerShip(controls)
  renderControlPad()
  checkCollisions()
  moveShip()
}
setInterval(renderShip, 1000/settings.framerate)

