const {
  assignCreepToObtainEnergyFromSource,
  transferEnergyToTarget,
} = require("./squad.resourceManager");

const { MINER_SOURCE_INDEX } = require("./dashboard");
const {
  getContainers,
  structureHasFreeCapacity,
} = require("./util.structureFinder");

const findTarget = (creep) => {
  if (creep) {
    let containersNotFull = _.filter(getContainers(), structureHasFreeCapacity);
    if (containersNotFull.length > 0) {
      return creep.pos.findClosestByRange(containersNotFull);
    }

    var spawnsNotFull = _.filter(getSpawns(), structureHasFreeCapacity);
    if (spawnsNotFull.length > 0) {
      return creep.pos.findClosestByRange(spawnsNotFull);
    }
  }
};

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      assignCreepToObtainEnergyFromSource(creep, MINER_SOURCE_INDEX);
    } else {
      let target = findTarget(creep);
      transferEnergyToTarget(creep, target);
    }
  },
};

module.exports = roleHarvester;
