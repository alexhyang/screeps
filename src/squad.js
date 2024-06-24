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
    changeCreepRole(creep, newRole);
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
  getCreep,
  changeCreepRoleByName,
  changeCreepRole,
};
