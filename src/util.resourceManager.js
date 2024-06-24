const roomConfig = require("./dashboard");
const { getContainers } = require("./util.structureFinder");

/**
 * @param {number} roomName
 * @returns the available energy of room with the given name
 */
const getEnergyAvailable = (creep) => {
  return creep.room.energyAvailable;
};

/**
 * @param {number} roomName
 * @returns the available energy capacity of room with the given name
 */
const getEnergyCapacityAvailable = (creep) => {
  return creep.room.energyCapacityAvailable;
};

/**
 * @returns {boolean} true if it is okay to withdraw from spawn(s)
 **/
const withdrawFromSpawnOk = (creep) => {
  let energyAvailable = getEnergyAvailable(creep);
  return (
    energyAvailable >= roomConfig[creep.room.name].SPAWN_WITHDRAW_THRESHOLD
  );
};

/**
 * @returns {boolean} true if it is okay to withdraw from container(s)
 **/
const withdrawFromContainerOk = (creep) => {
  let container = getContainers(creep)[0];
  if (container) {
    return (
      container.store.getUsedCapacity(RESOURCE_ENERGY) >=
      CONTAINER_WITHDRAW_THRESHOLD
    );
  }
  return false;
};

module.exports = {
  getEnergyAvailable,
  getEnergyCapacityAvailable,
  withdrawFromContainerOk,
  withdrawFromSpawnOk,
};
