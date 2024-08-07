const models = require("./squad.creepModels");
const W35N43_DEBUG_MODE = false;
const W36N43_DEBUG_MODE = false;
const W34N43_DEBUG_MODE = false;
const W38N43_DEBUG_MODE = false;

const W35N43_LEFT_SOURCE = 1;
const W35N43_RIGHT_SOURCE = 0;
const W34N43_BOTTOM_SOURCE = 1;
const W34N43_RIGHT_SOURCE = 0;
const W38N43_LEFT_SOURCE = 0;
const W38N43_RIGHT_SOURCE = 1;

let roomConfig = {
  W35N43: {
    SPAWN_WITHDRAW_THRESHOLD: 1500,
    CONTAINER_WITHDRAW_THRESHOLD: 300,
    STORAGE_WITHDRAW_THRESHOLD: 200,
    spawn: {
      spawnNames: ["Spawn2", "Spawn5"],
      debugMode: W35N43_DEBUG_MODE,
      spawningDirections: [BOTTOM],
    },
    tower: {
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 1500000,
      maxFiringRange: 26,
    },
    harvester: {
      currentModel: models.CARRIER_6,
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
      distanceToSource: 10, // distance to source = 5
      currentModel: models.WORKER_6A, // 6A is the most efficient miner model
      teamSize: 1,
      sourceIndex: W35N43_LEFT_SOURCE,
      sourceOrigins: ["source"],
    },
    extractor: {
      distanceToSource: 20,
      currentModel: models.WORKER_5B,
      teamSize: 1,
    },
    upgrader: {
      distanceToSource: 5, // distance to source = 5
      currentModel: models.WORKER_5A,
      teamSize: 3,
      sourceIndex: W35N43_RIGHT_SOURCE,
      sourceOrigins: ["source"],
    },
    builder: {
      currentModel: models.WORKER_5C,
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
      currentModel: models.CARRIER_10,
      teamSize: 1,
    },
  },

  W36N43: {
    SPAWN_WITHDRAW_THRESHOLD: 1500,
    CONTAINER_WITHDRAW_THRESHOLD: 1000,
    STORAGE_WITHDRAW_THRESHOLD: 500,

    spawn: {
      spawnNames: ["Spawn1"],
      debugMode: W36N43_DEBUG_MODE,
      spawningDirections: [BOTTOM_LEFT, BOTTOM],
    },
    tower: {
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 100000,
      maxFiringRange: 37,
    },
    harvester: {
      currentModel: models.CARRIER_6,
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
    extractor: {
      distanceToSource: 20,
      currentModel: models.WORKER_5B,
      teamSize: 1,
    },
    upgrader: {
      distanceToSource: 50,
      currentModel: models.WORKER_5B,
      teamSize: 2,
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
      spawnCycle: 1, // set to 1 for spawn with no delay
      currentModel: models.CARRIER_3B,
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

  W34N43: {
    SPAWN_WITHDRAW_THRESHOLD: 1500,
    CONTAINER_WITHDRAW_THRESHOLD: 500,
    STORAGE_WITHDRAW_THRESHOLD: 500,

    spawn: {
      spawnNames: ["Spawn3"],
      debugMode: W34N43_DEBUG_MODE,
      spawningDirections: [RIGHT, BOTTOM],
    },
    tower: {
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 100000,
      maxFiringRange: 37,
    },
    harvester: {
      currentModel: models.CARRIER_10,
      teamSize: 1,
      sourceIndex: W34N43_BOTTOM_SOURCE,
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
      sourceIndex: W34N43_BOTTOM_SOURCE,
      sourceOrigins: ["source"],
    },
    extractor: {
      distanceToSource: 20,
      currentModel: models.WORKER_5B,
      teamSize: 0,
    },
    upgrader: {
      distanceToSource: 20,
      currentModel: models.WORKER_5C,
      teamSize: 5,
      sourceIndex: W34N43_RIGHT_SOURCE,
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
      teamSize: 2,
      sourceIndex: W34N43_RIGHT_SOURCE,
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
      currentModel: models.CARRIER_3B,
      teamSize: 1,
      sourceIndex: W34N43_RIGHT_SOURCE,
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

  W38N43: {
    SPAWN_WITHDRAW_THRESHOLD: 1500,
    CONTAINER_WITHDRAW_THRESHOLD: 150,
    STORAGE_WITHDRAW_THRESHOLD: 200,
    spawn: {
      spawnNames: ["Spawn4"],
      debugMode: W38N43_DEBUG_MODE,
      spawningDirections: [TOP_LEFT, LEFT, BOTTOM_LEFT, BOTTOM],
    },
    tower: {
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 100000,
      maxFiringRange: 30,
    },
    harvester: {
      currentModel: models.CARRIER_3,
      teamSize: 3,
      sourceIndex: W38N43_RIGHT_SOURCE,
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
      currentModel: models.WORKER_3, // 6A is the most efficient miner model
      teamSize: 0,
      sourceIndex: W38N43_LEFT_SOURCE,
      sourceOrigins: ["droppedResource", "source"],
    },
    extractor: {
      distanceToSource: 20,
      currentModel: models.WORKER_5B,
      teamSize: 0,
    },
    upgrader: {
      distanceToSource: 5, // distance to source = 5
      currentModel: models.WORKER_3,
      teamSize: 1,
      sourceIndex: W38N43_RIGHT_SOURCE,
      sourceOrigins: ["tombstone", "source"],
    },
    builder: {
      currentModel: models.WORKER_3, // 2B(212), 4B(413), 5C(534)
      teamSize: 2,
      sourceIndex: W38N43_RIGHT_SOURCE,
      // comment out first three origins for heavy builder
      sourceOrigins: [
        "droppedResources",
        "tombstone",
        "ruin",
        "storage",
        // "container",
        // "extension",
        // "spawn",
        "source",
      ],
      buildingPriority: "none",
    },
    repairer: {
      spawnCycle: 1000, // set to 1 for spawn with no delay
      currentModel: models.WORKER_1B,
      teamSize: 1,
      sourceIndex: W38N43_RIGHT_SOURCE,
      sourceOrigins: [
        "droppedResources",
        "tombstone",
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
  },
};

module.exports = roomConfig;
