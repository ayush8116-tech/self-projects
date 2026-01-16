import {
  findClosest,
  findRandomDestination,
  findRouteToDestination,
} from "./uber.js";
import * as delayed from "jsr:@jotsr/delayed";

const drawScreen = ([x, y]) => {
  return Array.from(
    { length: x + 1 },
    () => Array.from({ length: y + 1 }, () => "⬜️"),
  );
};

const clearScreen = ([x, y], map) => {
  map.reverse();
  map[y][x] = "⬜️";
  map.reverse();
};

const putScreen = (screen) => {
  return screen.map((row) => row.join("")).join("\n");
};

const drawDriver = ([x, y], map) => {
  map.reverse();
  map[y][x] = "🚖";
  map.reverse();
};

const showDrivers = (drivers, map) => {
  drivers.forEach(([x, y]) => {
    drawDriver([x, y], map);
  });
};

const showPassenger = ([x, y], map) => {
  map.reverse();
  map[y][x] = "👱‍♂️";
  map.reverse();
};

const delay = (ms) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
};

const moveDriver = (
  [dx, dy],
  closestDriverId,
  drivers,
  [px, py],
  map,
  screen,
) => {
  let destination = [px, py];
  // console.log(drivers[closestDriverId].isAssigned)
  if (!drivers[closestDriverId].isAssigned) {
    destination = findRandomDestination(screen);
  }

  const path = findRouteToDestination([dx, dy], destination);
  let nextPosition = path.next();
  let lastPosition = [dx, dy];
  const move = setInterval(() => {
    if (nextPosition.done) {
      return clearInterval(move);
    }

    console.clear();
    console.log(`%c${putScreen(map)}`, "background-color: black");
    drawDriver(nextPosition.value, map);
    clearScreen(lastPosition, map);
    lastPosition = [...nextPosition.value];
    nextPosition = path.next();
    console.log({ nextPosition, lastPosition });
  }, 100);
};

const multipleDrivers = (driverLocations, drivers, passenger, map, screen) => {
  const { closestDriverId, closestDriverLocation } = findClosest(
    passenger,
    driverLocations,
    drivers,
  );
  // console.log(closestDriverId)
  moveDriver(
    closestDriverLocation,
    closestDriverId,
    drivers,
    passenger,
    map,
    screen,
  );
  moveDriver(drivers[0].position, 0, drivers, passenger, map, screen);
  // moveDriver(drivers[1].position, 1, drivers, passenger, map, screen);
  // moveDriver(drivers[2].position, 2, drivers, passenger, map, screen);
};

const drivers = [
  { "position": [1, 0], "isAssigned": false },
  { "position": [20, 20], "isAssigned": false },
  { "position": [3, 2], "isAssigned": false },
  { "position": [11, 1], "isAssigned": false },
];

const main = (drivers, screen) => {
  const map = drawScreen(screen);
  const passengerLocation = [10, 20];
  const driversPositions = drivers.map((driver) => driver.position);
  showPassenger(passengerLocation, map);
  showDrivers(driversPositions, map);
  multipleDrivers(driversPositions, drivers, passengerLocation, map, screen);
  console.log(map[20][1]);
};

console.clear();
main(drivers, [20, 20]);
