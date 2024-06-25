const roomConfig = require("./dashboard");
const { obtainResource, repairTarget } = require("./role.creepManager");
const { getDamagedStructures } = require("./util.structureFinder");

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
  let targets = findRepairTargets(creep).sort((a, b) => a.hits - b.hits);
  repairTarget(creep, targets[0]);
};

const obtainEnergy = (creep) => {
  const { sourceOrigins, sourceIndex } = roomConfig[creep.room.name].repairer;
  obtainResource(creep, sourceOrigins, sourceIndex);
};

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
