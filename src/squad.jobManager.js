const { getMyRooms } = require("./configAPI");
const {
  roleHarvester,
  roleUpgrader,
  roleBuilder,
  roleRepairer,
  roleMiner,
  roleTransferrer,
  roleExtractor,
  roleArmy,
} = require("./role");

/**
 * Assign jos to creeps based on their roles
 */
const assignJobs = () => {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (getMyRooms().includes(creep.room.name)) {
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
        case "transferrer":
          roleTransferrer.run(creep);
          break;
        case "extractor":
          roleExtractor.run(creep);
          break;
        case "army":
          roleArmy.run(creep);
          break;
        default:
          break;
      }
    } else {
      switch (creep.memory.role) {
        // case "repairer":
        //   roleRepairer.run(creep);
        //   break;
        // case "miner":
        //   roleMiner.run(creep);
        //   break;
        case "transferrer":
          roleTransferrer.run(creep);
          break;
        case "army":
          roleArmy.run(creep);
          break;
        default:
          break;
      }
    }
  }
};

module.exports = {
  assignJobs,
};
