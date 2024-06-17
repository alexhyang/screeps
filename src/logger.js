var squadLogger = require("./logger.squad");
const { ROOM_NUMBER } = require("./dashboard");
const {
  convertNumToMillions,
  convertNumToThousands,
  roundTo,
} = require("./logger.utils");

var logger = {
  log: function () {
    this.printLogTitle();
    squadLogger.log();
    console.log("\n");
  },
  printLogTitle: function () {
    console.log(
      "--------------  " +
        Game.time +
        " // " +
        this.getEnergyMeta() +
        ` (${this.getContainerMeta()})` +
        " | " +
        this.getControllerMeta() +
        " -------------"
    );
  },
  getEnergyMeta: function () {
    let energyAvailable = Game.rooms[ROOM_NUMBER].energyAvailable;
    let energyCapacityAvailable =
      Game.rooms[ROOM_NUMBER].energyCapacityAvailable;
    let energyMeta = `Energy: ${energyAvailable}/${energyCapacityAvailable}`;
    return energyMeta;
  },
  getContainerMeta: function () {
    let containers = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER,
    });
    let container = containers[0];
    let containerMeta = `${container.store.getUsedCapacity(RESOURCE_ENERGY)}`;
    return containerMeta;
  },
  getControllerMeta: function () {
    let controller = Game.rooms[ROOM_NUMBER].controller;
    let current = this.parseProgress(controller.progress);
    let total = this.parseProgress(controller.progressTotal);
    let percentage = roundTo(
      Math.round((controller.progress / controller.progressTotal) * 100),
      1
    );
    let controllerMeta = `Controller (lvl. ${controller.level}, ${percentage}%: ${current}/${total})`;
    return controllerMeta;
  },
  /**
   *
   * @param {number} progress
   * @returns {string} progress in text form with units "K", "M"
   */
  parseProgress: function (progress) {
    if (progress >= 1000000) {
      return this.convertNumToMillions(progress, 2) + "M";
    } else if (progress >= 1000) {
      return this.convertNumToThousands(progress, 2) + "K";
    } else {
      return progress;
    }
  },
  convertNumToThousands: function (num, numOfDecimalPlaces) {
    return roundTo(num / 1000, numOfDecimalPlaces);
  },
  /**
   * @param {number} num
   * @param {number} numOfDecimalPlaces
   * @returns {number} the given number in millions
   */
  convertNumToMillions: function (num, numOfDecimalPlaces) {
    return roundTo(num / 1000000, numOfDecimalPlaces);
  },
};

module.exports = logger;
