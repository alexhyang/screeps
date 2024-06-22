const {
  assignCreepToObtainEnergyFromSource,
  assignCreepToObtainEnergyFromContainer,
  assignCreepToObtainEnergyFromTombstone,
  assignCreepToObtainEnergyFromRuin,
  assignCreepToObtainEnergyFromStorage,
  withdrawFromContainerOk,
  transferEnergyToTarget,
} = require("./squad.resourceManager");

const { HARVESTER_SOURCE_INDEX } = require("./dashboard");
const {
  getTowers,
  getStorage,
  getExtensions,
  getSpawns,
  structureHasFreeCapacity,
} = require("./util.structureFinder");

const findTarget = (creep) => {
  if (creep) {
    var extensionsNotFull = _.filter(getExtensions(), structureHasFreeCapacity);
    if (extensionsNotFull.length > 0) {
      return creep.pos.findClosestByRange(extensionsNotFull);
    }

    var spawnsNotFull = _.filter(getSpawns(), structureHasFreeCapacity);
    if (spawnsNotFull.length > 0) {
      return creep.pos.findClosestByRange(spawnsNotFull);
    }

    var towersNotFull = _.filter(getTowers(), structureHasFreeCapacity);
    if (towersNotFull.length > 0) {
      return towersNotFull;
    }

    return getStorage();
  }
};

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > creep.store.getCapacity() * 0.7) {
      assignCreepToObtainEnergyFromTombstone(creep) ||
        assignCreepToObtainEnergyFromRuin(creep) ||
        (withdrawFromContainerOk() &&
          assignCreepToObtainEnergyFromContainer(creep)) ||
        assignCreepToObtainEnergyFromStorage(creep) ||
        assignCreepToObtainEnergyFromSource(creep, HARVESTER_SOURCE_INDEX);
    } else {
      let target = findTarget(creep);
      transferEnergyToTarget(creep, target);
    }
  },
};

module.exports = roleHarvester;
