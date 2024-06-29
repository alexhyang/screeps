const {
  roleHarvester,
  roleUpgrader,
  roleBuilder,
  roleRepairer,
  roleMiner,
  roleTransferer,
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
      case "transferer":
        roleTransferer.run(creep);
        break;
      default:
        break;
    }
  }
};

module.exports = {
  assignJobs,
};
