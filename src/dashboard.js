const MODELS = require("./dashboard.models");
let roomNumber = "W35N43";
let energyCapacityAvailable = Game.rooms[roomNumber].energyCapacityAvailable;

let parameters = {
  // ======== Room status ========
  ROOM_NUMBER: roomNumber,

  // ======== RESOURCES ========
  SPAWN_WITHDRAW_THRESHOLD: energyCapacityAvailable * 1.1,
  CONTAINER_WITHDRAW_THRESHOLD: 200,

  // ======== SPAWN ========
  DEBUG_SPAWN: false,
  SPAWN_NAME: "Spawn1",
  SPAWNING_DIRECTIONS: [RIGHT, BOTTOM],
  CREEP_LIFE: 1500,

  // ======== TOWERS ========
  TOP_TOWER: "66716e678f3a3c5d329ef12c",
  BOTTOM_TOWER: "667034768b06595fba27f482",
  TOWER_REPAIR_MIN_ENERGY: 600,
  TOWER_REPAIR_MIN_HITS: 100000,
  // ======== HARVESTERS ========
  // 2 energy pts per WORK part per tick
  HARVESTER_CURRENT_MODEL: MODELS.CARRIER_3,
  HARVESTER_TEAM_SIZE: 1,
  HARVESTER_SOURCE_INDEX: 1,

  // ======== MINERS ========
  MINER_CURRENT_MODEL: MODELS.WORKER_5M2,
  MINER_TEAM_SIZE: 1,
  MINER_SOURCE_INDEX: 1,

  // ======== BUILDERS ========
  BUILDER_CURRENT_MODEL: MODELS.WORKER_2,
  BUILDER_TEAM_SIZE: 1,
  BUILDER_SOURCE_INDEX: 0,

  // ======== UPGRADERS ========
  UPGRADER_CURRENT_MODEL: MODELS.WORKER_5M3,
  UPGRADER_TEAM_SIZE: 3,
  UPGRADER_SOURCE_INDEX: 0,
  UPGRADER_ENERGY_SOURCE: "source",

  // ======== REPAIRERS ========
  REPAIRER_SPAWN_DELAY: 1000,
  REPAIRER_CURRENT_MODEL: MODELS.WORKER_1,
  REPAIRER_TEAM_SIZE: 1,
  REPAIRER_SOURCE_INDEX: 0,
  REPAIR_PRIORITY: "infrastructure",
  REPAIR_REGION_X_LOWER: 0,
  REPAIR_REGION_X_UPPER: 27,
  REPAIR_REGION_Y_LOWER: 9,
  REPAIR_REGION_Y_UPPER: 29,
  REPAIR_HITS_THRESHOLD_RATIO: 1 / 4,
};

module.exports = parameters;
