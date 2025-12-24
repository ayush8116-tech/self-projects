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
  drivers.forEach((driver) => {
    drawDriver(driver.position, map);
  });
};

const drawPassenger = ([x, y], map) => {
  map.reverse();
  map[y][x] = "👱‍♂️";
  map.reverse();
};

const showPassenger = (passengers, map) => {
  passengers.forEach((passenger) => {
    drawPassenger(passenger.position, map);
  });
};

const updateDriver = (location, driver) => {
  const [x, y] = [location[0], location[1]];
  driver.position[0] = x;
  driver.position[1] = y;
};

const moveDriver = (driverId, drivers, map) => {
  const destination = drivers[driverId].destination;
  const origin = drivers[driverId].position;

  const path = findRouteToDestination(origin, destination);
  let nextPosition = path.next();
  let lastPosition = origin;

  const move = setInterval(() => {
    if (nextPosition.done) {
      return clearInterval(move);
    }

    console.clear();
    console.log(putScreen(map));
    clearScreen(lastPosition, map);
    updateDriver(nextPosition.value, drivers[driverId])
    drawDriver(drivers[driverId].position, map);
    lastPosition = [...nextPosition.value];
    nextPosition = path.next();
  }, 500);
};

const assignDriver = (passengers, drivers, map) => {
  passengers.forEach((passenger) => {
    let assignedDriverId = 0;
    if (!passenger.isAssigned) {
      const freeDrivers = drivers.filter((driver) => (!driver.isAssigned));
      const assignedDriver = findClosest(passenger.position, freeDrivers);
      assignedDriverId = assignedDriver.id;

      drivers[assignedDriverId].destination = passenger.position;
      drivers[assignedDriverId].isAssigned = true;
      passenger.driver = assignedDriverId;
    }

    moveDriver(assignedDriverId, drivers, map);
  });
};

const randomBetween = (start, end) => {
  return Math.floor((Math.random() * ((end + 1) - start)) + start);
};

const generateRandomPosition = (map) => {
  const x = randomBetween(0, map[0]);
  const y = randomBetween(0, map[1]);
  return [x, y];
};

const createDriver = (driverCount, screen) => {
  const drivers = Array.from({ length: driverCount }).map((_, index) => {
    const detail = {
      id: index,
      position: generateRandomPosition(screen),
      destination: generateRandomPosition(screen),
      isAssigned: false,
    };
    return detail;
  });
  return drivers;
};

const createCustomers = (customerCount, screen) => {
  const customers = Array.from({ length: customerCount }).map((_) => {
    const detail = {
      position: generateRandomPosition(screen),
      driver: null,
      isAssigned: false,
    };
    return detail;
  });

  return customers;
};

const main = (screen) => {
  const map = drawScreen(screen);
  const passengers = createCustomers(3, screen);
  const drivers = createDriver(5, screen);
  showPassenger(passengers, map);
  showDrivers(drivers, map);
  assignDriver(passengers, drivers, map);
  console.log(putScreen(map));
};

console.clear();
main([20, 20]);
