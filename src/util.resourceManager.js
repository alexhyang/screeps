const { getRoomConfig } = require("./configAPI");
const { getStorage } = require("./util.structureFinder");

/**
 * Shorthand for roomObj.store.getUsedCapacity()
 * @param {RoomObject} roomObj
 * @param {string} resourceType RESOURCE_ENERGY by default
 * @returns {(number|null)} used capacity of specified resource type,
 *    null if resource type is invalid
 */
const getUsedCapacity = (roomObj, resourceType = RESOURCE_ENERGY) => {
  if (roomObj.store) {
    return resourceType == "all"
      ? roomObj.store.getUsedCapacity()
      : roomObj.store.getUsedCapacity(resourceType);
  }
};

/**
 * Shorthand for roomObj.store.getFreeCapacity()
 * @param {RoomObject} roomObj
 * @param {string} resourceType RESOURCE_ENERGY by default
 * @returns {(number|null)} free capacity of specified resource type,
 *    null if resource type is invalid
 */
const getFreeCapacity = (roomObj, resourceType = RESOURCE_ENERGY) => {
  if (roomObj.store) {
    return resourceType == "all"
      ? roomObj.store.getFreeCapacity()
      : roomObj.store.getFreeCapacity(resourceType);
  }
};

/**
 * Shorthand for roomObj.store.getCapacity()
 * @param {RoomObject} roomObj
 * @param {string} resourceType RESOURCE_ENERGY by default
 * @returns {(number|null)} resource capacity of specified room object,
 *    null if resource type is invalid
 */
const getCapacity = (roomObj, resourceType = RESOURCE_ENERGY) => {
  if (roomObj.store) {
    return resourceType == "all"
      ? roomObj.store.getCapacity()
      : roomObj.store.getCapacity(resourceType);
  }
};

/**
 * Determine if a store of a room object
 * @param {RoomObject} roomObj
 * @param {string} resourceType RESOURCE_ENERGY by default
 * @returns {boolean} true if store is empty, false otherwise
 */
const storeIsEmpty = (roomObj) => {
  return getUsedCapacity(roomObj, "all") == 0;
};

/**
 * Determine if the store of a room object is full
 * @param {RoomObject} roomObj
 * @param {string} resourceType RESOURCE_ENERGY by default
 * @returns {boolean} true if store is full, false otherwise
 */
const storeIsFull = (roomObj) => {
  return getFreeCapacity(roomObj, "all") == 0;
};

/**
 * Determine if the store of a room object has specified resource greater than
 *    or equal to the minimum amount. If the minimum amount is undefined,
 *    return true if it has the specified resource, false otherwise.
 * @param {RoomObject} roomObj
 * @param {number} minAmount minimum used capacity
 * @param {string} resourceType RESOURCE_ENERGY by default
 */
const storeHasResource = (
  roomObj,
  minAmount,
  resourceType = RESOURCE_ENERGY
) => {
  let usedCapacity = getUsedCapacity(roomObj, resourceType);
  return minAmount == undefined || minAmount <= 0
    ? usedCapacity > 0
    : usedCapacity >= minAmount;
};

/**
 * Determine if the store of a room object has space for the given amount. If
 *    minimum amount if undefined, return true if it has free capacity, false
 *    otherwise
 * @param {RoomObject} roomObj
 * @param {number} minAmount minimum free capacity
 * @param {string} resourceType RESOURCE_ENERGY by default
 */
const storeHasSpace = (roomObj, minAmount, resourceType = RESOURCE_ENERGY) => {
  let freeCapacity = getFreeCapacity(roomObj, resourceType);
  return minAmount == undefined || minAmount <= 0
    ? freeCapacity > 0
    : freeCapacity >= minAmount;
};

/**
 * Get the energy available in the room
 * @param {Room} room
 * @returns {number} the available energy in the given room
 */
const getEnergyAvailable = (room) => {
  if (room) {
    return room.energyAvailable;
  }
  return 0;
};

/**
 * Get the energy capacity available in the room
 * @param {Room} room
 * @returns the available energy capacity of room with the given name
 */
const getEnergyCapacityAvailable = (room) => {
  if (room) {
    return room.energyCapacityAvailable;
  }
  return 0;
};

/**
 * Determine if it's ok to withdraw energy from spawn in the room
 * @param {Room} room
 * @returns {boolean} true if it is okay to withdraw from spawn(s) in the
 *    given room, false otherwise
 **/
const withdrawFromSpawnOk = (room) => {
  const { SPAWN_WITHDRAW_THRESHOLD } = getRoomConfig(room.name);
  let energyAvailable = getEnergyAvailable(room);
  return energyAvailable >= SPAWN_WITHDRAW_THRESHOLD;
};

/**
 * Determine if sources in the specified room are empty
 * @param {Room} room
 * @returns {boolean} true if all sources are empty, false otherwise
 */
const allSourcesAreEmpty = (room) => {
  let sources = room.find(FIND_SOURCES);
  return sources.filter((s) => s.energy > 0).length == 0;
};

/**
 * Determine if it's ok to withdraw energy from containers in the room
 * @param {StructureContainer} container
 * @param {Room} room
 * @returns {boolean} true if it is okay to withdraw from container(s) in the
 *    given room, false otherwise
 **/
const withdrawFromContainerOk = (container, room) => {
  const { CONTAINER_WITHDRAW_THRESHOLD } = getRoomConfig(room.name);

  if (allSourcesAreEmpty(room)) {
    return true;
  } else {
    return getUsedCapacity(container) >= CONTAINER_WITHDRAW_THRESHOLD;
  }
};

/**
 * Determine if it's ok to withdraw energy from storage in the room
 * @param {Room} room
 * @returns {boolean} true if it is okay to withdraw from storage in the given
 *    room, false otherwise
 **/
const withdrawFromStorageOk = (room) => {
  const { STORAGE_WITHDRAW_THRESHOLD } = getRoomConfig(room.name);
  let storage = getStorage(room);

  if (
    storage &&
    (allSourcesAreEmpty(room) ||
      getUsedCapacity(storage) >= STORAGE_WITHDRAW_THRESHOLD)
  ) {
    return true;
  }
  return false;
};

module.exports = {
  getUsedCapacity,
  getFreeCapacity,
  getCapacity,
  storeIsEmpty,
  storeIsFull,
  storeHasResource,
  storeHasSpace,
  getEnergyAvailable,
  getEnergyCapacityAvailable,
  withdrawFromContainerOk,
  withdrawFromStorageOk,
  withdrawFromSpawnOk,
};
