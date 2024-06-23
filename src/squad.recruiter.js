const roomW36N43 = require("./dashboard");
const { getTeam } = require("./squad");
const { getBodyParts } = require("./util.modelManager");
const { getSpawn } = require("./util.structureFinder");

// TODO: better define creepModel in JSDocs
/**
 * Recruit a creep to given role with desired model design
 * @param {object.<string, object.<string, number>>} creepModel the creep
 *   model with name and body parts
 * @param {string} creepRole the role to assign to the creep
 */
function recruitCreep(creepModel, creepRole, spawn = "Spawn1") {
  var newCreepName = creepModel.name + "-" + (Game.time % 100);
  if (roomW36N43.DEBUG_SPAWN) {
    console.log(`TEST: Spawning new ${creepRole}: ` + newCreepName);
  } else {
    console.log(`Spawning new ${creepRole}: ` + newCreepName);
    getSpawn(spawn).spawnCreep(getBodyParts(creepModel), newCreepName, {
      memory: { role: creepRole },
    });
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
function recruitHarvesters() {
  if (getTeam("harvester").length < roomW36N43.HARVESTER_TEAM_SIZE) {
    recruitCreep(roomW36N43.HARVESTER_CURRENT_MODEL, "harvester");
  }
}

/** Recruit builders */
function recruitBuilders() {
  if (
    Object.keys(Game.constructionSites).length > 0 &&
    recruitInAdvanceOk(
      getTeam("builder"),
      roomW36N43.BUILDER_TEAM_SIZE,
      roomW36N43.NEW_BUILDER_READY_TIME
    )
  ) {
    recruitCreep(roomW36N43.BUILDER_CURRENT_MODEL, "builder");
  }
}

/** Recruit upgraders */
function recruitUpgraders() {
  if (
    recruitInAdvanceOk(
      getTeam("upgrader"),
      roomW36N43.UPGRADER_TEAM_SIZE,
      roomW36N43.NEW_UPGRADER_READY_TIME
    )
  ) {
    recruitCreep(roomW36N43.UPGRADER_CURRENT_MODEL, "upgrader");
  }
}

/** Recruit repairers */
function recruitRepairers() {
  if (
    getTeam("repairer").length < roomW36N43.REPAIRER_TEAM_SIZE &&
    Game.time % roomW36N43.REPAIRER_RESPAWN_GAP == 0
  ) {
    recruitCreep(roomW36N43.REPAIRER_CURRENT_MODEL, "repairer");
  }
}

/** Recruit miners */
function recruitMiners() {
  if (
    recruitInAdvanceOk(
      getTeam("miner"),
      roomW36N43.MINER_TEAM_SIZE,
      roomW36N43.NEW_MINER_READY_TIME
    )
  ) {
    recruitCreep(roomW36N43.MINER_CURRENT_MODEL, "miner");
  }
}

var squadRecruiter = {
  repairerSpawnCycle: roomW36N43.CREEP_LIFE + roomW36N43.REPAIRER_SPAWN_DELAY,

  run: () => {
    recruitHarvesters();
    recruitMiners();
    recruitUpgraders();
    recruitRepairers();
    recruitBuilders();
    let spawn = getSpawn(roomW36N43.SPAWN_NAME);
    if (spawn && spawn.spawning) {
      spawn.spawning.setDirections(roomW36N43.SPAWNING_DIRECTIONS);
    }
  },
};

module.exports = squadRecruiter;
