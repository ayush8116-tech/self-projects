// const isDestClear = ([x, y], screen) => {
//   return (x <= screen[0] && x >= 0) && (y <= screen[1] && y >= 0)
// }

const generateRandom = ([xMax, yMax]) => {
  const x = Math.floor(Math.random() * 1000) % (xMax + 1);
  const y = Math.floor(Math.random() * 1000) % (yMax + 1);
  return [x, y];
};

export const findRandomDestination = (screen) => {
  const randomCoordinate = generateRandom(screen);
  return randomCoordinate;
};

export const performOperationOnX = ([x, y], i, diff) => {
  if (diff > 0) {
    return [x - (i + 1), y];
  }
  if (diff < 0) {
    return [x + (i + 1), y];
  }
};

export const performOperationOnY = ([x, y], j, diff) => {
  if (diff > 0) {
    return [x, y - (j + 1)];
  }
  if (diff < 0) {
    return [x, y + (j + 1)];
  }
};

export function* findRouteToDestination([dx, dy], [px, py]) {
  const xDiff = dx - px;
  const yDiff = dy - py;

  let i = 0;
  while (i < Math.abs(xDiff)) {
    yield performOperationOnX([dx, dy], i, xDiff);
    i++;
  }

  let j = 0;
  while (j < Math.abs(yDiff)) {
    yield performOperationOnY([px, dy], j, yDiff);
    j++;
  }
}

export const findDistance = (p, d) => {
  const [px, py] = p;
  const [dx, dy] = d;

  const distance = Math.sqrt(Math.pow(px - dx, 2) + Math.pow(py - dy, 2));
  return distance;
};

export const findClosest = (passenger, drivers) => {
  
  const driverToAssign = drivers.reduce((closestDriver, driver) => {
    const closestDistance = findDistance(passenger, closestDriver.position);
    const distanceBetween = findDistance(passenger, driver.position)

    return closestDistance > distanceBetween ? driver : closestDriver;
  })

  return {id : driverToAssign.id, bookingId : driverToAssign.bookingId}
};

export const main = () => {
  const passengerPosition = [3, 0];
  const driver1Position = [6, 0];
  const driver2Position = [5, 3];

  const availableDriver = findClosest(passengerPosition, [
    driver1Position,
    driver2Position,
  ]);

  return 0;
};
