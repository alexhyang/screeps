const {
  ROOM_NUMBER,
  SPAWN_WITHDRAW_THRESHOLD,
  CONTAINER_WITHDRAW_THRESHOLD,
} = require("./dashboard");

let resources = {
  /** @returns {boolean} */
  withdrawFromSpawnOk: function () {
    let energyAvailable = Game.rooms[ROOM_NUMBER].energyAvailable;
    return energyAvailable >= SPAWN_WITHDRAW_THRESHOLD;
  },
  /** @returns {boolean} */
  withdrawFromContainerOk: function () {
    let containers = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER,
    });
    let container = containers[0];
    return (
      container.store.getUsedCapacity(RESOURCE_ENERGY) >=
      CONTAINER_WITHDRAW_THRESHOLD
    );
  },
  /**
   * @param {Creep} creep
   * @returns {boolean} whether the assignment is successful
   */
  assignCreepToObtainEnergyFromSpawn: function (creep) {
    var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
    if (
      creep.withdraw(spawn, RESOURCE_ENERGY) !== OK ||
      creep.pos.getRangeTo(spawn) !== 1
    ) {
      creep.moveTo(spawn, {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
      return true;
    } else {
      return false;
    }
  },
  assignCreepToObtainEnergyFromRuin: function (creep) {
    var ruin = creep.room.find(FIND_RUINS)[0];
    if (
      ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&
      (creep.withdraw(ruin, RESOURCE_ENERGY) !== OK ||
        creep.pos.getRangeTo(ruin) !== 1)
    ) {
      creep.moveTo(ruin, {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
      return true;
    } else {
      return false;
    }
  },
  assignCreepToObtainEnergyFromTombstone: function (creep) {
    var tombstones = creep.room.find(FIND_TOMBSTONES);
    if (tombstones.length > 0) {
      let tombstone = tombstones[0];
      if (
        tombstone.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&
        (creep.withdraw(tombstone, RESOURCE_ENERGY) !== OK ||
          creep.pos.getRangeTo(tombstone) !== 1)
      ) {
        creep.moveTo(tombstone, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
      return true;
    } else {
      return false;
    }
  },
  withdrawEnergyFromStructure: function (creep, findCode) {
    var ruin = creep.room.find(FIND_RUINS)[0];
    if (
      creep.withdraw(ruin, RESOURCE_ENERGY) !== OK ||
      creep.pos.getRangeTo(ruin) !== 1
    ) {
      creep.moveTo(ruin, {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
      return true;
    } else {
      return false;
    }
  },
  /** @param {Creep} creep **/
  /** @param {number} sourceIndex the index of source **/
  assignCreepToObtainEnergyFromSource: function (creep, sourceIndex) {
    var sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[sourceIndex], {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
    }
  },
  /**
   * @param {Creep} creep
   * @param {number} sourceIndex the index of source
   * @returns {boolean} whether the assignment is successful
   */
  assignCreepToObtainEnergyFromContainer: function (creep) {
    var containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) =>
        structure.structureType == STRUCTURE_CONTAINER &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
    });
    _.sortBy(containers, (c) => c.store.getFreeCapacity());
    if (containers.length > 0) {
      let container = containers[containers.length - 1];
      if (
        creep.withdraw(container, RESOURCE_ENERGY) !== OK ||
        creep.pos.getRangeTo(container) !== 1
      ) {
        creep.moveTo(container, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
      return true;
    } else {
      return false;
    }
  },
  /**
   * @param {Creep} creep
   * @param {number} sourceIndex the index of source
   * @returns {boolean} whether the assignment is successful
   */
  assignCreepToObtainEnergyFromStorage: function (creep) {
    var storages = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) =>
        structure.structureType == STRUCTURE_STORAGE &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
    });
    if (storages.length > 0) {
      let storage = storages[0];
      if (
        creep.withdraw(storage, RESOURCE_ENERGY) !== OK ||
        creep.pos.getRangeTo(storage) !== 1
      ) {
        creep.moveTo(storage, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
      return true;
    } else {
      return false;
    }
  },
  pickupDroppedResources(creep) {
    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    if (target) {
      if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
      return true;
    } else {
      return false;
    }
  },
};

module.exports = resources;
