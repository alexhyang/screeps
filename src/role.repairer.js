const roomConfig = require("./dashboard");
const { obtainResource, repairTarget } = require("./role.creepManager");
const { getDecayedStructures } = require("./util.structureFinder");

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
  repairTarget(creep, targets[0]);
};

const obtainEnergy = (creep) => {
  obtainResource(
    creep,
    [
      "droppedResources",
      "tombstone",
      "ruin",
      "container",
      "storage",
      "container",
      "spawn",
      "source",
    ],
    roomConfig[creep.room.name].REPAIRER_SOURCE_INDEX
  );
};

const findTargets = (creep) => {
  var decayedContainers = getDecayedStructures(creep.room, STRUCTURE_CONTAINER);
  var decayedLinks = getDecayedStructures(creep.room, STRUCTURE_LINK);
  var decayedStorage = getDecayedStructures(creep.room, STRUCTURE_STORAGE);
  if (decayedStorage.length > 0) {
    return decayedStorage;
  } else if (decayedContainers.length > 0) {
    return decayedContainers;
  } else if (decayedLinks.length > 0) {
    return decayedLinks;
  } else {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => getPrioritizedStructure(creep, s),
    });
    return targets;
  }
};

const getPrioritizedStructure = (creep, structure) => {
  const {
    REPAIR_PRIORITY,
    REPAIR_HITS_THRESHOLD_RATIO,
    REPAIR_REGION_X_LOWER,
    REPAIR_REGION_X_UPPER,
    REPAIR_REGION_Y_LOWER,
    REPAIR_REGION_Y_UPPER,
  } = roomConfig[creep.room.name];
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
