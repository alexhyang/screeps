const MODELS = require("./dashboard.models");
let roomNumber = "W35N43";
let energyCapacityAvailable = Game.rooms[roomNumber].energyCapacityAvailable;

let parameters = {
  // ======== Room status ========
  ROOM_NUMBER: roomNumber,
  PAUSE_SPAWN: true,
  SPAWN_WITHDRAW_THRESHOLD: energyCapacityAvailable * 1.1,
  CONTAINER_WITHDRAW_THRESHOLD: 200,
  TOP_TOWER: "666fab3114aef66f9cff9d7a",
  BOTTOM_TOWER: "667034768b06595fba27f482",
  // ======== HARVESTERS ========
  // 2 energy pts per WORK part per tick
  HARVESTER_CURRENT_MODEL: MODELS.HARVESTER_250,
  HARVESTER_TEAM_SIZE: 1,
  HARVESTER_SOURCE_INDEX: 1,
  // ======== MINERS ========
  MINER_CURRENT_MODEL: MODELS.MINER_600,
  MINER_TEAM_SIZE: 1,
  MINER_SOURCE_INDEX: 1,
  // ======== BUILDERS ========
  BUILDER_CURRENT_MODEL: MODELS.BUILDER_400,
  BUILDER_TEAM_SIZE: 1,
  BUILDER_SOURCE_INDEX: 0,
  // ======== UPGRADERS ========
  UPGRADER_CURRENT_MODEL: MODELS.UPGRADER_600,
  UPGRADER_TEAM_SIZE: 2,
  UPGRADER_SOURCE_INDEX: 0,
  UPGRADER_ENERGY_SOURCE: "source",
  // ======== REPAIRERS ========
  REPAIRER_CURRENT_MODEL: MODELS.REPAIRER_650,
  REPAIRER_TEAM_SIZE: 3,
  REPAIRER_SOURCE_INDEX: 0,
  REPAIR_PRIORITY: "none",
  REPAIR_REGION_X_LOWER: 0,
  REPAIR_REGION_X_UPPER: 27,
  REPAIR_REGION_Y_LOWER: 9,
  REPAIR_REGION_Y_UPPER: 24,
  REPAIR_HITS_THRESHOLD_RATIO: 1 / 4,
};

module.exports = parameters;
