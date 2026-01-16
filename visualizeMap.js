import { findClosest, findRouteToDestination } from "./uber.js";

const drawScreen = ([x, y]) => {
  return Array.from(
    { length: x + 1 },
    () =>
      Array.from({ length: y + 1 }, () => ({ block: "⬜️", isClear: false })),
  );
};

const clearScreen = (map) => {
  console.clear();

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      map[row][col] = "⬜️";
    }
  }
};

const putScreen = (screen) => {
  const screenBlock = screen.map((row) => row.map(({ block }) => block));

  return console.log(screenBlock.map((row) => row.join("")).join("\n"));
};

const drawObject = ([x, y], object, map) => {
  map.reverse();
  map[y][x]["block"] = object;
  map.reverse();
};

const showDrivers = (drivers, map) => {
  drivers.forEach((driver) => {
    drawObject(driver.position, "🚖", map);
  });
};

const showPassenger = (passengers, map) => {
  passengers.forEach((passenger) => {
    drawObject(passenger.position, "👱‍♂️", map);
  });
};

const updateDriver = (location, driver) => {
  const [x, y] = [location[0], location[1]];
  driver.position[0] = x;
  driver.position[1] = y;
};

const createRoad = (locations, screen) => {
  locations.forEach(([x, y]) => {
    screen[y][x]["block"] = "⬛️";
    screen[y][x]["isClear"] = true;
  });
};

const displayCharacters = (passengers, drivers, map) => {
  showPassenger(passengers, map);
  showDrivers(drivers, map);
};

const animateDriver = (nextPosition, driverId, drivers, passengers, map) => {
  clearScreen(map);
  updateDriver(nextPosition.value, drivers[driverId]);
  displayCharacters(passengers, drivers, map);
  putScreen(map);
};

const moveDriver = (driverId, drivers, passengers, map) => {
  const destination = drivers[driverId].destination;
  const origin = drivers[driverId].position;

  const path = findRouteToDestination(origin, destination);
  let nextPosition = path.next();
  const move = setInterval(() => {
    if (nextPosition.done) {
      return clearInterval(move);
    }

    animateDriver(nextPosition, driverId, drivers, passengers, map);
    nextPosition = path.next();
  }, 500);
};

const assignDriver = (passengers, drivers, map) => {
  passengers.forEach((passenger) => {
    let assignedDriverId = 0;
    const freeDrivers = drivers.filter((driver) => (!driver.isAssigned));
    const assignedDriver = findClosest(passenger.position, freeDrivers);
    assignedDriverId = assignedDriver.id;

    drivers[assignedDriverId].destination = passenger.position;
    drivers[assignedDriverId].isAssigned = true;
    passenger.driver = assignedDriverId;

    moveDriver(assignedDriverId, drivers, passengers, map);
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
  let index = 0
  const drivers = Array.from({ length: driverCount }, () => ({
    id: index++,
    position: generateRandomPosition(screen),
    destination: generateRandomPosition(screen),
    isAssigned: false,
  }))

  return drivers
};

const createCustomers = (customerCount, screen) => {
  const customers = Array.from({ length: customerCount }, () => ({
    position: generateRandomPosition(screen),
    driver: null,
    isAssigned: false,
  }));

  return customers;
};

const main = (screen) => {
  const map = drawScreen(screen);
  // console.log(map);

  const passengers = createCustomers(1, screen);
  const drivers = createDriver(5, screen);
  const road = createRoad([[10, 10], [10, 11], [10, 12], [10, 13]], map);

  showPassenger(passengers, map);

  showDrivers(drivers, map);
  // assignDriver(passengers, drivers, map);
  // console.log(map);
  console.log(putScreen(map));
  return map
};

console.clear();
main([20, 20]);
