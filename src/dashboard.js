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
  TOP_TOWER_REPAIR: false,
  BOTTOM_TOWER_REPAIR: true,
  TOWER_REPAIR_MIN_ENERGY: 400,
  TOWER_REPAIR_MIN_HITS: 150000,

  // ======== HARVESTERS ========
  // 2 energy pts per WORK part per tick
  HARVESTER_CURRENT_MODEL: MODELS.CARRIER_3,
  HARVESTER_TEAM_SIZE: 1,
  HARVESTER_SOURCE_INDEX: 1,

  // ======== MINERS ========
  MINER_CURRENT_MODEL: MODELS.WORKER_5A,
  MINER_TEAM_SIZE: 1,
  MINER_SOURCE_INDEX: 1,

  // ======== BUILDERS ========
  BUILDER_CURRENT_MODEL: MODELS.WORKER_5B,
  BUILDER_TEAM_SIZE: 3,
  BUILDER_SOURCE_INDEX: 0,
  BUILD_PRIORITY: "none",

  // ======== UPGRADERS ========
  UPGRADER_CURRENT_MODEL: MODELS.WORKER_5B,
  UPGRADER_TEAM_SIZE: 3,
  UPGRADER_SOURCE_INDEX: 0,
  UPGRADER_ENERGY_SOURCE: "source",

  // ======== REPAIRERS ========
  REPAIRER_SPAWN_DELAY: 1000,
  REPAIRER_CURRENT_MODEL: MODELS.WORKER_4A,
  REPAIRER_TEAM_SIZE: 2,
  REPAIRER_SOURCE_INDEX: 0,
  REPAIR_PRIORITY: "infrastructure",
  REPAIR_REGION_X_LOWER: 0,
  REPAIR_REGION_X_UPPER: 27,
  REPAIR_REGION_Y_LOWER: 9,
  REPAIR_REGION_Y_UPPER: 29,
  REPAIR_HITS_THRESHOLD_RATIO: 1 / 4,
};

module.exports = parameters;
