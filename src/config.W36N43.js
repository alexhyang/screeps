const models = require("./squad.creepModels");
const DEBUG_MODE = false;
const SOURCE = 0;

module.exports = {
  SPAWN_WITHDRAW_THRESHOLD: 1500,
  CONTAINER_WITHDRAW_THRESHOLD: 300,
  STORAGE_WITHDRAW_THRESHOLD: 500,

  spawn: {
    spawnNames: ["Spawn1"],
    debugMode: DEBUG_MODE,
    spawningDirections: [BOTTOM_LEFT, BOTTOM],
  },
  tower: {
    minTowerEnergyToRepair: 500,
    minDefenseHitsToRepair: 120000,
    maxFiringRange: 37,
  },
  harvester: {
    currentModel: models.CARRIER_6,
    teamSize: 1,
    sourceIndex: SOURCE,
    sourceOrigins: [
      // "droppedResources",
      "tombstone",
      "ruin",
      "container",
      "terminal",
      "storage",
      "source",
    ],
  },
  miner: {
    distanceToSource: 4, // distance = 4, adjustment = 50
    currentModel: models.WORKER_6A, // 6A is the most efficient miner model
    teamSize: 1,
    sourceIndex: SOURCE,
    sourceOrigins: ["source"],
  },
  extractor: {
    distanceToSource: 20,
    currentModel: models.WORKER_5B,
    teamSize: 1,
  },
  upgrader: {
    distanceToSource: 50,
    currentModel: models.WORKER_5B,
    teamSize: 1,
    sourceIndex: SOURCE,
    sourceOrigins: [
      "droppedResources",
      "tombstone",
      "ruin",
      "link",
      "storage",
      "container",
      // "extension",
      // "spawn",
      "source",
    ],
  },
  builder: {
    currentModel: models.WORKER_5C, // 5C
    teamSize: 1,
    sourceIndex: SOURCE,
    // comment out first three origins for heavy builder
    sourceOrigins: [
      "droppedResources",
      // "tombstone",
      // "ruin",
      // "storage",
      // "extension",
      "container",
      // "spawn",
      "source",
    ],
    buildingPriority: "none",
  },
  repairer: {
    spawnCycle: 1, // set to 1 for spawn with no delay
    currentModel: models.WORKER_5C,
    teamSize: 1,
    sourceIndex: SOURCE,
    sourceOrigins: [
      "droppedResources",
      "tombstone",
      "ruin",
      "storage",
      "container",
      // "extension",
      // "spawn",
      "source",
    ],
    repairingPriority: "infrastructure",
    repairingHitsRatio: 1 / 4,
  },
  transferrer: {
    currentModel: models.CARRIER_6,
    teamSize: 0,
  },
};
