var squadLogger = require("./logger.squad");
const { ROOM_NUMBER } = require("./dashboard");

var logger = {
  log: function () {
    this.printLogTitle();
    squadLogger.log();
    console.log("\n");
  },
  printLogTitle: function () {
    let energyAvailable = Game.rooms[ROOM_NUMBER].energyAvailable;
    let energyCapacityAvailable =
      Game.rooms[ROOM_NUMBER].energyCapacityAvailable;
    let energyMeta = `Energy: ${energyAvailable}/${energyCapacityAvailable}`;
    let controller = Game.rooms[ROOM_NUMBER].controller;
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
