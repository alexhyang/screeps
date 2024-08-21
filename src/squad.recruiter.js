const { getMyRooms, getRoomConfig } = require("./configAPI");
const { getTeam } = require("./squad");
const {
  buildBodyParts,
  getModelCost,
  getCreepSpawningTime,
} = require("./squad.creepModelAnalyzer");
const MODELS = require("./squad.creepModels");
const { getEnergyAvailable } = require("./util.resourceManager");
const {
  getSpawnByName,
  getExtractor,
  getController,
} = require("./util.structureFinder");

/**
 * Generate name for new creep
 * @param {object.<string, object.<string, number>>} creepModel
 * @param {string} creepName
 * @returns {string} given creep name, or modelName-timestamp
 */
const generateCreepName = (creepModel, creepName) => {
  return creepName ? creepName : creepModel.name + "-" + (Game.time % 100);
};

/**
 * Print information about the creep being spawned
 * @param {StructureSpawn} spawn
 * @param {string} creepName
 * @param {string} creepRole
 * @param {number} spawningCost
 */
const printCreepSpawningMsg = (spawn, creepName, creepRole, spawningCost) => {
  let remainingTime;
  if (spawn.spawning) {
    remainingTime = `(${spawn.spawning.remainingTime})`;
  }
  console.log(
    `${spawn.name} ${spawn.room.name} Spawning new ${creepRole}:`,
    creepName,
    `(${spawningCost})`,
    remainingTime
  );
};

/**
 * Get the first available spawn to creep spawning
 * @param {string[]} spawnNames a list of spawn names to check
 * @returns {(StructureSpawn|undefined)} idle spawn, undefined if all spawns
 *    are busy
 */
const getIdleSpawn = (spawnNames) => {
  for (i in spawnNames) {
    let spawn = getSpawnByName(spawnNames[i]);
    if (spawn.spawning == null) {
      return spawn;
    }
  }
};

/**
 * Recruit a creep to given role with desired model design
 * @param {CreepModel} creepModel the creep model with name and body parts
 * @param {string} creepRole
 * @param {string} roomName
 * @param {string} [creepName]
 * @param {string} [srcIndex]
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitCreep(creepModel, creepRole, roomName, creepName, srcIndex) {
  const { spawnNames, debugMode } = getRoomConfig(roomName).spawn;
  creepName = generateCreepName(creepModel, creepName);

  if (debugMode && Memory.debugCountDown > 0) {
    console.log(`TEST Spawning new ${creepRole}: ${creepName}`);
  } else {
    let spawn = getIdleSpawn(spawnNames);
    if (spawn) {
      let result = spawn.spawnCreep(buildBodyParts(creepModel), creepName, {
        memory: { role: creepRole, srcIndex: srcIndex },
      });
      printCreepSpawningMsg(
        spawn,
        creepName,
        creepRole,
        getModelCost(creepModel)
      );
      return result == 0;
    }
  }
  return false;
}

/**
 * Determine if it's okay to recruit in advance
 * @param {object.<string, Creep>} currentTeam current team of same role
 * @param {number} maxTeamSize max allowed team size
 * @param {number} newCreepReadyTime time for new creep to get ready to work
 * @returns {boolean} true if all in-advance recruit requirements met,
 *    false otherwise
 */
function recruitInAdvanceOk(currentTeam, maxTeamSize, newCreepReadyTime) {
  return (
    currentTeam.length < maxTeamSize ||
    (currentTeam.length == maxTeamSize &&
      currentTeam.length > 0 &&
      currentTeam[0].ticksToLive < newCreepReadyTime)
  );
}

/**
 * Determine if the room should recruit harvesters
 * @param {Room} room
 * @param {RoomConfig} roomConfig
 * @returns {boolean} true if room should recruit harvesters, false otherwise
 */
function shouldRecruitHarvesters(room, roomConfig) {
  const { currentModel, teamSize } = roomConfig.harvester;
  return recruitInAdvanceOk(
    getTeam("harvester", room.name),
    teamSize,
    getCreepSpawningTime(currentModel)
  );
}

/**
 * Recruit harvesters in specified room
 * @param {Room} room
 * @param {CreepModel} currentModel
 */
function recruitHarvesters(room, currentModel) {
  let energyAvailable = getEnergyAvailable(room);
  if (energyAvailable >= getModelCost(currentModel)) {
    return recruitCreep(currentModel, "harvester", room.name);
  } else if (energyAvailable >= getModelCost(MODELS.CARRIER_6)) {
    return recruitCreep(MODELS.CARRIER_6, "harvester", room.name);
  } else if (energyAvailable >= getModelCost(MODELS.CARRIER_3)) {
    return recruitCreep(MODELS.CARRIER_3, "harvester", room.name);
  } else {
    return recruitCreep(MODELS.CARRIER_1, "harvester", room.name);
  }
}

function shouldRecruitBuilders(room, roomConfig) {
  const { currentModel, teamSize } = roomConfig.builder;
  let constructionsInRoom = room.find(FIND_CONSTRUCTION_SITES);
  return (
    constructionsInRoom.length > 0 &&
    recruitInAdvanceOk(
      getTeam("builder", room.name),
      teamSize,
      getCreepSpawningTime(currentModel)
    )
  );
}

/**
 * Recruit builders in the specified room
 * @param {Room} room
 * @param {CreepModel} currentModel
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitBuilders(room, currentModel) {
  return recruitCreep(currentModel, "builder", room.name);
}

/**
 * Determine if the room should recruit upgraders
 * @param {Room} room
 * @param {RoomConfig} roomConfig
 * @returns {boolean} true if room should recruit upgraders, false otherwise
 */
function shouldRecruitUpgraders(room, roomConfig) {
  const { currentModel, teamSize, distanceToSource } = roomConfig.upgrader;
  let controller = getController(room);
  return (
    controller &&
    ((controller.level == 8 && controller.ticksToDowngrade < 170000) ||
      controller.level < 8) &&
    recruitInAdvanceOk(
      getTeam("upgrader", room.name),
      teamSize,
      getCreepSpawningTime(currentModel) + distanceToSource
    )
  );
}

/**
 * Recruit upgraders in the specified room
 * @param {Room} room
 * @param {CreepModel} currentModel
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitUpgraders(room, currentModel) {
  return recruitCreep(currentModel, "upgrader", room.name);
}

/**
 * Determine if the room should recruit repairers
 * @param {Room} room
 * @param {RoomConfig} roomConfig
 * @returns {boolean} true if room should recruit repairers, false otherwise
 */
function shouldRecruitRepairers(room, roomConfig) {
  const { teamSize, spawnCycle } = roomConfig.repairer;
  return (
    getTeam("repairer", room.name).length < teamSize &&
    Game.time % spawnCycle == 0
  );
}

/**
 * Recruit repairers in the specified room
 * @param {Room} room
 * @param {CreepModel} currentModel
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitRepairers(room, currentModel) {
  return recruitCreep(currentModel, "repairer", room.name);
}

/**
 * Determine if the room should recruit miners
 * @param {Room} room
 * @param {RoomConfig} roomConfig
 * @returns {boolean} true if room should recruit miners, false otherwise
 */
function shouldRecruitMiners(room, roomConfig) {
  const { currentModel, teamSize, distanceToSource } = roomConfig.miner;
  return recruitInAdvanceOk(
    getTeam("miner", room.name),
    teamSize,
    getCreepSpawningTime(currentModel) + distanceToSource
  );
}

/**
 * Recruit miners in the specified room
 * @param {Room} room
 * @param {CreepModel} currentModel
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitMiners(room, currentModel) {
  let energyAvailable = getEnergyAvailable(room);
  if (energyAvailable >= getModelCost(currentModel)) {
    return recruitCreep(currentModel, "miner", room.name);
  } else if (energyAvailable >= getModelCost(MODELS.WORKER_5B)) {
    return recruitCreep(MODELS.WORKER_5B, "miner", room.name);
  } else if (energyAvailable >= getModelCost(MODELS.WORKER_3)) {
    return recruitCreep(MODELS.WORKER_3, "miner", room.name);
  } else {
    return recruitCreep(MODELS.WORKER_2B, "miner", room.name);
  }
}

function shouldRecruitTransferrer(room, roomConfig) {
  const { currentModel, teamSize } = roomConfig.transferrer;
  return recruitInAdvanceOk(
    getTeam("transferrer", "all"),
    teamSize,
    getCreepSpawningTime(currentModel)
  );
}

/**
 * Recruit transferrers in the specified room
 * @param {Room} room
 * @param {CreepModel} currentModel
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitTransferrers(room, currentModel) {
  return recruitCreep(currentModel, "transferrer", room.name);
}

/**
 * Determine if the room should recruit extractors
 * @param {Room} room
 * @param {RoomConfig} roomConfig
 * @returns {boolean} true if room should recruit extractors, false otherwise
 */
function shouldRecruitExtractors(room, roomConfig) {
  const { currentModel, teamSize, distanceToSource } = roomConfig.extractor;
  let mineral = room.find(FIND_MINERALS)[0];

  return (
    mineral.mineralAmount > 0 &&
    getExtractor(room) &&
    recruitInAdvanceOk(
      getTeam("extractor", room.name),
      teamSize,
      getCreepSpawningTime(currentModel) + distanceToSource
    )
  );
}

/**
 * Recruit extractors in the specified room
 * @param {Room} room
 * @param {CreepModel} currentModel
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitExtractors(room, currentModel) {
  return recruitCreep(currentModel, "extractor", room.name);
}

/**
 * Determine if the room should recruit army
 * @param {Room} room
 * @param {RoomConfig} roomConfig
 * @returns {boolean} true if room should recruit army, false otherwise
 */
function shouldRecruitArmy(room, roomConfig) {
  let hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
  return hostileCreeps.length > 1 && getTeam("army", room.name).length == 0;
}

/**
 * recruit army when two or more hostile creeps show up
 * @param {Room} room
 * @param {CreepModel} currentModel
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitArmy(room, currentModel) {
  if (currentModel == undefined) {
    currentModel = MODELS.DEFENDER2;
  }
  return recruitCreep(currentModel, "army", room.name);
}

/**
 * Recruit creeps for a room based on its config parameters
 * @param {string} roomName
 */
function recruitForRoom(roomName) {
  let room = Game.rooms[roomName];
  const roomConfig = getRoomConfig(roomName);

  if (room && roomConfig) {
    if (shouldRecruitArmy(room)) {
      return recruitArmy(room, roomConfig);
    }

    if (shouldRecruitMiners(room, roomConfig)) {
      return recruitMiners(room, roomConfig.miner.currentModel);
    }

    if (shouldRecruitUpgraders(room, roomConfig)) {
      return recruitUpgraders(room, roomConfig.upgrader.currentModel);
    }

    if (shouldRecruitHarvesters(room, roomConfig)) {
      return recruitHarvesters(room, roomConfig.harvester.currentModel);
    }

    if (shouldRecruitRepairers(room, roomConfig)) {
      return recruitRepairers(room, roomConfig.repairer.currentModel);
    }

    if (shouldRecruitExtractors(room, roomConfig)) {
      return recruitExtractors(room, roomConfig.extractor.currentModel);
    }

    if (shouldRecruitBuilders(room, roomConfig)) {
      return recruitBuilders(room, roomConfig.builder.currentModel);
    }

    if (shouldRecruitTransferrer(room, roomConfig)) {
      return recruitTransferrers(room, roomConfig.transferrer.currentModel);
    }
  }
}

module.exports = {
  run: () => {
    getMyRooms().forEach((roomName) => {
      const { debugMode, spawnNames, spawningDirections } =
        getRoomConfig(roomName).spawn;
      if (debugMode) {
        console.log(`Room ${roomName} spawning debug mode is on`);
      }
      recruitForRoom(roomName);
      let spawn = getSpawnByName(spawnNames[0]);
      if (spawn && spawn.spawning) {
        spawn.spawning.setDirections(spawningDirections);
      }
    });
  },
  recruitCreep,
};
