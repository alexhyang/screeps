var squadLogger = require("./logger.squad");
const {
  ROOM,
  ENERGY_AVAILABLE,
  ENERGY_CAPACITY_AVAILABLE,
} = require("./dashboard");

var logger = {
  log: function () {
    this.printLogTitle();
    squadLogger.log();
    console.log("\n");
  },
  printLogTitle: function () {
    let energyMeta = `Energy: ${ENERGY_AVAILABLE}/${ENERGY_CAPACITY_AVAILABLE}`;
    let controller = ROOM.controller;
    let current = controller.progress;
    let total = controller.progressTotal;
    let controllerMeta = `Controller (lvl. ${controller.level} ${Math.round(
      (current / total) * 100
    )}%: ${current}/${total})`;
    console.log(
      "--------------  " +
        Game.time +
        " // " +
        energyMeta +
        " | " +
        controllerMeta +
        " -------------"
    );
  },
};

module.exports = logger;
