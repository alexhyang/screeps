const roomConfig = require("./dashboard");
const {
  roleHarvester,
  roleUpgrader,
  roleBuilder,
  roleRepairer,
  roleMiner,
} = require("./role");

/**
 * Assign jos to creeps based on their roles
 */
const assignJobs = () => {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    switch (creep.memory.role) {
      case "harvester":
        roleHarvester.run(creep);
        break;
      case "upgrader":
        roleUpgrader.run(creep);
        break;
      case "builder":
        roleBuilder.run(creep);
        break;
      case "repairer":
        roleRepairer.run(creep);
        break;
      case "miner":
        roleMiner.run(creep);
        break;
      default:
        break;
    }
  }
};

/**
 * Get all creeps by role
 * @param {string} creepRole
 * @returns {Object<string, Creep>} a hash containing creeps given their role
 **/
const getTeam = (creepRole, roomName) => {
  return _.filter(
    Game.creeps,
    (creep) => creep.memory.role == creepRole && creep.room.name == roomName
  );
};

/**
 * Get the max size of team in a rom
 * @param {string} creepRole
 * @param {string} roomName
 * @returns {number} the max size of the team with the given role in the
 *    specified room, or -1 if no config constant can be found
 */
const getTeamMaxSize = (creepRole, roomName) => {
  const { harvester, builder, upgrader, repairer, miner } =
    roomConfig[roomName];
  switch (creepRole) {
    case "harvester":
      return harvester.teamSize;
    case "builder":
      return builder.teamSize;
    case "upgrader":
      return upgrader.teamSize;
    case "repairer":
      return repairer.teamSize;
    case "miner":
      return miner.teamSize;
    default:
      return -1;
  }
};

/**
 * Get creep by name
 * @param {string} creepName name of the creep to find
 * @returns creep with the given name, undefined if not found
 */
const getCreep = (creepName) => {
  return Game.creeps[creepName];
};

/**
 * Change the role of a creep with given name
 * @param {string} creepName name of the creep
 * @param {string} newRole new role
 */
const changeCreepRoleByName = (creepName, newRole) => {
  let creep = getCreep(creepName);
  if (creep) {
    let changeAllowed = roomConfig[creep.room.name].spawn.debugMode;
    if (changeAllowed) {
      changeCreepRole(creep, newRole);
    } else {
      console.log(
        "Change Rejected! Turn on debug mode for room: ",
        creep.room.name
      );
      console.log("\n");
    }
  }
};

/**
 * Change the role of a creep
 * @param {Creep} creep
 * @param {string} newRole new role
 */
const changeCreepRole = (creep, newRole) => {
  creep.memory = { role: newRole };
};

module.exports = {
  assignJobs,
  getTeam,
  getTeamMaxSize,
  getCreep,
  changeCreepRoleByName,
  changeCreepRole,
};
