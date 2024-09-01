const { getNearbyStructures } = require("./Creep");
const { obtainResource, transferResource } = require("./CreepResource");
const { getTeam } = require("./squad");
const {
  getFreeCapacity,
  getCapacity,
  storeHasSpace,
} = require("./util.resourceManager");
const { getSpawns, getExtensions } = require("./util.structureFinder");

/**
 * Set source index in creep memory
 * @param {Creep} creep
 * @param {number} index
 */
const setSrcIndex = (creep, index) => {
  creep.memory.srcIndex = index;
};

/**
 * Assign source index for newly recruited miner creep
 * @param {Creep} creep
 */
const assignSrcIndex = (creep) => {
  if (creep.memory.srcIndex == undefined) {
    let sources = creep.room.find(FIND_SOURCES);
    switch (sources.length) {
      case 1:
        setSrcIndex(creep, 0);
        return;
      case 2:
        let miners = getTeam("miner", creep.room.name);
        let index;
        switch (miners.length) {
          case 1:
            console.log("miner team size", miners.length, "assigning", 0);
            setSrcIndex(creep, 0);
            return;
          case 2:
            console.log("miner team size", miners.length, "assigning", index);
            index = miners[0].memory.srcIndex == 0 ? 1 : 0;
            setSrcIndex(creep, index);
            return;
          default:
            console.log("miner team size", miners.length, "assigning", index);
            let dyingMiner = miners[0];
            index =
              dyingMiner.memory.srcIndex == undefined
                ? 0
                : dyingMiner.memory.srcIndex;
            setSrcIndex(creep, index);
            return;
        }
      default:
        return;
    }
  }
};

/**
 * Find a target to deliver energy for the miner creep
 * @param {Creep} creep
 * @returns {(Structure | undefined)} target to deliver energy,
 *    or undefined if not find
 */
const findDeliveryTarget = (creep) => {
  if (creep) {
    let nearbyLinks = getNearbyStructures(creep, STRUCTURE_LINK).filter(
      (s) => getFreeCapacity(s) >= getCapacity(creep)
    );
    let nearbyContainers = getNearbyStructures(
      creep,
      STRUCTURE_CONTAINER
    ).filter((s) => getFreeCapacity(s) >= getCapacity(creep));

    if (nearbyLinks.length > 0) {
      return nearbyLinks[0];
    } else if (nearbyContainers.length > 0) {
      return nearbyContainers[0];
    } else {
      let extensionsNotFull = _.filter(getExtensions(creep.room), (s) =>
        storeHasSpace(s)
      );
      if (extensionsNotFull.length > 0) {
        return creep.pos.findClosestByRange(extensionsNotFull);
      }

      let spawnsNotFull = _.filter(getSpawns(creep.room), (s) =>
        storeHasSpace(s)
      );
      if (spawnsNotFull.length > 0) {
        return creep.pos.findClosestByRange(spawnsNotFull);
      }
    }
  }
};

module.exports = {
  /** @param {Creep} creep **/
  run: function (creep) {
    assignSrcIndex(creep);
    if (getFreeCapacity(creep) > 0) {
      obtainResource(creep, ["source"], creep.memory.srcIndex);
    } else {
      let target = findDeliveryTarget(creep);
      if (target) {
        transferResource(creep, target);
      }
    }
  },
};
