var memoryManager = {
  /**
   * Clean memory of died creeps
   */
  cleanNonExistingCreeps: function () {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log("Clearing non-existing creep memory:", name);
      }
    }
  },
  /**
   * Delete hostile creep record in memory
   */
  clearHostileMemory: () => {
    delete Memory.hostiles;
  },
};

module.exports = memoryManager;
