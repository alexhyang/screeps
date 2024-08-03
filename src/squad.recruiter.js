const roomConfig = require("./dashboard");
const { getTeam } = require("./squad");
const {
  buildBodyParts,
  getModelCost,
  getCreepSpawningTime,
} = require("./squad.creepModelAnalyzer");
const MODELS = require("./squad.creepModels");
const { getEnergyAvailable } = require("./util.resourceManager");
const { getSpawnByName, getExtractor } = require("./util.structureFinder");

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

// TODO: better define creepModel in JSDocs
/**
 * Recruit a creep to given role with desired model design
 * @param {object.<string, object.<string, number>>} creepModel the creep
 *   model with name and body parts
 * @param {string} creepRole
 * @param {string} roomName
 * @param {string} [creepName]
 * @param {string} [srcIndex]
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitCreep(creepModel, creepRole, roomName, creepName, srcIndex) {
  const { spawnNames, debugMode } = roomConfig[roomName].spawn;
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
 * Recruit harvesters
 * @param {string} roomName
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitHarvesters(roomName) {
  const { currentModel, teamSize } = roomConfig[roomName].harvester;
  if (
    recruitInAdvanceOk(
      getTeam("harvester", roomName),
      teamSize,
      getCreepSpawningTime(currentModel)
    )
  ) {
    let energyAvailable = getEnergyAvailable(Game.rooms[roomName]);
    if (energyAvailable >= getModelCost(currentModel)) {
      return recruitCreep(currentModel, "harvester", roomName);
    } else if (energyAvailable >= getModelCost(MODELS.CARRIER_6)) {
      return recruitCreep(MODELS.CARRIER_6, "harvester", roomName);
    } else if (energyAvailable >= getModelCost(MODELS.CARRIER_3)) {
      return recruitCreep(MODELS.CARRIER_3, "harvester", roomName);
    } else {
      return recruitCreep(MODELS.CARRIER_1, "harvester", roomName);
    }
  }
  return false;
}

/**
 * Recruit builders
 * @param {string} roomName
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitBuilders(roomName) {
  let room = Game.rooms[roomName];
  if (room) {
    let constructionsInRoom = room.find(FIND_CONSTRUCTION_SITES);
    if (constructionsInRoom.length > 0) {
      const { currentModel, teamSize } = roomConfig[roomName].builder;
      if (
        recruitInAdvanceOk(
          getTeam("builder", roomName),
          teamSize,
          getCreepSpawningTime(currentModel)
        )
      ) {
        return recruitCreep(currentModel, "builder", roomName);
      }
    }
  }
  return false;
}

/**
 * Recruit upgraders
 * @param {string} roomName
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitUpgraders(roomName) {
  const { currentModel, teamSize, distanceToSource } =
    roomConfig[roomName].upgrader;
  if (
    recruitInAdvanceOk(
      getTeam("upgrader", roomName),
      teamSize,
      getCreepSpawningTime(currentModel) + distanceToSource
    )
  ) {
    return recruitCreep(currentModel, "upgrader", roomName);
  }
  return false;
}

/**
 * Recruit repairers
 * @param {string} roomName
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitRepairers(roomName) {
  const { currentModel, teamSize, spawnCycle } = roomConfig[roomName].repairer;
  if (
    getTeam("repairer", roomName).length < teamSize &&
    Game.time % spawnCycle == 0
  ) {
    return recruitCreep(currentModel, "repairer", roomName);
  }
  return false;
}

/**
 * Recruit miners
 * @param {string} roomName
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitMiners(roomName) {
  const { currentModel, teamSize, distanceToSource } =
    roomConfig[roomName].miner;
  if (
    recruitInAdvanceOk(
      getTeam("miner", roomName),
      teamSize,
      getCreepSpawningTime(currentModel) + distanceToSource
    )
  ) {
    let energyAvailable = getEnergyAvailable(Game.rooms[roomName]);
    if (energyAvailable >= getModelCost(currentModel)) {
      return recruitCreep(currentModel, "miner", roomName);
    } else if (energyAvailable >= getModelCost(MODELS.WORKER_5B)) {
      return recruitCreep(MODELS.WORKER_5B, "miner", roomName);
    } else if (energyAvailable >= getModelCost(MODELS.WORKER_3)) {
      return recruitCreep(MODELS.WORKER_3, "miner", roomName);
    } else {
      return recruitCreep(MODELS.WORKER_2B, "miner", roomName);
    }
  }
  return false;
}

/**
 * Recruit transferrers
 * @param {string} roomName
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitTransferrers(roomName) {
  const { currentModel, teamSize } = roomConfig[roomName].transferrer;
  if (
    recruitInAdvanceOk(
      getTeam("transferrer", "all"),
      teamSize,
      getCreepSpawningTime(currentModel)
    )
  ) {
    return recruitCreep(currentModel, "transferrer", roomName);
  }
  return false;
}

/**
 * Recruit extractors
 * @param {string} roomName
 * @returns {boolean} true if the recruit is successful, false otherwise
 */
function recruitExtractor(roomName) {
  const { currentModel, teamSize, distanceToSource } =
    roomConfig[roomName].extractor;
  let room = Game.rooms[roomName];

  if (room) {
    let mineral = room.find(FIND_MINERALS)[0];

    if (
      mineral.mineralAmount > 0 &&
      getExtractor(room) &&
      recruitInAdvanceOk(
        getTeam("extractor", roomName),
        teamSize,
        getCreepSpawningTime(currentModel) + distanceToSource
      )
    ) {
      return recruitCreep(currentModel, "extractor", roomName);
    }
  }
  return false;
}

/**
 * recruit army when two or more hostile creeps show up
 * @param {string} roomName
 * @returns {boolean} true if recruit job assigned successfully,
 *    false otherwise
 */
function recruitArmy(roomName) {
  let hostileCreeps = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
  if (hostileCreeps.length > 1 && getTeam("army", roomName).length == 0) {
    recruitCreep(MODELS.DEFENDER2, "army", roomName);
    return true;
  }
  return false;
}

/**
 * Recruit creeps for a room based on its config parameters
 * @param {string} roomName
 */
function recruitForRoom(roomName) {
  // TODO: fix the logic here, when miners are supposed to be recruited
  //   but there is not enough energy, the first if-condition returns false
  //   the spawn therefore will try to recruit upgraders instead
  if (recruitArmy(roomName)) {
    return;
  }
  if (recruitHarvesters(roomName) || recruitMiners(roomName)) {
    return;
  }
  if (recruitUpgraders(roomName)) {
    return;
  }
  if (recruitExtractor(roomName)) {
    return;
  }
  if (recruitRepairers(roomName) || recruitBuilders(roomName)) {
    return;
  }
  if (roomName == "W35N43") {
    recruitTransferrers(roomName);
  }
}

module.exports = {
  run: () => {
    for (let roomName in roomConfig) {
      const { debugMode, spawnNames, spawningDirections } =
        roomConfig[roomName].spawn;
      if (debugMode) {
        console.log(`Room ${roomName} spawning debug mode is on`);
      }
      recruitForRoom(roomName);
      let spawn = getSpawnByName(spawnNames[0]);
      if (spawn && spawn.spawning) {
        spawn.spawning.setDirections(spawningDirections);
      }
    }
  },
  recruitCreep,
};
