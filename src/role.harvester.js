const roomConfig = require("./dashboard");
const { obtainResource, transferResource } = require("./CreepResource");
const { getTeam } = require("./squad");
const {
  getTowers,
  getStorage,
  structureHasFreeCapacity,
} = require("./util.structureFinder");

/**
 * Determine if a creep only carries energy
 * @param {Creep} creep
 * @returns {boolean} true if creep only carries energy, or false otherwise
 */
const isCreepOnlyCarryingEnergy = (creep) => {
  return (
    creep.store.getUsedCapacity() ==
    creep.store.getUsedCapacity(RESOURCE_ENERGY)
  );
};

/**
 * Find links in range of the creep
 * @param {Creep} creep
 * @param {number} range
 * @returns {StructureLink[]} an array of structure links in range, or empty
 *    array if not found
 */
const getLinksInRange = (creep, range) => {
  return creep.pos.findInRange(FIND_MY_STRUCTURES, range, {
    filter: { structureType: STRUCTURE_LINK },
  });
};

/**
 * Find spawns and extensions in room that are not full
 * @param {Room} room
 * @returns {Structure[]} an array of spawns and extensions that are not full,
 *    or empty array if not found
 */
const getSpawnsExtensionsNotFull = (room, resourceType = RESOURCE_ENERGY) => {
  return room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        (s.structureType == STRUCTURE_EXTENSION ||
          s.structureType == STRUCTURE_SPAWN) &&
        s.store.getFreeCapacity(resourceType) > 0
      );
    },
  });
};

/**
 * Find the delivery target for the harvester creep
 * @param {Creep} creep
 * @returns {(Structure | undefined)} target to delivery resource,
 *    or undefined if not found
 */
const findDeliveryTarget = (creep) => {
  if (creep) {
    let deliveryTarget = Game.getObjectById(creep.memory.deliveryTarget);
    if (deliveryTarget && deliveryTarget.store.getFreeCapacity() > 0) {
      return deliveryTarget;
    } else {
      delete creep.memory.deliveryTarget;
      if (isCreepOnlyCarryingEnergy(creep)) {
        let linkFrom = getLinksInRange(creep, 15)[0];
        if (
          linkFrom &&
          linkFrom.store.getFreeCapacity(RESOURCE_ENERGY) >=
            creep.store.getCapacity()
        ) {
          creep.memory.deliveryTarget = linkFrom.id;
          return linkFrom;
        }

        let spawnExtensionsNotFull = getSpawnsExtensionsNotFull(creep.room);
        if (spawnExtensionsNotFull.length > 0) {
          let target = creep.pos.findClosestByRange(spawnExtensionsNotFull);
          creep.memory.deliveryTarget = target.id;
          return target;
        }

        let towersNotFull = _.filter(getTowers(creep.room), (s) =>
          structureHasFreeCapacity(s, creep.store.getCapacity())
        );
        if (towersNotFull.length > 0) {
          return creep.pos.findClosestByRange(towersNotFull);
        }
      }

      let storage = getStorage(creep.room);
      if (storage) {
        return storage;
      }
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
      transferResource(creep, target);
    }
  },
};
