const models = require("./squad.creepModels");
const DEBUG_MODE = false;
const LEFT_SOURCE = 0;
const RIGHT_SOURCE = 1;

module.exports = {
  SPAWN_WITHDRAW_THRESHOLD: 1500,
  CONTAINER_WITHDRAW_THRESHOLD: 500,
  STORAGE_WITHDRAW_THRESHOLD: 10000,
  spawn: {
    spawnNames: ["Spawn4"],
    debugMode: DEBUG_MODE,
    spawningDirections: [TOP_LEFT, LEFT, BOTTOM_LEFT, BOTTOM],
  },
  tower: {
    minTowerEnergyToRepair: 500,
    minDefenseHitsToRepair: 650000,
    maxFiringRange: 30,
  },
  harvester: {
    currentModel: models.CARRIER_10,
    teamSize: 1,
    sourceIndex: RIGHT_SOURCE,
    sourceOrigins: [
      // "droppedResources",
      "tombstone",
      "ruin",
      "container",
      "storage",
      "source",
    ],
  },
  miner: {
    distanceToSource: 5, // distance to source = 5
    currentModel: models.WORKER_6A, // 6A is the most efficient miner model
    teamSize: 1,
    sourceIndex: RIGHT_SOURCE,
    sourceOrigins: ["source"],
  },
  extractor: {
    distanceToSource: 20,
    currentModel: models.WORKER_5B,
    teamSize: 2,
  },
  upgrader: {
    distanceToSource: 25, // distance to source = 5
    currentModel: models.WORKER_6B,
    teamSize: 3,
    sourceIndex: LEFT_SOURCE,
    sourceOrigins: [
      // "storage",
      // "container",
      "source",
    ],
  },
  builder: {
    currentModel: models.WORKER_5C, // 2B(212), 4B(413), 5C(534)
    teamSize: 2,
    sourceIndex: RIGHT_SOURCE,
    // comment out first three origins for heavy builder
    sourceOrigins: [
      // "droppedResources",
      // "tombstone",
      "ruin",
      "container",
      "storage",
      // "extension",
      // "spawn",
      "source",
    ],
    buildingPriority: "none",
  },
  repairer: {
    spawnCycle: 1, // set to 1 for spawn with no delay
    currentModel: models.WORKER_5C,
    teamSize: 1,
    sourceIndex: RIGHT_SOURCE,
    sourceOrigins: [
      // "droppedResources",
      // "tombstone",
      "ruin",
      // "container",
      "storage",
      // "extension",
      // "spawn",
      // "wall",
      // "source",
    ],
    repairingPriority: "infrastructure",
    repairingHitsRatio: 0.8,
  },
  transferrer: {
    currentModel: models.CARRIER_10,
    teamSize: 0,
  },
};
