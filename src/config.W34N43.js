const models = require("./squad.creepModels");
const DEBUG_MODE = false;
const RIGHT_SOURCE = 0;
const BOTTOM_SOURCE = 1;

module.exports = {
  SPAWN_WITHDRAW_THRESHOLD: 1500,
  CONTAINER_WITHDRAW_THRESHOLD: 500,
  STORAGE_WITHDRAW_THRESHOLD: 500,

  spawn: {
    spawnNames: ["Spawn3"],
    debugMode: DEBUG_MODE,
    spawningDirections: [RIGHT, BOTTOM],
  },
  tower: {
    minTowerEnergyToRepair: 500,
    minDefenseHitsToRepair: 300000,
    maxFiringRange: 37,
  },
  harvester: {
    currentModel: models.CARRIER_10,
    teamSize: 1,
    sourceIndex: BOTTOM_SOURCE,
    sourceOrigins: [
      "droppedResources",
      "tombstone",
      "ruin",
      "container",
      "storage",
      "source",
    ],
  },
  miner: {
    distanceToSource: 14,
    currentModel: models.WORKER_3, // 6A is the most efficient miner model
    teamSize: 2,
    sourceIndex: BOTTOM_SOURCE,
    sourceOrigins: ["source"],
  },
  extractor: {
    distanceToSource: 20,
    currentModel: models.WORKER_10A,
    teamSize: 2,
  },
  upgrader: {
    distanceToSource: 20,
    currentModel: models.WORKER_5C,
    teamSize: 5,
    sourceIndex: RIGHT_SOURCE,
    sourceOrigins: [
      // "droppedResources",
      // "tombstone",
      // "ruin",
      // "link",
      // "storage",
      // "container",
      // "extension",
      // "spawn",
      "source",
    ],
  },
  builder: {
    currentModel: models.WORKER_5C, // 5C
    teamSize: 1,
    sourceIndex: RIGHT_SOURCE,
    // comment out first three origins for heavy builder
    sourceOrigins: [
      "droppedResources",
      "tombstone",
      // "ruin",
      "storage",
      // "extension",
      "container",
      // "spawn",
      "source",
    ],
    buildingPriority: "none",
  },
  repairer: {
    spawnCycle: 200, // set to 1 for spawn with no delay
    currentModel: models.WORKER_5C,
    teamSize: 1,
    sourceIndex: RIGHT_SOURCE,
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
    currentModel: models.CARRIER_10,
    teamSize: 0,
  },
};
