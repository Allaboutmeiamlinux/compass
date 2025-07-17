window.addEventListener("deviceorientationabsolute", handleOrientation, true);
window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
  const needle = document.getElementById("needle");
  const directionDisplay = document.getElementById("direction");

  let heading = event.alpha;

  if (typeof event.webkitCompassHeading !== "undefined") {
    heading = event.webkitCompassHeading;
  }

  if (heading !== null) {
    needle.style.transform = `translateX(-50%) rotate(${-heading}deg)`;
    const compassDir = getCompassDirection(heading);
    directionDisplay.textContent = `Direction: ${compassDir}`;
  }
}

function getCompassDirection(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  const index = Math.round(deg / 45);
  return directions[index];
}
