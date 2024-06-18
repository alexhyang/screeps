const {
  assignCreepToObtainEnergyFromSpawn,
  assignCreepToObtainEnergyFromSource,
  withdrawFromSpawnOk,
  assignCreepToObtainEnergyFromContainer,
  withdrawFromContainerOk,
  assignCreepToObtainEnergyFromStorage,
  pickupDroppedResources,
  assignCreepToObtainEnergyFromRuin,
  assignCreepToObtainEnergyFromTombstone,
} = require("./squad.resourceManager");
const {
  REPAIRER_SOURCE_INDEX,
  REPAIR_PRIORITY,
  REPAIR_HITS_THRESHOLD_RATIO,
  REPAIR_REGION_X_LOWER,
  REPAIR_REGION_X_UPPER,
  REPAIR_REGION_Y_LOWER,
  REPAIR_REGION_Y_UPPER,
} = require("./dashboard");

let roleRepairer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    this.updateRepairingStatus(creep);
    if (creep.memory.repairing) {
      this.repairConstruction(creep);
    } else {
      this.obtainEnergy(creep);
    }
  },
  updateRepairingStatus: function (creep) {
    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.repairing = false;
      creep.say("🔄 harvest");
    }

    if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
      creep.memory.repairing = true;
      creep.say("🚧 repair");
    }
  },
  repairConstruction: function (creep) {
    let targets = this.findTargets(creep).sort((a, b) => a.hits - b.hits);
    this.repairTargets(creep, targets);
  },
  obtainEnergy: function (creep) {
    if (assignCreepToObtainEnergyFromTombstone(creep)) {
      return;
    } else if (assignCreepToObtainEnergyFromRuin(creep)) {
      return;
    } else if (pickupDroppedResources(creep)) {
      return;
    } else if (assignCreepToObtainEnergyFromStorage(creep)) {
      return;
    } else if (
      withdrawFromContainerOk() &&
      assignCreepToObtainEnergyFromContainer(creep)
    ) {
      return;
    } else if (
      withdrawFromSpawnOk() &&
      assignCreepToObtainEnergyFromSpawn(creep)
    ) {
      return;
    } else {
      assignCreepToObtainEnergyFromSource(creep, REPAIRER_SOURCE_INDEX);
    }
  },
  findTargets: function (creep) {
    var decayedContainers = this.findDecayedStructure(
      creep,
      STRUCTURE_CONTAINER
    );
    var decayedLinks = this.findDecayedStructure(creep, STRUCTURE_LINK);
    var decayedStorage = this.findDecayedStructure(creep, STRUCTURE_STORAGE);
    if (decayedStorage.length > 0) {
      return decayedStorage;
    } else if (decayedContainers.length > 0) {
      return decayedContainers;
    } else if (decayedLinks.length > 0) {
      return decayedLinks;
    } else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: this.getPrioritizedStructure,
      });
      return targets;
    }
  },
  repairTargets: function (creep, targets) {
    if (targets.length > 0) {
      if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    }
  },
  findDecayedStructure: function (creep, structureType) {
    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) =>
        structure.structureType == structureType &&
        structure.hits < structure.hitsMax,
    });
    return targets;
  },
  getPrioritizedStructure: function (structure) {
    let type = structure.structureType;
    let needsRepair =
      structure.hits < structure.hitsMax * REPAIR_HITS_THRESHOLD_RATIO;
    let notMaxHits = structure.hits < structure.hitsMax;
    switch (REPAIR_PRIORITY) {
      case "walls":
        return type == STRUCTURE_WALL && needsRepair;
      case "roads":
        return type == STRUCTURE_ROAD && notMaxHits;
      case "ramparts":
        return type == STRUCTURE_RAMPARTS && needsRepair;
      case "infrastructure":
        return (
          type !== STRUCTURE_WALL && type !== STRUCTURE_RAMPART && notMaxHits
        );
      default:
        return (
          (needsRepair || notMaxHits) &&
          structure.pos.x >= REPAIR_REGION_X_LOWER &&
          structure.pos.x <= REPAIR_REGION_X_UPPER &&
          structure.pos.y >= REPAIR_REGION_Y_LOWER &&
          structure.pos.y <= REPAIR_REGION_Y_UPPER
        );
    }
  },
};

module.exports = roleRepairer;
