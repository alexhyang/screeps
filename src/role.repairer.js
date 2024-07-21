const roomConfig = require("./dashboard");
const { repairTarget } = require("./Creep");
const { obtainResource } = require("./CreepResource");
const { getDamagedStructures } = require("./util.structureFinder");

/**
 * Update the repairing status of the repairer creep
 * @param {Creep} creep
 */
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

/**
 * Let the repairer creep repair a structure
 * @param {Creep} creep
 */
const repairConstruction = (creep) => {
  if (!creep.memory.repairTarget) {
    let targets = findRepairTargets(creep).sort((a, b) => a.hits - b.hits);
    if (targets.length > 0) {
      creep.memory.repairTarget = targets[0].id;
    }
  } else {
    let target = Game.getObjectById(creep.memory.repairTarget);
    if (target && target.hits < target.hitsMax) {
      repairTarget(creep, target);
    } else {
      creep.memory.repairTarget = "";
    }
  }
};

/**
 * Let the repairer creep obtain energy for repairing
 * @param {Creep} creep
 */
const obtainEnergy = (creep) => {
  const { sourceOrigins, sourceIndex } = roomConfig[creep.room.name].repairer;
  obtainResource(creep, sourceOrigins, sourceIndex);
};

/**
 * Find targets that need to be repaired
 * @param {Creep} creep
 * @returns {Structure[]} an array of structures to repair,
 *    or an empty array if not found
 */
const findRepairTargets = (creep) => {
  var decayedContainers = getDamagedStructures(creep.room, STRUCTURE_CONTAINER);
  var decayedLinks = getDamagedStructures(creep.room, STRUCTURE_LINK);
  if (decayedContainers.length > 0) {
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

/**
 * Determine if a structure is repairing priority
 * @param {Creep} creep
 * @param {Structure} structure
 * @returns {boolean} true if a structure is repairing priority,
 *    or false otherwise
 */
const getPrioritizedStructure = (creep, structure) => {
  const { repairingPriority, repairingHitsRatio } =
    roomConfig[creep.room.name].repairer;
  let type = structure.structureType;
  let needsRepair = structure.hits < structure.hitsMax * repairingHitsRatio;
  let notMaxHits = structure.hits < structure.hitsMax;

  switch (repairingPriority) {
    case "defenses":
      return (
        (type == STRUCTURE_WALL || type == STRUCTURE_RAMPART) && needsRepair
      );
    case "infrastructure":
      return (
        type !== STRUCTURE_WALL && type !== STRUCTURE_RAMPART && notMaxHits
      );
    default:
      return needsRepair || notMaxHits;
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
