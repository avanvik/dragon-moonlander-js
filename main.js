var el = document.getElementById('rocket')
var cont = document.getElementById('container')
var startingPoint = {
	x: (cont.offsetWidth - el.offsetWidth) / 2,
	y: cont.offsetHeight - el.offsetHeight - 30
}

var gravity = 0.04
var thrust = 0.08

var acc = {
  x: 0,
  y: gravity
}

var speed = {
  x: 0,
  y: 0
}

var pos = {
  x: startingPoint.x,
  y: startingPoint.y
}

var torque = 0
var rotation = 0

var steering = {
  up: 0,
  down: 0,
  left: 0,
  right: 0
}

document.addEventListener("keydown", event => {
  if (event.isComposing || event.keyCode === 38) {
    steering.up = 1
  }
  if (event.isComposing || event.keyCode === 37) {
    steering.left = 1
  }
  if (event.isComposing || event.keyCode === 39) {
    steering.right = 1
  }
});

document.addEventListener("keyup", event => {
  if (event.isComposing || event.keyCode === 38) {
    steering.up = 0
  }
  if (event.isComposing || event.keyCode === 37) {
    steering.left = 0
  }
  if (event.isComposing || event.keyCode === 39) {
    steering.right = 0
  }
});

var lastTime = 0
var dTime = 0
function calcShip (timestamp) {
  dTime = timestamp - lastTime
  console.log(dTime)
  
  if (steering.up > 0) {
    el.classList.add('thrusting')
  } else {
    el.classList.remove('thrusting')
  }
  
  speed.x *= .995
  speed.y *= .995
  
  torque += (steering.right - steering.left) * 0.2
  torque *= 0.95
  
  acc.x = Math.sin(rotation * (Math.PI / 180)) * steering.up * thrust
  acc.y = gravity - (steering.up * thrust * Math.cos(rotation * (Math.PI / 180)))
  
  speed.x += acc.x
  speed.y += acc.y
  
  pos.x += speed.x
  pos.y += speed.y
  
  if (pos.y + el.offsetHeight + 5 >= container.offsetHeight) {
		torque *= 0.2
    acc.y = 0
    speed.y = -0.5 * Math.abs(speed.y)
		speed.x *= .2
    pos.y = container.offsetHeight - (el.offsetHeight + 5)
  } else if (pos.x <= 0) {
    acc.x = 0
    speed.x = 0.5 * Math.abs(speed.x)
    pos.x = 0
  } else if (pos.x + el.offsetWidth >= container.offsetWidth) {
    acc.x = 0
    speed.x = -0.5 * Math.abs(speed.x)
    pos.x = container.offsetWidth - el.offsetWidth
  }
	
	rotation += torque
  
  el.style.transform = `rotate(${rotation}deg)`
  el.style.left = pos.x + 'px'
  el.style.top = pos.y + 'px'
  
  lastTime = timestamp
  window.requestAnimationFrame(calcShip)
}

window.requestAnimationFrame(calcShip)
/* setInterval(calcShip, 5) */

