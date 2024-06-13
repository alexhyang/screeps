/**
 * This is a team recruiter of the room.
 *
 * Creep spawn costs (BODYPART_COST)
 *   work: 100, carry: 50, move: 50,
 *   attack: 80, ranged_attack: 150, heal: 250
 *   claim: 600, tough: 10
 *
 */

let MODELS = {
  HARVESTER_200: {
    name: "H200",
    role: "harvester",
    body: [WORK, CARRY, MOVE],
  },
  HARVESTER_300: {
    name: "H300",
    role: "harvester",
    body: [WORK, WORK, CARRY, MOVE],
  },
  HARVESTER_350: {
    name: "H300",
    role: "harvester",
    body: [WORK, WORK, CARRY, CARRY, MOVE],
  },
  HARVESTER_450: {
    name: "H450",
    role: "harvester",
    body: [WORK, WORK, WORK, CARRY, CARRY, MOVE],
  },
  BUILDER_200: {
    name: "B200",
    role: "builder",
    body: [WORK, CARRY, MOVE],
  },
  BUILDER_250_FAST: {
    name: "B250F",
    role: "builder",
    body: [WORK, CARRY, MOVE, MOVE],
  },
  BUILDER_250_LARGE: {
    name: "B250L",
    role: "builder",
    body: [WORK, CARRY, CARRY, MOVE],
  },
  BUILDER_350_LARGE: {
    name: "B350L",
    role: "builder",
    body: [WORK, WORK, CARRY, CARRY, MOVE],
  },
  BUILDER_400_LARGE: {
    name: "B400L",
    role: "builder",
    body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
  },
  UPGRADER_200: {
    name: "U200",
    role: "upgrader",
    body: [WORK, CARRY, MOVE],
  },
  UPGRADER_400: {
    name: "U400",
    role: "upgrader",
    body: [WORK, WORK, WORK, CARRY, MOVE],
  },
  UPGRADER_500: {
    name: "U500",
    role: "upgrader",
    body: [WORK, WORK, WORK, WORK, CARRY, MOVE],
  },
};

module.exports = MODELS;
