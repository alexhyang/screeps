const MODELS = require("./creepModels");

let roomName = "W35N43";
let room = Game.rooms[roomName];

let parameters = {
  // Room status
  ROOM: room,
  ENERGY_AVAILABLE: room.energyAvailable,
  ENERGY_CAPACITY_AVAILABLE: room.energyCapacityAvailable,
  SPAWN_WITHDRAW_THRESHOLD: 650,
  // HARVESTERS
  HARVESTER_CURRENT_MODEL: MODELS.HARVESTER_350_FAST,
  HARVESTER_TEAM_SIZE: 4,
  HARVESTER_SOURCE_INDEX: 0,
  // BUILDERS
  BUILDER_CURRENT_MODEL: MODELS.BUILDER_350_LARGE,
  BUILDER_TEAM_SIZE: 1,
  BUILDER_SOURCE_INDEX: 1,
  // UPGRADERS
  UPGRADER_TEAM_SIZE: 1,
  UPGRADER_CURRENT_MODEL: MODELS.UPGRADER_400,
  UPGRADER_ENERGY_SOURCE: "source",
  UPGRADER_SOURCE_INDEX: 0,
  // REPAIRERS
  REPAIRER_TEAM_SIZE: 2,
  REPAIRER_CURRENT_MODEL: MODELS.REPAIRER_400,
  REPAIRER_SOURCE_INDEX: 1,
  REPAIR_PRIORITY: "none",
  REPAIR_HITS_THRESHOLD_RATIO: 1 / 4,
};

module.exports = parameters;
