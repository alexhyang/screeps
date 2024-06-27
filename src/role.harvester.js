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

/**
 * Find the delivery target for the harvester creep
 * @param {Creep} creep
 * @param {string} resourceType
 * @returns {(Structure | undefined)} target to delivery resource,
 *    or undefined if not found
 */
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
      structureHasFreeCapacity(s, 200)
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

/**
 * Determine if the harvester creep should harvest resource right now
 * @param {Creep} creep
 * @returns {boolean} true if the creep should harvest resource,
 *    or false otherwise
 */
const harvestOk = (creep) => {
  if (creep) {
    let creepCapacity = creep.store.getCapacity();
    let minUsedEnergyToHarvest =
      getTeam("miner", creep.room.name).length > 0
        ? 0.3 * creepCapacity
        : creepCapacity;
    return creep.store.getUsedCapacity() < minUsedEnergyToHarvest;
  }
};

module.exports = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (harvestOk(creep)) {
      const { sourceOrigins, sourceIndex } =
        roomConfig[creep.room.name].harvester;
      obtainResource(creep, sourceOrigins, sourceIndex);
    } else {
      let target = findDeliveryTarget(creep);
      transferTo(creep, target);
    }
  },
};
