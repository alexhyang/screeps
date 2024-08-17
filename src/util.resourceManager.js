const { getRoomConfig } = require("./configAPI");
const { getContainers, getStorage } = require("./util.structureFinder");

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
 * Determine if it's ok to withdraw energy from containers in the room
 * @param {Room} room
 * @returns {boolean} true if it is okay to withdraw from container(s) in the
 *    given room, false otherwise
 **/
const withdrawFromContainerOk = (room) => {
  const { CONTAINER_WITHDRAW_THRESHOLD } = getRoomConfig(room.name);
  const { sourceIndex } = getRoomConfig(room.name).miner;
  let minerSource = room.find(FIND_SOURCES)[sourceIndex];
  let containers = getContainers(room);

  for (let i in containers) {
    if (
      minerSource.energy == 0 ||
      containers[i].store.getUsedCapacity(RESOURCE_ENERGY) >=
        CONTAINER_WITHDRAW_THRESHOLD
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Determine if it's ok to withdraw energy from storage in the room
 * @param {Room} room
 * @returns {boolean} true if it is okay to withdraw from storage in the given
 *    room, false otherwise
 **/
const withdrawFromStorageOk = (room) => {
  const { STORAGE_WITHDRAW_THRESHOLD } = getRoomConfig(room.name);
  const { sourceIndex } = getRoomConfig(room.name).miner;
  let minerSource = room.find(FIND_SOURCES)[sourceIndex];
  let storage = getStorage(room);

  if (
    storage &&
    (minerSource.energy == 0 ||
      storage.store.getUsedCapacity(RESOURCE_ENERGY) >=
        STORAGE_WITHDRAW_THRESHOLD)
  ) {
    return true;
  }
  return false;
};

module.exports = {
  getEnergyAvailable,
  getEnergyCapacityAvailable,
  withdrawFromContainerOk,
  withdrawFromStorageOk,
  withdrawFromSpawnOk,
};
