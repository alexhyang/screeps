const models = require("./squad.creepModels");
const DEBUG_MODE = false;
const LEFT_SOURCE = 1;
const RIGHT_SOURCE = 0;

module.exports = {
  SPAWN_WITHDRAW_THRESHOLD: 1500,
  CONTAINER_WITHDRAW_THRESHOLD: 300,
  STORAGE_WITHDRAW_THRESHOLD: 200,
  spawn: {
    spawnNames: ["Spawn2", "Spawn5"],
    debugMode: DEBUG_MODE,
    spawningDirections: [TOP, BOTTOM],
  },
  tower: {
    minTowerEnergyToRepair: 500,
    minDefenseHitsToRepair: 1700000,
    maxFiringRange: 26,
  },
  harvester: {
    currentModel: models.CARRIER_6,
    teamSize: 1,
    sourceIndex: RIGHT_SOURCE,
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
    distanceToSource: 10, // distance to source = 5
    currentModel: models.WORKER_6A, // 6A is the most efficient miner model
    teamSize: 1,
    sourceIndex: LEFT_SOURCE,
    sourceOrigins: ["source"],
  },
  extractor: {
    distanceToSource: 20,
    currentModel: models.WORKER_5B,
    teamSize: 1,
  },
  upgrader: {
    distanceToSource: 3, // distance to source = 5
    currentModel: models.WORKER_5A, // 5A
    teamSize: 3,
    sourceIndex: RIGHT_SOURCE,
    sourceOrigins: ["source", "storage"],
  },
  builder: {
    currentModel: models.WORKER_5C,
    teamSize: 1,
    sourceIndex: LEFT_SOURCE,
    // comment out first three origins for heavy builder
    sourceOrigins: [
      "droppedResources",
      "tombstone",
      "ruin",
      "storage",
      "container",
      // "extension",
      // "spawn",
      // "source",
    ],
    buildingPriority: "none",
  },
  repairer: {
    spawnCycle: 1, // set to 1 for spawn with no delay
    currentModel: models.WORKER_5C,
    teamSize: 1,
    sourceIndex: LEFT_SOURCE,
    sourceOrigins: [
      "droppedResources",
      "tombstone",
      "ruin",
      "container",
      "storage",
      // "extension",
      // "spawn",
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
