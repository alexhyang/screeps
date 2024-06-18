/**
 * This is a team recruiter of the room.
 *
 * Creep spawn costs (BODYPART_COST)
 *   work: 100, carry: 50, move: 50,
 *   attack: 80, ranged_attack: 150, heal: 250
 *   claim: 600, tough: 10
 *
 * Role characteristics:
 *   Harvesters: WORK, CARRY, MOVE
 *   Upgraders:  WORK, CARRY, MOVE
 *   Builders:   WORK, MOVE, CARRY
 *   Repairers:  WORK, MOVE, CARRY
 */

let MODELS = {
  // ======== HARVESTERS ========
  HARVESTER_200: {
    name: "H2",
    role: "harvester",
    body: [WORK, CARRY, MOVE],
  },
  HARVESTER_250: {
    name: "H25",
    role: "harvester",
    body: [WORK, CARRY, CARRY, MOVE],
  },
  HARVESTER_300: {
    name: "H3",
    role: "harvester",
    body: Array(0)
      .fill(WORK)
      .concat(Array(2).fill(CARRY))
      .concat(Array(4).fill(MOVE)),
  },
  HARVESTER_350_FAST: {
    name: "H35F",
    role: "harvester",
    body: [WORK, WORK, CARRY, MOVE, MOVE],
  },
  HARVESTER_350_LARGE: {
    name: "H35L",
    role: "harvester",
    body: [WORK, WORK, CARRY, CARRY, MOVE],
  },
  HARVESTER_400: {
    name: "H4",
    role: "harvester",
    body: Array(1)
      .fill(WORK)
      .concat(Array(2).fill(CARRY))
      .concat(Array(4).fill(MOVE)),
  },
  HARVESTER_400_FAST: {
    name: "H4F",
    role: "harvester",
    body: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
  },
  HARVESTER_400_CARRY: {
    name: "H4C",
    role: "harvester",
    body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  },
  HARVESTER_450: {
    name: "H45",
    role: "harvester",
    body: [WORK, WORK, WORK, CARRY, MOVE, MOVE],
  },
  HARVESTER_500: {
    name: "H5",
    role: "harvester",
    body: [WORK, WORK, WORK, WORK, CARRY, MOVE],
  },
  HARVESTER_550: {
    name: "H55",
    role: "harvester",
    body: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
  },
  // ======== MINERS ========
  MINER_200: {
    name: "M2",
    role: "miner",
    body: [WORK, CARRY, MOVE],
  },
  MINER_300: {
    name: "M3",
    role: "miner",
    body: Array(2).fill(WORK).concat([CARRY, MOVE]),
  },
  MINER_400: {
    name: "M4",
    role: "miner",
    body: Array(3).fill(WORK).concat([CARRY, MOVE]),
  },
  MINER_500: {
    name: "M5",
    role: "miner",
    body: Array(4).fill(WORK).concat([CARRY, MOVE]),
  },
  MINER_600: {
    name: "M6",
    role: "miner",
    body: Array(5).fill(WORK).concat([CARRY, MOVE]),
  },
  MINER_700: {
    name: "M7",
    role: "miner",
    body: Array(6).fill(WORK).concat([CARRY, MOVE]),
  },
  MINER_1150: {
    name: "M115",
    role: "miner",
    body: Array(10).fill(WORK).concat([CARRY, MOVE, MOVE]),
  },
  // ======== BUILDERS ========
  BUILDER_200: {
    name: "B2",
    role: "builder",
    body: [WORK, CARRY, MOVE],
  },
  BUILDER_250_FAST: {
    name: "B25F",
    role: "builder",
    body: [WORK, CARRY, MOVE, MOVE],
  },
  BUILDER_250_LARGE: {
    name: "B25L",
    role: "builder",
    body: [WORK, CARRY, CARRY, MOVE],
  },
  BUILDER_350_FAST: {
    name: "B35F",
    role: "builder",
    body: [WORK, WORK, CARRY, MOVE, MOVE],
  },
  BUILDER_350_LARGE: {
    name: "B35L",
    role: "builder",
    body: [WORK, WORK, CARRY, CARRY, MOVE],
  },
  BUILDER_400: {
    name: "B4",
    role: "builder",
    body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
  },
  // ======== UPGRADERS ========
  UPGRADER_200: {
    name: "U2",
    role: "upgrader",
    body: [WORK, CARRY, MOVE],
  },
  UPGRADER_400: {
    name: "U4",
    role: "upgrader",
    body: [WORK, WORK, WORK, CARRY, MOVE],
  },
  UPGRADER_500: {
    name: "U5",
    role: "upgrader",
    body: [WORK, WORK, WORK, WORK, CARRY, MOVE],
  },
  UPGRADER_600: {
    name: "U6",
    role: "upgrader",
    body: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
  },
  UPGRADER_700: {
    name: "U7",
    role: "upgrader",
    body: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
  },
  UPGRADER_1150: {
    name: "U115",
    role: "upgrader",
    body: Array(10).fill(WORK).concat([CARRY, MOVE, MOVE]),
  },
  // ======== REPAIRERS ========
  REPAIRER_250: {
    name: "R25",
    role: "repairer",
    body: [WORK, CARRY, CARRY, MOVE],
  },
  REPAIRER_400: {
    name: "R4",
    role: "repairer",
    body: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
  },
  REPAIRER_400: {
    name: "R4",
    role: "repairer",
    body: Array(3)
      .fill(WORK)
      .concat(Array(1).fill(CARRY))
      .concat(Array(4).fill(MOVE)),
  },
  REPAIRER_500: {
    name: "R5",
    role: "repairer",
    body: Array(3)
      .fill(WORK)
      .concat(Array(2).fill(CARRY))
      .concat(Array(5).fill(MOVE)),
  },
  REPAIRER_650: {
    name: "R65",
    role: "repairer",
    body: Array(4)
      .fill(WORK)
      .concat(Array(2).fill(CARRY))
      .concat(Array(6).fill(MOVE)),
  },
};

module.exports = MODELS;
