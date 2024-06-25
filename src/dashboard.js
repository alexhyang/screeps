const models = require("./squad.creepModels");

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
      debugMode: false,
      spawningDirections: [TOP],
    },

    // ======== TOWERS ========
    tower: {
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 5000,
    },

    // ======== creeps ========
    harvester: {
      currentModel: models.WORKER_2A,
      teamSize: 1,
      sourceIndex: 1,
    },
    miner: {
      creepReadyTime: 10,
      currentModel: models.WORKER_4A,
      teamSize: 1,
      sourceIndex: 1,
      sourceOrigins: ["source"],
    },
    builder: {
      creepReadyTime: 10,
      currentModel: models.WORKER_2A,
      teamSize: 1,
      sourceIndex: 0,
      buildingPriority: "none",
    },
    upgrader: {
      creepReadyTime: 10,
      currentModel: models.WORKER_2A,
      teamSize: 3,
      sourceIndex: 0,
      sourceOrigins: ["source"],
    },
    repairer: {
      spawnDelay: 1000,
      currentModel: models.WORKER_1B,
      teamSize: 1,
      sourceIndex: 0,
      repairingPriority: "none",
      repairingHitsRatio: 1 / 4,
    },
  },

  W36N43: {
    // ======== RESOURCES ========
    SPAWN_WITHDRAW_THRESHOLD: 300,
    CONTAINER_WITHDRAW_THRESHOLD: 150,

    // ======== SPAWN ========
    spawn: {
      spawnNames: ["Spawn1"],
      debugMode: false,
      spawningDirections: [BOTTOM_LEFT, BOTTOM],
    },

    // ======== TOWERS ========
    tower: {
      minTowerEnergyToRepair: 500,
      minDefenseHitsToRepair: 5000,
    },

    // ======== creeps ========
    harvester: {
      currentModel: models.CARRIER_2,
      teamSize: 1,
      sourceIndex: 0,
    },
    miner: {
      creepReadyTime: 10,
      currentModel: models.WORKER_3,
      teamSize: 1,
      sourceIndex: 0,
      sourceOrigins: ["source"],
    },
    builder: {
      creepReadyTime: 10,
      currentModel: models.WORKER_4B,
      teamSize: 1,
      sourceIndex: 0,
      buildingPriority: "none",
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
