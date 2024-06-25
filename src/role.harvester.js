const roomConfig = require("./dashboard");
const { obtainResource, transferTo } = require("./role.creepManager");
const {
  getTowers,
  getStorage,
  getExtensions,
  getSpawns,
  structureHasFreeCapacity,
} = require("./util.structureFinder");

const findTarget = (creep) => {
  if (creep) {
    var extensionsNotFull = _.filter(getExtensions(creep.room), (s) =>
      structureHasFreeCapacity(s)
    );
    if (extensionsNotFull.length > 0) {
      return creep.pos.findClosestByRange(extensionsNotFull);
    }

    var spawnsNotFull = _.filter(getSpawns(creep.room), (s) =>
      structureHasFreeCapacity(s)
    );
    if (spawnsNotFull.length > 0) {
      return creep.pos.findClosestByRange(spawnsNotFull);
    }

    var towersNotFull = _.filter(getTowers(creep.room), (s) =>
      structureHasFreeCapacity(s)
    );
    if (towersNotFull.length > 0) {
      return creep.pos.findClosestByRange(towersNotFull);
    }

    var storage = getStorage(creep.room);
    if (storage) {
      return storage;
    }
  }
};

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > creep.store.getCapacity() * 0.7) {
      obtainResource(
        creep,
        roomConfig.defaultHarvesterSourceOrigins,
        roomConfig[creep.room.name].harvester.sourceIndex
      );
    } else {
      let target = findTarget(creep);
      transferTo(creep, target);
    }
  },
};

module.exports = roleHarvester;
