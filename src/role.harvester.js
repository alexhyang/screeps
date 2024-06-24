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
    var extensionsNotFull = _.filter(
      getExtensions(creep.room),
      structureHasFreeCapacity
    );
    if (extensionsNotFull.length > 0) {
      return creep.pos.findClosestByRange(extensionsNotFull);
    }

    var spawnsNotFull = _.filter(
      getSpawns(creep.room),
      structureHasFreeCapacity
    );
    if (spawnsNotFull.length > 0) {
      return creep.pos.findClosestByRange(spawnsNotFull);
    }

    var towersNotFull = _.filter(
      getTowers(creep.room),
      structureHasFreeCapacity
    );
    if (towersNotFull.length > 0) {
      return towersNotFull;
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
        [
          "droppedResources",
          "tombstone",
          "ruin",
          "container",
          "storage",
          "source",
        ],
        roomConfig[creep.room.name].HARVESTER_SOURCE_INDEX
      );
    } else {
      let target = findTarget(creep);
      transferTo(creep, target);
    }
  },
};

module.exports = roleHarvester;
