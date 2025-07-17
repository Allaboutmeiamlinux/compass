let holdTimer = null;
let flagShown = false;

window.addEventListener("deviceorientationabsolute", handleOrientation, true);
window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
  const needle = document.getElementById("needle");
  const degreeDisplay = document.getElementById("degree");
  const flag = document.getElementById("flag");

  let heading = event.alpha;

  if (typeof event.webkitCompassHeading !== "undefined") {
    heading = event.webkitCompassHeading;
  }

  if (heading !== null) {
    // Rotate needle
    needle.style.transform = `translateX(-50%) rotate(${-heading}deg)`;

    const direction = getDirectionText(heading);
    const roundedHeading = Math.round(heading);
    degreeDisplay.textContent = `${roundedHeading}° ${direction}`;

    // Trigger flag if 333° NW and held for 5 seconds
    if (roundedHeading === 333 && direction === "NW" && !flagShown) {
      if (!holdTimer) {
        holdTimer = setTimeout(() => {
          flag.classList.remove("hidden");
          flagShown = true;
        }, 5000);
      }
    } else {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }
}

function getDirectionText(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  const index = Math.round(deg / 45);
  return directions[index];
}
