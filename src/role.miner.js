const roomConfig = require("./dashboard");
const { obtainResource } = require("./role.creepManager");
const {
  getContainers,
  structureHasFreeCapacity,
  getSpawns,
} = require("./util.structureFinder");

const findTarget = (creep) => {
  if (creep) {
    let containersNotFull = _.filter(
      getContainers(creep.room),
      structureHasFreeCapacity
    );
    if (containersNotFull.length > 0) {
      return creep.pos.findClosestByRange(containersNotFull);
    }
    var spawnsNotFull = _.filter(
      getSpawns(creep.room),
      structureHasFreeCapacity
    );
    if (spawnsNotFull.length > 0) {
      return creep.pos.findClosestByRange(spawnsNotFull);
    }
  }
};

var roleMiner = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      obtainResource(
        creep,
        ["source"],
        roomConfig[creep.room.name].MINER_SOURCE_INDEX
      );
    } else {
      let target = findTarget(creep);
      transferEnergyToTarget(creep, target);
    }
  },
};

module.exports = roleMiner;
