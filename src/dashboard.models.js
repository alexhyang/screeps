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
    name: "H200",
    role: "harvester",
    body: [WORK, CARRY, MOVE],
  },
  HARVESTER_250: {
    name: "H250",
    role: "harvester",
    body: [WORK, CARRY, CARRY, MOVE],
  },
  HARVESTER_300: {
    name: "H300",
    role: "harvester",
    body: [WORK, WORK, CARRY, MOVE],
  },
  HARVESTER_350_FAST: {
    name: "H350F",
    role: "harvester",
    body: [WORK, WORK, CARRY, MOVE, MOVE],
  },
  HARVESTER_350_LARGE: {
    name: "H350L",
    role: "harvester",
    body: [WORK, WORK, CARRY, CARRY, MOVE],
  },
  HARVESTER_400_FAST: {
    name: "H400F",
    role: "harvester",
    body: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
  },
  HARVESTER_400_CARRY: {
    name: "H400C",
    role: "harvester",
    body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  },
  HARVESTER_450: {
    name: "H450",
    role: "harvester",
    body: [WORK, WORK, WORK, CARRY, MOVE, MOVE],
  },
  HARVESTER_500: {
    name: "H500",
    role: "harvester",
    body: [WORK, WORK, WORK, WORK, CARRY, MOVE],
  },
  HARVESTER_550: {
    name: "H550",
    role: "harvester",
    body: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
  },
  // ======== MINERS ========
  MINER_200: {
    name: "M200",
    role: "miner",
    body: [WORK, CARRY, MOVE],
  },
  MINER_300: {
    name: "M300",
    role: "miner",
    body: Array(2).fill(WORK).concat([CARRY, MOVE]),
  },
  MINER_400: {
    name: "M400",
    role: "miner",
    body: Array(3).fill(WORK).concat([CARRY, MOVE]),
  },
  MINER_500: {
    name: "M500",
    role: "miner",
    body: Array(4).fill(WORK).concat([CARRY, MOVE]),
  },
  MINER_600: {
    name: "M600",
    role: "miner",
    body: Array(5).fill(WORK).concat([CARRY, MOVE]),
  },
  MINER_700: {
    name: "M700",
    role: "miner",
    body: Array(6).fill(WORK).concat([CARRY, MOVE]),
  },
  MINER_1150: {
    name: "M1150",
    role: "miner",
    body: Array(10).fill(WORK).concat([CARRY, MOVE, MOVE]),
  },
  // ======== BUILDERS ========
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
  BUILDER_350_FAST: {
    name: "B350F",
    role: "builder",
    body: [WORK, WORK, CARRY, MOVE, MOVE],
  },
  BUILDER_350_LARGE: {
    name: "B350L",
    role: "builder",
    body: [WORK, WORK, CARRY, CARRY, MOVE],
  },
  BUILDER_400_FAST: {
    name: "B400F",
    role: "builder",
    body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
  },
  BUILDER_400_LARGE: {
    name: "B400L",
    role: "builder",
    body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
  },
  // ======== UPGRADERS ========
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
  UPGRADER_600: {
    name: "U600",
    role: "upgrader",
    body: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
  },
  // ======== REPAIRERS ========
  REPAIRER_250: {
    name: "R250",
    role: "repairer",
    body: [WORK, CARRY, MOVE, MOVE],
  },
  REPAIRER_400: {
    name: "R400",
    role: "repairer",
    body: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
  },
  REPAIRER_400: {
    name: "R400",
    role: "repairer",
    body: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE],
  },
};

module.exports = MODELS;
