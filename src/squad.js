const {
  roleHarvester,
  roleUpgrader,
  roleBuilder,
  roleRepairer,
  roleMiner,
  rolePicker,
} = require("./role");

var squad = {
  assignJobs: function () {
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
        case "picker":
          rolePicker.run(creep);
          break;
        default:
          break;
      }
    }
  },
  /**
   * @param {string} creepRole
   * @returns {Object<string, Creep>} a hash containing creeps given their role
   **/
  getTeam: function (creepRole) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == creepRole);
  },
  getCreep: (creepName) => {
    return Game.creeps[creepName];
  },
};

module.exports = squad;
