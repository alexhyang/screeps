const roomConfig = require("./dashboard");
const { obtainResource, transferTo } = require("./role.creepManager");
const { getTeam } = require("./squad");
const {
  getTowers,
  getStorage,
  getExtensions,
  getSpawns,
  structureHasFreeCapacity,
} = require("./util.structureFinder");

const findDeliveryTarget = (creep, resourceType = RESOURCE_ENERGY) => {
  if (creep) {
    let spawnExtensionsNotFull = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          (s.structureType == STRUCTURE_EXTENSION ||
            s.structureType == STRUCTURE_SPAWN) &&
          s.store.getFreeCapacity(resourceType) > 0
        );
      },
    });
    if (spawnExtensionsNotFull.length > 0) {
      return creep.pos.findClosestByRange(spawnExtensionsNotFull);
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

const harvesterDeliveryOk = (creep) => {
  let deliveryThreshold =
    getTeam("miner", creep.room.name).length > 0 ? 0.7 : 0;
  return creep.store.getFreeCapacity() > deliveryThreshold;
};

module.exports = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (harvesterDeliveryOk(creep)) {
      const { sourceOrigins, sourceIndex } =
        roomConfig[creep.room.name].harvester;
      obtainResource(creep, sourceOrigins, sourceIndex);
    } else {
      let target = findDeliveryTarget(creep);
      transferTo(creep, target);
    }
  },
};
