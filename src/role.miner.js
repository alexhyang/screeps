const roomConfig = require("./dashboard");
const { obtainResource, transferTo } = require("./role.creepManager");
const {
  getContainers,
  structureHasFreeCapacity,
  getSpawns,
  getExtensions,
} = require("./util.structureFinder");

const findTarget = (creep) => {
  if (creep) {
    let containersNotFull = _.filter(getContainers(creep.room), (s) =>
      structureHasFreeCapacity(s)
    );
    if (containersNotFull.length > 0) {
      return creep.pos.findClosestByRange(containersNotFull);
    }

    let extensionsNotFull = _.filter(getExtensions(creep.room), (s) =>
      structureHasFreeCapacity(s)
    );
    if (extensionsNotFull.length > 0) {
      return creep.pos.findClosestByRange(extensionsNotFull);
    }

    let spawnsNotFull = _.filter(getSpawns(creep.room), (s) =>
      structureHasFreeCapacity(s)
    );
    if (spawnsNotFull.length > 0) {
      return creep.pos.findClosestByRange(spawnsNotFull);
    }
  }
};

var roleMiner = {
  /** @param {Creep} creep **/
  run: function (creep) {
    const { MINER_SOURCE_ORIGINS, MINER_SOURCE_INDEX } =
      roomConfig[creep.room.name];
    if (creep.store.getFreeCapacity() > 0) {
      obtainResource(creep, MINER_SOURCE_ORIGINS, MINER_SOURCE_INDEX);
    } else {
      let target = findTarget(creep);
      transferTo(creep, target);
    }
  },
};

module.exports = roleMiner;
