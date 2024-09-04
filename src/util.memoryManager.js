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

/**
 * Print current CPU Bucket value, if it's full, generate pixel
 */
const cpuBucket = () => {
  console.log("CPU Bucket:", Game.cpu.bucket);
  if (Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
  }
};

/**
 * Print current debug countdown then decrement it
 */
const decrementDebugCountdown = () => {
  if (Memory.debugCountDown > 0) {
    console.log("debug countdown:", Memory.debugCountDown);
    Memory.debugCountDown = Memory.debugCountDown - 1;
  }
};

module.exports = {
  run: () => {
    cleanNonExistingCreeps();
    cpuBucket();
    decrementDebugCountdown();
  },
  clearHostileMemory,
};
