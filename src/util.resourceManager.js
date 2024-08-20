const { getRoomConfig } = require("./configAPI");
const { getContainers, getStorage } = require("./util.structureFinder");

/**
 * Shorthand for roomObj.store.getUsedCapacity()
 * @param {RoomObject} roomObj
 * @param {string} resourceType
 * @returns {number} used capacity of specified resource type
 */
const getUsedCapacity = (roomObj, resourceType = RESOURCE_ENERGY) => {
  if (roomObj.store) {
    return roomObj.store.getUsedCapacity(resourceType);
  }
};

/**
 * Shorthand for roomObj.store.getFreeCapacity()
 * @param {RoomObject} roomObj
 * @param {string} resourceType
 * @returns {number} free capacity of specified resource type
 */
const getFreeCapacity = (roomObj, resourceType = RESOURCE_ENERGY) => {
  if (roomObj.store) {
    return roomObj.store.getFreeCapacity(resourceType);
  }
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
  getEnergyAvailable,
  getEnergyCapacityAvailable,
  withdrawFromContainerOk,
  withdrawFromStorageOk,
  withdrawFromSpawnOk,
};
