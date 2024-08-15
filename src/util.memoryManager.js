/**
 * Clean memory of died creeps
 */
const cleanNonExistingCreeps = () => {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }
};

/**
 * Delete hostile creep record in memory
 */
const clearHostileMemory = () => {
  delete Memory.hostiles;
};

const cpuBucket = () => {
  console.log(Game.cpu.bucket);
  if (Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
  }
};

module.exports = {
  cleanNonExistingCreeps,
  clearHostileMemory,
  cpuBucket,
};
