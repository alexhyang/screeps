const roomConfig = require("./dashboard");
const { getTeam } = require("./squad");
const { getBodyParts } = require("./util.modelManager");
const { getSpawnByName } = require("./util.structureFinder");

// TODO: better define creepModel in JSDocs
/**
 * Recruit a creep to given role with desired model design
 * @param {object.<string, object.<string, number>>} creepModel the creep
 *   model with name and body parts
 * @param {string} creepRole the role to assign to the creep
 */
function recruitCreep(creepModel, creepRole, roomName) {
  let spawnName = roomConfig[roomName].SPAWN_NAME;
  var newCreepName = creepModel.name + "-" + (Game.time % 100);
  if (roomConfig[roomName].DEBUG_SPAWN) {
    console.log(`TEST: Spawning new ${creepRole}: ` + newCreepName);
  } else {
    console.log(`Spawning new ${creepRole}: ` + newCreepName);
    getSpawnByName(spawnName).spawnCreep(
      getBodyParts(creepModel),
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
  if (
    getTeam("harvester", roomName).length <
    roomConfig[roomName].HARVESTER_TEAM_SIZE
  ) {
    recruitCreep(roomConfig[roomName].HARVESTER_CURRENT_MODEL, "harvester");
  }
}

/** Recruit builders */
function recruitBuilders(roomName) {
  if (
    Object.keys(Game.constructionSites).length > 0 &&
    recruitInAdvanceOk(
      getTeam("builder", roomName),
      roomConfig[roomName].BUILDER_TEAM_SIZE,
      roomConfig[roomName].NEW_BUILDER_READY_TIME
    )
  ) {
    recruitCreep(roomConfig[roomName].BUILDER_CURRENT_MODEL, "builder");
  }
}

/** Recruit upgraders */
function recruitUpgraders(roomName) {
  if (
    recruitInAdvanceOk(
      getTeam("upgrader", roomName),
      roomConfig[roomName].UPGRADER_TEAM_SIZE,
      roomConfig[roomName].NEW_UPGRADER_READY_TIME
    )
  ) {
    recruitCreep(roomConfig[roomName].UPGRADER_CURRENT_MODEL, "upgrader");
  }
}

/** Recruit repairers */
function recruitRepairers(roomName) {
  if (
    getTeam("repairer").length < roomConfig[roomName].REPAIRER_TEAM_SIZE &&
    Game.time % roomConfig[roomName].REPAIRER_RESPAWN_GAP == 0
  ) {
    recruitCreep(roomConfig[roomName].REPAIRER_CURRENT_MODEL, "repairer");
  }
}

/** Recruit miners */
function recruitMiners(roomName) {
  if (
    recruitInAdvanceOk(
      getTeam("miner", roomName),
      roomConfig[roomName].MINER_TEAM_SIZE,
      roomConfig[roomName].NEW_MINER_READY_TIME
    )
  ) {
    recruitCreep(roomConfig[roomName].MINER_CURRENT_MODEL, "miner");
  }
}

var squadRecruiter = {
  repairerSpawnCycle: roomConfig.CREEP_LIFE + roomConfig.REPAIRER_SPAWN_DELAY,

  run: (roomName) => {
    recruitHarvesters(roomName);
    recruitMiners(roomName);
    recruitUpgraders(roomName);
    recruitRepairers(roomName);
    recruitBuilders(roomName);
    let spawn = getSpawnByName(roomConfig[roomName].SPAWN_NAME);
    if (spawn && spawn.spawning) {
      spawn.spawning.setDirections(roomConfig[roomName].SPAWNING_DIRECTIONS);
    }
  },
  recruitCreep,
};

module.exports = squadRecruiter;
