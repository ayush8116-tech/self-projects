import {
  findClosest,
  findDistance,
  findRouteToDestination,
  main,
} from "./uber.js";
import { assertEquals } from "@std/assert";

Deno.test("simple test", () => {
  assertEquals(main(), 0);
});

Deno.test("distance bw two drivers", () => {
  assertEquals(findDistance([3, 0], [6, 0]), 3);
});

Deno.test.only("find closest driver", () => {
  assertEquals(
    findClosest([0, 0], {
      1: { "char": "🚖", "currentPosition": [10, 10] },
      2: { "char": "🚔", "currentPosition": [4, 2] },
    }),
    2,
  );
});

Deno.test("find closest driver", () => {
  assertEquals(findClosest([3, 0], [[8, 0], [5, 3], [1, 4]]), [5, 3]);
});

Deno.test("find closest driver", () => {
  assertEquals(findClosest([3, 0], [[8, 0], [5, 3], [1, 4], [1, 1]]), [1, 1]);
});

Deno.test("find route", () => {
  assertEquals(findRouteToDestination([6, 0], [3, 0]), [[5, 0], [4, 0], [
    3,
    0,
  ]]);
});
Deno.test("find route", () => {
  assertEquals(findRouteToDestination([6, 0], [9, 0]), [[7, 0], [8, 0], [
    9,
    0,
  ]]);
});
