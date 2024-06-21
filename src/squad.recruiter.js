const dashboard = require("./dashboard");
const { getTeam } = require("./squad");
const { getBodyParts } = require("./util.modelManager");
const { getSpawn } = require("./util.structureFinder");

// finish container repair at ~1340
let newBuilderReadyTime = 10;
let newMinerReadyTime = 25;
let newUpgraderReadyTime = 57;

/**
 * @param {object.<string, object.<string, number>>} creepModel
 * @param {string} creepRole
 */
function recruitCreep(creepModel, creepRole) {
  var newCreepName = creepModel.name + "-" + (Game.time % 1000);
  if (dashboard.DEBUG_SPAWN) {
    console.log(`TEST: Spawning new ${creepRole}: ` + newCreepName);
  } else {
    console.log(`Spawning new ${creepRole}: ` + newCreepName);
    console.log(getBodyParts(creepModel));
    console.log(getBodyParts(creepModel).length);
    console.log(typeof getBodyParts(creepModel));
    getSpawn("Spawn1").spawnCreep(getBodyParts(creepModel), newCreepName, {
      memory: { role: creepRole },
    });
  }
}

function recruitHarvesters() {
  if (getTeam("harvester").length < dashboard.HARVESTER_TEAM_SIZE) {
    recruitCreep(dashboard.HARVESTER_CURRENT_MODEL, "harvester");
  }
}

function recruitBuilders() {
  let builders = getTeam("builder");
  if (
    Object.keys(Game.constructionSites).length > 0 &&
    (builders.length < dashboard.BUILDER_TEAM_SIZE ||
      (builders.length == dashboard.BUILDER_TEAM_SIZE &&
        builders[0].ticksToLive < newBuilderReadyTime))
  ) {
    recruitCreep(dashboard.BUILDER_CURRENT_MODEL, "builder");
  }
}

function recruitUpgraders() {
  let upgraders = getTeam("upgrader");
  if (
    upgraders.length < dashboard.UPGRADER_TEAM_SIZE ||
    (upgraders.length == dashboard.UPGRADER_TEAM_SIZE &&
      upgraders[0].ticksToLive < newUpgraderReadyTime)
  ) {
    recruitCreep(dashboard.UPGRADER_CURRENT_MODEL, "upgrader");
  }
}

function recruitRepairers() {
  if (
    Game.time % squadRecruiter.repairerSpawnCycle == 0 &&
    getTeam("repairer").length < dashboard.REPAIRER_TEAM_SIZE
  ) {
    recruitCreep(dashboard.REPAIRER_CURRENT_MODEL, "repairer");
  }
}

function recruitMiners() {
  let miners = getTeam("miner");
  if (
    miners.length < dashboard.MINER_TEAM_SIZE ||
    (miners.length == dashboard.MINER_TEAM_SIZE &&
      miners[0].ticksToLive < newMinerReadyTime)
  ) {
    // it takes M1150 about 50 seconds to spawn and get ready to work
    recruitCreep(dashboard.MINER_CURRENT_MODEL, "miner");
  }
}

var squadRecruiter = {
  repairerSpawnCycle: dashboard.CREEP_LIFE + dashboard.REPAIRER_SPAWN_DELAY,

  run: () => {
    recruitHarvesters();
    recruitMiners();
    recruitUpgraders();
    recruitRepairers();
    recruitBuilders();
    let spawn = getSpawn(dashboard.SPAWN_NAME);
    if (spawn.spawning) {
      spawn.spawning.setDirections(dashboard.SPAWNING_DIRECTIONS);
    }
  },
  getAvailableEnergy: function () {
    return Game.rooms[dashboard.ROOM_NUMBER].energyAvailable;
  },
  recruitOk: function (team, teamSize, dyingCreepTickLeft) {
    // this.recruitOk() doesn't work in recruitHarvesters(), etc.
    // fix it later
    return (
      team.length < teamSize ||
      (team.length == teamSize && team[0].ticksToLive <= dyingCreepTickLeft)
    );
  },
};

module.exports = squadRecruiter;
