const MODELS = require("./dashboard.models");
let roomNumber = "W35N43";
let energyCapacityAvailable = Game.rooms[roomNumber].energyCapacityAvailable;

let parameters = {
  // ======== Room status ========
  ROOM_NUMBER: roomNumber,
  SPAWN_WITHDRAW_THRESHOLD: energyCapacityAvailable * 1.1,
  CONTAINER_WITHDRAW_THRESHOLD: 800,
  TOP_TOWER: "666fab3114aef66f9cff9d7a",
  RIGHT_TOWER: "666ae566e679a17f17d4a1aa",
  // ======== HARVESTERS ========
  // 2 energy pts per WORK part per tick
  HARVESTER_CURRENT_MODEL: MODELS.HARVESTER_550,
  HARVESTER_TEAM_SIZE: 2,
  HARVESTER_SOURCE_INDEX: 1,
  // ======== MINERS ========
  MINER_CURRENT_MODEL: MODELS.MINER_600,
  MINER_TEAM_SIZE: 0,
  MINER_SOURCE_INDEX: 0,
  // ======== BUILDERS ========
  BUILDER_CURRENT_MODEL: MODELS.BUILDER_350_LARGE,
  BUILDER_TEAM_SIZE: 1,
  BUILDER_SOURCE_INDEX: 0,
  // ======== UPGRADERS ========
  UPGRADER_CURRENT_MODEL: MODELS.UPGRADER_600,
  UPGRADER_TEAM_SIZE: 2,
  UPGRADER_SOURCE_INDEX: 0,
  UPGRADER_ENERGY_SOURCE: "source",
  // ======== REPAIRERS ========
  REPAIRER_CURRENT_MODEL: MODELS.REPAIRER_400,
  REPAIRER_TEAM_SIZE: 3,
  REPAIRER_SOURCE_INDEX: 0,
  REPAIR_PRIORITY: "container",
  REPAIR_REGION_X_LOWER: 0,
  REPAIR_REGION_X_UPPER: 27,
  REPAIR_REGION_Y_LOWER: 9,
  REPAIR_REGION_Y_UPPER: 24,
  REPAIR_HITS_THRESHOLD_RATIO: 1 / 4,
};

module.exports = parameters;
