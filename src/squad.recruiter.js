const roomConfig = require("./dashboard");
const { getTeam } = require("./squad");
const {
  buildBodyParts,
  getModelCost,
  getCreepSpawningTime,
} = require("./squad.creepModelAnalyzer");
const MODELS = require("./squad.creepModels");
const { getEnergyAvailable } = require("./util.resourceManager");
const { getSpawnByName } = require("./util.structureFinder");

// TODO: better define creepModel in JSDocs
/**
 * Recruit a creep to given role with desired model design
 * @param {object.<string, object.<string, number>>} creepModel the creep
 *   model with name and body parts
 * @param {string} creepRole the role to assign to the creep
 */
function recruitCreep(creepModel, creepRole, roomName) {
  const { spawnNames, debugMode } = roomConfig[roomName].spawn;
  var newCreepName = creepModel.name + "-" + (Game.time % 100);
  if (debugMode) {
    console.log(`TEST Spawning new ${creepRole}: ${newCreepName}`);
  } else {
    console.log(
      `${roomName} Spawning new ${creepRole}: ` +
        newCreepName +
        ` (${getModelCost(creepModel)})`
    );
    getSpawnByName(spawnNames[0]).spawnCreep(
      buildBodyParts(creepModel),
      newCreepName,
      {
        memory: { role: creepRole },
      }
    );
  }
}

/**
 * Determine if it's okay to recruit in advance
 * @param {object.<string, Creep>} currentTeam current team of same role
 * @param {number} maxTeamSize max allowed team size
 * @param {number} newCreepReadyTime time for new creep to get ready to work
 * @returns true if all in-advance recruit requirements met, false otherwise
 */
function recruitInAdvanceOk(currentTeam, maxTeamSize, newCreepReadyTime) {
  return (
    currentTeam.length < maxTeamSize ||
    (currentTeam.length == maxTeamSize &&
      currentTeam.length > 0 &&
      currentTeam[0].ticksToLive < newCreepReadyTime)
  );
}

/** Recruit harvesters */
function recruitHarvesters(roomName) {
  const { currentModel, teamSize } = roomConfig[roomName].harvester;
  if (getTeam("harvester", roomName).length < teamSize) {
    if (getEnergyAvailable(Game.rooms[roomName]) >= 450) {
      recruitCreep(currentModel, "harvester", roomName);
    } else {
      recruitCreep(MODELS.CARRIER_2A, "harvester", roomName);
    }
  }
}

/** Recruit builders */
function recruitBuilders(roomName) {
  let constructionsInRoom = Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES);
  if (constructionsInRoom.length > 0) {
    const { currentModel, teamSize } = roomConfig[roomName].builder;
    if (
      recruitInAdvanceOk(
        getTeam("builder", roomName),
        teamSize,
        getCreepSpawningTime(currentModel)
      )
    ) {
      recruitCreep(currentModel, "builder", roomName);
    }
  }
}

/** Recruit upgraders */
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
    recruitCreep(currentModel, "upgrader", roomName);
  }
}

/** Recruit repairers */
function recruitRepairers(roomName) {
  const { currentModel, teamSize, spawnCycle } = roomConfig[roomName].repairer;
  if (
    getTeam("repairer", roomName).length < teamSize &&
    Game.time % spawnCycle == 0
  ) {
    recruitCreep(currentModel, "repairer", roomName);
  }
}

/** Recruit miners */
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
    recruitCreep(currentModel, "miner", roomName);
  }
}

/** Recruit transferers */
function recruitTransferers(roomName) {
  const { currentModel, teamSize } = roomConfig[roomName].transferer;
  if (
    recruitInAdvanceOk(
      getTeam("transferer", "all"),
      teamSize,
      getCreepSpawningTime(currentModel)
    )
  ) {
    recruitCreep(currentModel, "transferer", roomName);
  }
}

/**
 * Recruit creeps for a room based on its config parameters
 * @param {string} roomName
 */
function recruitForRoom(roomName) {
  recruitHarvesters(roomName);
  recruitMiners(roomName);
  recruitUpgraders(roomName);
  recruitBuilders(roomName);
  recruitRepairers(roomName);
  if (roomName == "W35N43") {
    recruitTransferers(roomName);
  }
}

var squadRecruiter = {
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

module.exports = squadRecruiter;
