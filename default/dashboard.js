let roomName = "W35N43";
let room = Game.rooms[roomName];

let parameters = {
  // Room status
  ROOM: room,
  ENERGY_AVAILABLE: room.energyAvailable,
  ENERGY_CAPACITY_AVAILABLE: room.energyCapacityAvailable,
  SPAWN_WITHDRAW_THRESHOLD: 650,
  // HARVESTERS
  HARVESTER_TEAM_SIZE: 2,
  HARVESTER_SOURCE_INDEX: 1,
  // BUILDERS
  BUILDER_TEAM_SIZE: 1,
  BUILDER_SOURCE_INDEX: 1,
  // UPGRADERS
  UPGRADER_TEAM_SIZE: 2,
  UPGRADER_ENERGY_SOURCE: "source",
  UPGRADER_SOURCE_INDEX: 0,
  // REPAIRERS
  REPAIRER_TEAM_SIZE: 2,
  REPAIRER_ENERGY_SOURCE: "spawn",
  REPAIRER_SOURCE_INDEX: 0,
  REPAIR_PRIORITY: "buildings",
  REPAIR_HITS_THRESHOLD_RATIO: 1 / 4,
};

module.exports = parameters;
