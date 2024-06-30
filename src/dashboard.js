const models = require("./squad.creepModels");
const W35N43_DEBUG_MODE = false;
const W36N43_DEBUG_MODE = false;
const W35N43_LEFT_SOURCE = 1;
const W35N43_RIGHT_SOURCE = 0;

let roomConfig = {
  W35N43: {
    SPAWN_WITHDRAW_THRESHOLD: 1500,
    CONTAINER_WITHDRAW_THRESHOLD: 1000,
    STORAGE_WITHDRAW_THRESHOLD: 200,
    spawn: {
      spawnNames: ["Spawn2"],
      debugMode: W35N43_DEBUG_MODE,
      spawningDirections: [BOTTOM],
    },
    tower: {
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 500000,
      maxFiringRange: 16,
      repairTowerIndex: 0,
    },
    harvester: {
      currentModel: models.CARRIER_3,
      teamSize: 1,
      sourceIndex: W35N43_RIGHT_SOURCE,
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
      distanceToSource: 12,
      currentModel: models.WORKER_6A, // 6A is the most efficient miner model
      teamSize: 1,
      sourceIndex: W35N43_LEFT_SOURCE,
      sourceOrigins: ["source"],
    },
    upgrader: {
      distanceToSource: 5, // distance between spawn and source
      currentModel: models.WORKER_5A,
      teamSize: 3,
      sourceIndex: W35N43_RIGHT_SOURCE,
      sourceOrigins: ["source"],
    },
    builder: {
      currentModel: models.WORKER_2B, // 2B(212), 4B(413), 5C(534)
      teamSize: 1,
      sourceIndex: W35N43_LEFT_SOURCE,
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
      currentModel: models.WORKER_2B,
      teamSize: 1,
      sourceIndex: W35N43_LEFT_SOURCE,
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
      currentModel: models.CARRIER_6,
      teamSize: 1,
    },
  },

  W36N43: {
    // ======== RESOURCES ========
    SPAWN_WITHDRAW_THRESHOLD: 1500, // current miner cost - 100
    CONTAINER_WITHDRAW_THRESHOLD: 2000,
    STORAGE_WITHDRAW_THRESHOLD: 500,

    spawn: {
      spawnNames: ["Spawn1"],
      debugMode: W36N43_DEBUG_MODE,
      spawningDirections: [BOTTOM_LEFT, BOTTOM],
    },
    tower: {
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 40000,
      maxFiringRange: 37,
      repairTowerIndex: 1,
    },
    harvester: {
      currentModel: models.CARRIER_3,
      teamSize: 1,
      sourceIndex: 0,
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
      distanceToSource: 4, // distance = 4, adjustment = 50
      currentModel: models.WORKER_6A, // 6A is the most efficient miner model
      teamSize: 1,
      sourceIndex: 0,
      sourceOrigins: ["source"],
    },
    upgrader: {
      distanceToSource: 150,
      currentModel: models.WORKER_5B,
      teamSize: 3,
      sourceIndex: 0,
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
      currentModel: models.WORKER_2B, // 5C
      teamSize: 1,
      sourceIndex: 0,
      // comment out first three origins for heavy builder
      sourceOrigins: [
        "droppedResources",
        // "tombstone",
        // "ruin",
        "storage",
        // "extension",
        // "container",
        // "spawn",
        "source",
      ],
      buildingPriority: "none",
    },
    repairer: {
      spawnCycle: 200, // set to 1 for spawn with no delay
      currentModel: models.WORKER_2B,
      teamSize: 1,
      sourceIndex: 0,
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
  },
};

module.exports = roomConfig;
