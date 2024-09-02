const { getCreep } = require("./squad");
const { getController } = require("./util.structureFinder");

const REPAIR_STROKE = "#fffb05"; // yellow
const BUILD_STROKE = "#fffb05"; // yellow
const UPGRADE_STROKE = "#1205ff"; // blue

/**
 * Get the meta data of a creep
 * @param {Creep} creep
 * @returns {string} the meta data of the given creep
 */
const getCreepMeta = (creep) => {
  let lifeLeft = creep.ticksToLive;
  let fatigue = creep.fatigue;
  let carry = creep.store[RESOURCE_ENERGY];
  let carryMax = creep.store.getCapacity(RESOURCE_ENERGY);
  return `(${lifeLeft}, ${carry}/${carryMax}, ${fatigue})`;
};

/**
 * Get the summary of body part count
 * @param {Creep} creep
 * @returns {Object.<string, number>} an object with part as key and count as
 *    value, return undefined if all parts are lost
 */
const getCreepBodyPartCount = (creep) => {
  let bodyPartCount = {};
  creep.body.map((body) => {
    if (!(body.type in bodyPartCount)) {
      bodyPartCount[body.type] = 0;
    }
    if (body.hits > 0) {
      bodyPartCount[body.type]++;
    }
  });
  return bodyPartCount;
};

/**
 * Get body parts of a creep
 * @param {Creep} creep
 * @returns {string} body parts the given creep
 */
const getCreepBodyParts = (creep) => {
  let bodyParts = [];
  let bodyPartCount = getCreepBodyPartCount(creep);
  for (let partType in bodyPartCount) {
    bodyParts.push(`${partType}: ${bodyPartCount[partType]}`);
  }
  return `(${bodyParts.join(", ")})`;
};

/**
 * Dismantle the given structure
 * @param {Creep} creep
 * @param {Structure} structure
 * @returns {boolean} true if the task assignment is successful, false otherwise
 */
const dismantleStructure = (creep, structure) => {
  if (structure) {
    if (creep.dismantle(structure) == ERR_NOT_IN_RANGE) {
      creep.moveTo(structure);
    }
    return true;
  }
  return false;
};

/**
 * Build the given construction site
 * @param {Creep} creep
 * @param {ConstructionSite} target
 */
const buildTarget = (creep, target) => {
  if (target !== null && target !== undefined) {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: BUILD_STROKE } });
    }
  }
};

/**
 * Build the given construction site by its id
 * @param {Creep} creep
 * @param {string} targetId
 */
const buildTargetById = (creep, targetId) => {
  let target = Game.getObjectById(targetId);
  if (target !== null) {
    buildTarget(creep, target);
  }
};

/**
 * Build the closest construction site if any
 * @param {Creep} creep
 */
const buildClosestConstructionSite = (creep, buildingPriority = "none") => {
  let filter =
    buildingPriority == "none"
      ? (s) => true
      : (s) => s.structureType === buildingPriority;

  let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
    filter: filter,
  });

  if (target !== null) {
    buildTarget(creep, target);
  }
};

/**
 * Repair the given target
 * @param {Creep} creep
 * @param {Structure} target
 */
const repairTarget = (creep, target) => {
  if (target !== null) {
    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: REPAIR_STROKE } });
    }
  }
};

/**
 * Let a creep claim the controller in its room, show error message if not
 *   successful
 * @param {Creep} creep
 */
const claimController = (creep) => {
  if (creep.room.controller) {
    let controller = creep.room.controller;
    if (creep.claimController(controller) == ERR_NO_BODYPART) {
      console.log(`Creep ${creep.name} does not have CLAIM part`);
    } else if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(controller);
    }
  }
};

/**
 * Upgrade controller
 * @param {Creep} creep
 */
const upgradeController = (creep) => {
  let controller = getController(creep.room);
  if (controller.level == 8 && controller.ticksToDowngrade > 199900) {
    return;
  }
  if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
    creep.moveTo(controller, {
      visualizePathStyle: { stroke: UPGRADE_STROKE },
    });
  }
};

/**
 * Sign controller in the room
 * @param {Creep} creep
 * @param {string} signMsg
 */
const signController = (creep, signMsg) => {
  if (creep.room.controller) {
    if (
      creep.signController(creep.room.controller, signMsg) == ERR_NOT_IN_RANGE
    ) {
      creep.moveTo(creep.room.controller);
    }
  }
};

/**
 * Move a creep to a given position
 * @param {Creep} creep
 * @param {number} x x-coordinate of position: 0 <= x < = 49
 * @param {number} y y-coordinate of position: 0 <= y <= 49
 * @param {string} roomName name of the destination room
 */
const moveToPosition = (creep, x, y, roomName = "") => {
  if (creep) {
    let targetRoomName = roomName !== "" ? roomName : creep.room.name;
    creep.moveTo(new RoomPosition(x, y, targetRoomName));
  }
};

/**
 * Find the nearby structures of the given type
 * @param {Creep} creep
 * @param {string} structureType
 * @param {number} range by default 2
 * @returns {StructureContainer} nearby containers in the given range
 */
const getNearbyStructures = (creep, structureType, range = 2) => {
  let nearbyStructures = creep.room.find(FIND_STRUCTURES, {
    filter: (s) =>
      s.structureType == structureType && creep.pos.inRangeTo(s, range),
  });
  return nearbyStructures;
};

const sendTo = (creepName, roomName) => {
  let creep = getCreep(creepName);
  if (creep) {
    creep.memory.noPosCheck = true;
    switch (roomName) {
      case "W35N43":
        if (creep.room.name !== roomName) {
          moveToPosition(creep, 12, 16, "W35N43");
        }
        break;
      case "W36N43":
        if (creep.room.name !== roomName) {
          moveToPosition(creep, 47, 7, "W36N43");
        }
        break;
      case "W34N43":
        if (creep.room.name !== roomName) {
          moveToPosition(creep, 20, 21, "W34N43");
        }
        break;
      case "W38N43":
        if (creep.room.name !== roomName) {
          moveToPosition(creep, 30, 25, "W38N43");
        }
        break;
      default:
        if (creep.room.name !== roomName) {
          moveToPosition(creep, 25, 25, roomName);
        }
    }
  }
};

module.exports = {
  getCreepMeta,
  getCreepBodyParts,
  buildClosestConstructionSite,
  buildTargetById,
  repairTarget,
  dismantleStructure,
  claimController,
  upgradeController,
  signController,
  moveToPosition,
  sendTo,
  getNearbyStructures,
};
