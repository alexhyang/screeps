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

const updateRepairingStatus = (creep) => {
  if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.repairing = false;
    creep.say("⛏");
  }

  if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
    creep.memory.repairing = true;
    creep.say("🚧");
  }
};

const repairConstruction = (creep) => {
  let targets = findTargets(creep).sort((a, b) => a.hits - b.hits);
  repairTargets(creep, targets);
};

const obtainEnergy = (creep) => {
  if (creep.store.getFreeCapacity() > 0) {
    pickupDroppedResources(creep) ||
      assignCreepToObtainEnergyFromTombstone(creep) ||
      assignCreepToObtainEnergyFromRuin(creep) ||
      assignCreepToObtainEnergyFromContainer(creep) ||
      assignCreepToObtainEnergyFromStorage(creep) ||
      (withdrawFromContainerOk() &&
        assignCreepToObtainEnergyFromContainer(creep)) ||
      (withdrawFromSpawnOk() && assignCreepToObtainEnergyFromSpawn(creep));
  } else {
    assignCreepToObtainEnergyFromSource(creep, REPAIRER_SOURCE_INDEX);
  }
};

const findTargets = (creep) => {
  var decayedContainers = findDecayedStructure(creep, STRUCTURE_CONTAINER);
  var decayedLinks = findDecayedStructure(creep, STRUCTURE_LINK);
  var decayedStorage = findDecayedStructure(creep, STRUCTURE_STORAGE);
  if (decayedStorage.length > 0) {
    return decayedStorage;
  } else if (decayedContainers.length > 0) {
    return decayedContainers;
  } else if (decayedLinks.length > 0) {
    return decayedLinks;
  } else {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: getPrioritizedStructure,
    });
    return targets;
  }
};

const repairTargets = (creep, targets) => {
  if (targets.length > 0) {
    if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], {
        visualizePathStyle: { stroke: "#ffffff" },
      });
    }
  }
};

const findDecayedStructure = (creep, structureType) => {
  let targets = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) =>
      structure.structureType == structureType &&
      structure.hits < structure.hitsMax,
  });
  return targets;
};

const getPrioritizedStructure = (structure) => {
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
      return type == STRUCTURE_RAMPART && needsRepair;
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
};

let roleRepairer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    updateRepairingStatus(creep);
    if (creep.memory.repairing) {
      repairConstruction(creep);
    } else {
      obtainEnergy(creep);
    }
  },
};

module.exports = roleRepairer;
