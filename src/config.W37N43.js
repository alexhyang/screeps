const models = require("./squad.creepModels");
const DEBUG_MODE = false;
const TOP_SOURCE = 0;

module.exports = {
  SPAWN_WITHDRAW_THRESHOLD: 1500,
  CONTAINER_WITHDRAW_THRESHOLD: 100,
  STORAGE_WITHDRAW_THRESHOLD: 1000,
  spawn: {
    spawnNames: ["Spawn6"],
    debugMode: DEBUG_MODE,
    spawningDirections: [TOP_RIGHT, TOP, LEFT],
  },
  tower: {
    minTowerEnergyToRepair: 500,
    minDefenseHitsToRepair: 50000,
    maxFiringRange: 30,
  },
  harvester: {
    currentModel: models.CARRIER_6,
    teamSize: 1,
    sourceIndex: TOP_SOURCE,
    sourceOrigins: [
      "droppedResources",
      "tombstone",
      "ruin",
      "container",
      "terminal",
      "storage",
      "source",
    ],
  },
  miner: {
    distanceToSource: 5, // distance to source = 5
    currentModel: models.WORKER_3, // 6A is the most efficient miner model
    teamSize: 2,
    sourceIndex: TOP_SOURCE,
    sourceOrigins: ["source"],
  },
  extractor: {
    distanceToSource: 16,
    currentModel: models.WORKER_5B,
    teamSize: 1,
  },
  upgrader: {
    distanceToSource: 25, // distance to source = 5
    currentModel: models.WORKER_5B,
    teamSize: 1,
    sourceIndex: TOP_SOURCE,
    sourceOrigins: ["tombstone", "link", "storage", "container", "source"],
  },
  builder: {
    currentModel: models.WORKER_5C, // 2B(212), 4B(413), 5C(534)
    teamSize: 1,
    sourceIndex: TOP_SOURCE,
    // comment out first three origins for heavy builder
    sourceOrigins: [
      "droppedResources",
      "tombstone",
      "ruin",
      "terminal",
      "storage",
      // "extension",
      // "spawn",
      "container",
      "source",
    ],
    buildingPriority: "none",
  },
  repairer: {
    spawnCycle: 1, // set to 1 for spawn with no delay
    currentModel: models.WORKER_2B,
    teamSize: 0,
    sourceIndex: TOP_SOURCE,
    sourceOrigins: [
      // "droppedResources",
      // "tombstone",
      "ruin",
      "container",
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
