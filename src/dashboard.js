const models = require("./squad.creepModels");
const W35N43_DEBUG_MODE = false;
const W36N43_DEBUG_MODE = false;

let roomConfig = {
  defaultHarvesterSourceOrigins: [
    "droppedResources",
    "tombstone",
    "ruin",
    "container",
    "storage",
    "source",
  ],
  defaultRepairerSourceOrigins: [
    "droppedResources",
    "tombstone",
    "ruin",
    "storage",
    "container",
    "extension",
    "spawn",
    "source",
  ],
  defaultBuilderSourceOrigins: [
    "droppedResources",
    "tombstone",
    "ruin",
    "storage",
    "container",
    "extension",
    "spawn",
    "source",
  ],

  W35N43: {
    // ======== RESOURCES ========
    SPAWN_WITHDRAW_THRESHOLD: 500,
    CONTAINER_WITHDRAW_THRESHOLD: 100,

    // ======== SPAWN ========
    spawn: {
      spawnNames: ["Spawn2"],
      debugMode: W35N43_DEBUG_MODE,
      spawningDirections: [TOP],
    },

    // ======== TOWERS ========
    tower: {
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 5000,
    },

    // ======== creeps ========
    miner: {
      creepReadyTime: 10,
      currentModel: models.WORKER_3,
      teamSize: 2,
      sourceIndex: 1,
      sourceOrigins: ["source"],
    },
    upgrader: {
      creepReadyTime: 10,
      currentModel: models.WORKER_3,
      teamSize: 2,
      sourceIndex: 0,
      sourceOrigins: ["source"],
    },
    // first structures to build:
    //   road, container
    builder: {
      creepReadyTime: 10,
      currentModel: models.WORKER_2B,
      teamSize: 0,
      sourceIndex: 0,
      buildingPriority: "none",
    },
    // spawn harvester after containers built
    harvester: {
      currentModel: models.WORKER_2B,
      teamSize: 0,
      sourceIndex: 0,
    },
    // spawn repairer when lots of structures
    repairer: {
      spawnDelay: 1000,
      currentModel: models.WORKER_1B,
      teamSize: 0,
      sourceIndex: 0,
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
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 5000,
    },

    // ======== creeps ========
    miner: {
      creepReadyTime: 10,
      currentModel: models.WORKER_3,
      teamSize: 1,
      sourceIndex: 0,
      sourceOrigins: ["source"],
    },
    upgrader: {
      creepReadyTime: 10,
      currentModel: models.CARRIER_3B,
      teamSize: 4,
      sourceIndex: 0,
      sourceOrigins: [
        // "droppedResources",
        // "tombstone",
        // "ruin",
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
      teamSize: 1,
      sourceIndex: 0,
      buildingPriority: "none",
    },
    // spawn harvester after containers built
    harvester: {
      currentModel: models.CARRIER_2,
      teamSize: 1,
      sourceIndex: 0,
    },
    // spawn repairer when lots of structures
    repairer: {
      spawnDelay: 1000,
      currentModel: models.WORKER_1B,
      teamSize: 1,
      sourceIndex: 0,
      repairingPriority: "none",
      repairingHitsRatio: 1 / 4,
    },
  },
};

module.exports = roomConfig;
