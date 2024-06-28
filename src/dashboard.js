const models = require("./squad.creepModels");
const W35N43_DEBUG_MODE = true;
const W36N43_DEBUG_MODE = false;
const W35N43_LEFT_SOURCE = 1;
const W35N43_RIGHT_SOURCE = 0;

let roomConfig = {
  W35N43: {
    // ======== RESOURCES ========
    SPAWN_WITHDRAW_THRESHOLD: 400,
    CONTAINER_WITHDRAW_THRESHOLD: 100,

    // ======== SPAWN ========
    spawn: {
      spawnNames: ["Spawn2"],
      debugMode: W35N43_DEBUG_MODE,
      spawningDirections: [BOTTOM],
    },

    // ======== TOWERS ========
    tower: {
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 100000,
      maxFiringRange: 16,
    },

    // ======== creeps ========
    // low efficiency miner and transferer
    harvester: {
      currentModel: models.CARRIER_1,
      teamSize: 1,
      sourceIndex: W35N43_LEFT_SOURCE,
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
      creepReadyTime: 10,
      currentModel: models.WORKER_3,
      teamSize: 2,
      sourceIndex: W35N43_LEFT_SOURCE,
      sourceOrigins: ["source"],
    },
    upgrader: {
      creepReadyTime: 10,
      currentModel: models.WORKER_3,
      teamSize: 1,
      sourceIndex: W35N43_RIGHT_SOURCE,
      sourceOrigins: ["source"],
    },
    // first structures to build:
    //   road, container
    builder: {
      creepReadyTime: 10,
      currentModel: models.WORKER_4B,
      teamSize: 1,
      sourceIndex: W35N43_LEFT_SOURCE,
      sourceOrigins: [
        "droppedResources",
        // "tombstone",
        // "ruin",
        // "storage",
        "container",
        "extension",
        // "spawn",
        "source",
      ],
      buildingPriority: "none",
    },
    // spawn repairer when lots of structures
    repairer: {
      spawnCycle: 1000,
      currentModel: models.WORKER_1B,
      teamSize: 1,
      sourceIndex: W35N43_LEFT_SOURCE,
      sourceOrigins: [
        "droppedResources",
        "tombstone",
        "ruin",
        "storage",
        "container",
        "extension",
        "spawn",
        // "source",
      ],
      repairingPriority: "none",
      repairingHitsRatio: 1 / 4,
    },
  },

  W36N43: {
    // ======== RESOURCES ========
    SPAWN_WITHDRAW_THRESHOLD: 350, // current miner cost - 100
    CONTAINER_WITHDRAW_THRESHOLD: 150,

    // ======== SPAWN ========
    spawn: {
      spawnNames: ["Spawn1"],
      debugMode: W36N43_DEBUG_MODE,
      spawningDirections: [BOTTOM_LEFT, BOTTOM],
    },

    // ======== TOWERS ========
    tower: {
      minTowerEnergyToRepair: 400,
      minDefenseHitsToRepair: 20000,
      maxFiringRange: 46,
    },

    // ======== creeps ========
    // low efficiency miner and transferer
    harvester: {
      currentModel: models.CARRIER_1,
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
      creepReadyTime: 20,
      currentModel: models.WORKER_5A,
      teamSize: 1,
      sourceIndex: 0,
      sourceOrigins: ["source"],
    },
    upgrader: {
      creepReadyTime: 10,
      currentModel: models.CARRIER_3B,
      teamSize: 6,
      sourceIndex: 0,
      sourceOrigins: [
        "droppedResources",
        "tombstone",
        "ruin",
        "extension",
        "container",
        "spawn",
        "source",
      ],
    },
    // first structures to build:
    //   road, container
    builder: {
      creepReadyTime: 10,
      currentModel: models.WORKER_4B,
      teamSize: 0,
      sourceIndex: 0,
      sourceOrigins: [
        // "droppedResources",
        "tombstone",
        "ruin",
        "storage",
        "container",
        "extension",
        "spawn",
        "source",
      ],
      buildingPriority: "none",
    },
    // spawn repairer when lots of structures
    repairer: {
      spawnCycle: 2000,
      currentModel: models.WORKER_1B,
      teamSize: 1,
      sourceIndex: 0,
      sourceOrigins: [
        "droppedResources",
        "tombstone",
        "ruin",
        "storage",
        "container",
        "extension",
        "spawn",
        "source",
      ],
      repairingPriority: "infrastructure",
      repairingHitsRatio: 1 / 4,
    },
  },
};

module.exports = roomConfig;
