const { findStructuresInRange } = require("./Creep");
const { obtainResource, transferResource } = require("./CreepResource");
const { getTeam } = require("./squad");
const {
  getFreeCapacity,
  getCapacity,
  storeHasSpace,
} = require("./util.resourceManager");
const {
  getSpawns,
  getExtensions,
  getStorage,
} = require("./util.structureFinder");

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
 * Adjust miner so that it stays on top of a container
 * @param {Creep} creep
 */
const adjustPosition = (creep) => {
  switch (creep.room.name) {
    case "W35N43":
      if (creep.memory.srcIndex == 0 && creep.pos.x != 19) {
        creep.moveTo(19, 15, creep.room.name);
      }
      break;
    case "W34N43":
      if (creep.memory.srcIndex == 0 && creep.pos.y != 14) {
        creep.moveTo(44, 14, creep.room.name);
      }
      if (creep.memory.srcIndex == 1 && creep.pos.y != 27) {
        creep.moveTo(27, 35, creep.room.name);
      }
      break;
    case "W38N43":
      if (creep.memory.srcIndex == 1 && creep.pos.x != 46) {
        creep.moveTo(46, 13, creep.room.name);
      }
      break;
    case "W37N43":
      if (creep.memory.srcIndex == 0 && creep.pos.x != 19) {
        creep.moveTo(19, 4, creep.room.name);
      }
      break;
    default:
      break;
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
    let nearbyLinks = findStructuresInRange(creep, STRUCTURE_LINK, 2).filter(
      (s) => getFreeCapacity(s) >= getCapacity(creep)
    );
    let nearbyContainers = findStructuresInRange(
      creep,
      STRUCTURE_CONTAINER,
      2
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

      let storage = getStorage(creep.room);
      if (storage) return storage;
    }
  }
};

module.exports = {
  /** @param {Creep} creep **/
  run: function (creep) {
    assignSrcIndex(creep);
    adjustPosition(creep);
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
