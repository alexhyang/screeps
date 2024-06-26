const roomConfig = require("./dashboard");
const { getTeam } = require("./squad");
const { buildBodyParts } = require("./squad.creepModelAnalyzer");
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
    console.log(`${roomName} debug mode is on`);
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
    recruitCreep(currentModel, "harvester", roomName);
  }
}

/** Recruit builders */
function recruitBuilders(roomName) {
  // TODO: fix find construction sites later
  if (Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES) != null) {
    const { currentModel, teamSize, creepReadyTime } =
      roomConfig[roomName].builder;
    if (
      Object.keys(Game.constructionSites).length > 0 &&
      recruitInAdvanceOk(getTeam("builder", roomName), teamSize, creepReadyTime)
    ) {
      recruitCreep(currentModel, "builder", roomName);
    }
  }
}

/** Recruit upgraders */
function recruitUpgraders(roomName) {
  const { currentModel, teamSize, creepReadyTime } =
    roomConfig[roomName].upgrader;
  if (
    recruitInAdvanceOk(getTeam("upgrader", roomName), teamSize, creepReadyTime)
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
  const { currentModel, teamSize, creepReadyTime } = roomConfig[roomName].miner;
  if (
    recruitInAdvanceOk(getTeam("miner", roomName), teamSize, creepReadyTime)
  ) {
    recruitCreep(currentModel, "miner", roomName);
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
}

var squadRecruiter = {
  run: () => {
    for (let roomName in roomConfig) {
      recruitForRoom(roomName);
    }
  },
  recruitCreep,
};

module.exports = squadRecruiter;
