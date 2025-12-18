

export const performOperationOnX = ([x, y], i, diff) => {
  if(diff > 0) {
    return [x - (i + 1), y]
  }  
  if(diff < 0) {
    return [x + (i + 1), y]
  }
}

export const performOperationOnY = ([x, y], j, diff) => {
  if(diff > 0) {
    return [x, y - (j + 1)]
  }  
  if(diff < 0) {
    return [x, y + (j + 1)]
  }
}

export function* findRoute([dx, dy], [px, py]) {
  const xDiff = dx - px;
  const yDiff = dy - py
  let i = 0
  while(i < Math.abs(xDiff)) {
    yield performOperationOnX([dx, dy], i, xDiff);
    i++
  }
  
  let j = 0;
  while(j < Math.abs(yDiff)) {
    yield performOperationOnY([px, dy], j, yDiff)
    j++
  }
}

export const findDistance = (p, d) => {
  const [px, py] = p;
  const [dx, dy] = d;
  
  const distance = Math.sqrt(Math.pow(px - dx, 2) + Math.pow(py - dy, 2));
  return distance;
}

const drivers = { 1: { char: "🚖", currentPosition: [10, 10] }, 2 : {char: "🚔", currentPosition: [4, 2]} };

export const findClosest = (passenger, drivers) => {

  const allDistance = drivers.map(driver => findDistance(passenger, driver));
  const closestDriver = drivers.at(allDistance.indexOf(Math.min(...allDistance)));

  return closestDriver;
}

export const main = () => {
  const passengerPosition = [3, 0]
  const driver1Position = [6, 0];
  const driver2Position = [5, 3];

  const availableDriver = findClosest(passengerPosition, [driver1Position, driver2Position])
  return 0;
}