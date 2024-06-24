const MODELS = require("./squad.creepModels");

let roomConfig = {
  DEFAULT_ROOM: "W35N43",
  DEFAULT_HARVESTER_SOURCE_ORIGINS: [
    "droppedResources",
    "tombstone",
    "ruin",
    "container",
    "storage",
    "source",
  ],
  DEFAULT_REPAIRER_SOURCE_ORIGINS: [
    "droppedResources",
    "tombstone",
    "ruin",
    "container",
    "storage",
    "container",
    "spawn",
    "source",
  ],
  DEFAULT_BUILDER_SOURCE_ORIGINS: [
    "droppedResources",
    "tombstone",
    "ruin",
    "storage",
    "container",
    "spawn",
    "source",
  ],

  W35N43: {
    // ======== Room status ========
    ROOM_NUMBER: "W35N43",

    // ======== RESOURCES ========
    SPAWN_WITHDRAW_THRESHOLD: 0,
    CONTAINER_WITHDRAW_THRESHOLD: 0,

    // ======== SPAWN ========
    DEBUG_SPAWN: false,
    SPAWN_NAME: "Spawn2",
    SPAWNING_DIRECTIONS: [TOP],
    NEW_BUILDER_READY_TIME: 10,
    NEW_MINER_READY_TIME: 25,
    NEW_UPGRADER_READY_TIME: 57,
    REPAIRER_RESPAWN_GAP: 4000,

    // ======== TOWERS ========
    TOP_TOWER: "",
    BOTTOM_TOWER: "",
    TOP_TOWER_REPAIR: false,
    BOTTOM_TOWER_REPAIR: true,
    TOWER_REPAIR_MIN_ENERGY: 400,
    TOWER_REPAIR_MIN_HITS: 1500,

    // ======== HARVESTERS ========
    // 2 energy pts per WORK part per tick
    HARVESTER_CURRENT_MODEL: MODELS.WORKER_1B, //C3
    HARVESTER_TEAM_SIZE: 1,
    HARVESTER_SOURCE_INDEX: 0,

    // ======== MINERS ========
    MINER_CURRENT_MODEL: MODELS.WORKER_1B, //W5A
    MINER_TEAM_SIZE: 2,
    MINER_SOURCE_INDEX: 1,
    MINER_SOURCE_ORIGINS: ["source"],

    // ======== BUILDERS ========
    BUILDER_CURRENT_MODEL: MODELS.WORKER_4B, //W5B
    BUILDER_TEAM_SIZE: 3,
    BUILDER_SOURCE_INDEX: 0,
    BUILD_PRIORITY: "none",

    // ======== UPGRADERS ========
    UPGRADER_CURRENT_MODEL: MODELS.WORKER_1A, //W5B
    UPGRADER_TEAM_SIZE: 3,
    UPGRADER_SOURCE_INDEX: 0,
    UPGRADER_SOURCE_ORIGINS: ["source"],

    // ======== REPAIRERS ========
    REPAIRER_SPAWN_DELAY: 1000,
    REPAIRER_CURRENT_MODEL: MODELS.WORKER_1A, //W4A
    REPAIRER_TEAM_SIZE: 2,
    REPAIRER_SOURCE_INDEX: 0,
    REPAIR_PRIORITY: "infrastructure",
    REPAIR_HITS_THRESHOLD_RATIO: 1 / 4,
  },

  W36N43: {
    // ======== Room status ========
    ROOM_NUMBER: "W36N43",

    // ======== RESOURCES ========
    SPAWN_WITHDRAW_THRESHOLD: 0,
    CONTAINER_WITHDRAW_THRESHOLD: 0,

    // ======== SPAWN ========
    DEBUG_SPAWN: false,
    SPAWN_NAME: "Spawn1",
    SPAWNING_DIRECTIONS: [BOTTOM_LEFT, BOTTOM],
    NEW_BUILDER_READY_TIME: 10,
    NEW_MINER_READY_TIME: 25,
    NEW_UPGRADER_READY_TIME: 57,
    REPAIRER_RESPAWN_GAP: 4000,
    CREEP_LIFE: 1500,

    // ======== TOWERS ========
    TOP_TOWER_REPAIR: false,
    BOTTOM_TOWER_REPAIR: true,
    TOWER_REPAIR_MIN_ENERGY: 400,
    TOWER_REPAIR_MIN_HITS: 1500,

    // ======== HARVESTERS ========
    // 2 energy pts per WORK part per tick
    HARVESTER_CURRENT_MODEL: MODELS.WORKER_1B, //C3
    HARVESTER_TEAM_SIZE: 3,
    HARVESTER_SOURCE_INDEX: 0,

    // ======== MINERS ========
    MINER_CURRENT_MODEL: MODELS.WORKER_3, //W5A
    MINER_TEAM_SIZE: 0,
    MINER_SOURCE_INDEX: 0,

    // ======== BUILDERS ========
    BUILDER_CURRENT_MODEL: MODELS.WORKER_4B, //W5B
    BUILDER_TEAM_SIZE: 2,
    BUILDER_SOURCE_INDEX: 0,
    BUILD_PRIORITY: "none",

    // ======== UPGRADERS ========
    UPGRADER_CURRENT_MODEL: MODELS.CARRIER_3B, //W5B
    UPGRADER_TEAM_SIZE: 3,
    UPGRADER_SOURCE_INDEX: 0,
    UPGRADER_ENERGY_SOURCE: "source",

    // ======== REPAIRERS ========
    REPAIRER_SPAWN_DELAY: 1000,
    REPAIRER_CURRENT_MODEL: MODELS.WORKER_1A, //W4A
    REPAIRER_TEAM_SIZE: 2,
    REPAIRER_SOURCE_INDEX: 0,
    REPAIR_PRIORITY: "infrastructure",
    REPAIR_HITS_THRESHOLD_RATIO: 1 / 4,
  },
};

module.exports = roomConfig;
