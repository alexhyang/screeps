const roomConfig = require("./dashboard");
const { getContainers } = require("./util.structureFinder");

/**
 * Get the energy available in a room
 * @param {Room} room
 * @returns {number} the available energy in the given room
 */
const getEnergyAvailable = (room) => {
  return room.energyAvailable;
};

/**
 * Get the energy capacity available in a room
 * @param {Room} room
 * @returns the available energy capacity of room with the given name
 */
const getEnergyCapacityAvailable = (room) => {
  return room.energyCapacityAvailable;
};

/**
 * Determine if it's ok to withdraw energy from spawn
 * @param {Creep} creep
 * @returns {boolean} true if it is okay to withdraw from spawn(s),
 *    false otherwise
 **/
const withdrawFromSpawnOk = (creep) => {
  let { SPAWN_WITHDRAW_THRESHOLD } = roomConfig[creep.room.name];
  let energyAvailable = getEnergyAvailable(creep.room);
  return energyAvailable >= SPAWN_WITHDRAW_THRESHOLD;
};

/**
 * Determine if it's ok to withdraw energy from containers
 * @param {Creep} creep
 * @returns {boolean} true if it is okay to withdraw from container(s)
 **/
const withdrawFromContainerOk = (creep) => {
  let room = creep.room;
  const { CONTAINER_WITHDRAW_THRESHOLD } = roomConfig[room.name];
  const { sourceIndex } = roomConfig[room.name].miner;
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

module.exports = {
  getEnergyAvailable,
  getEnergyCapacityAvailable,
  withdrawFromContainerOk,
  withdrawFromSpawnOk,
};
