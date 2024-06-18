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
        ` (${this.getContainerMeta()}) ` +
        this.getStorageMeta() +
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
    return this.getStructureMeta(STRUCTURE_CONTAINER);
  },
  getStorageMeta: function () {
    return this.getStructureMeta(STRUCTURE_STORAGE);
  },
  getStructureMeta: function (structureType) {
    let targets = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == structureType,
    });
    let target = targets[0];
    let targetUsedCapacity = target.store.getUsedCapacity(RESOURCE_ENERGY);
    let targetMeta = `${this.parseNumber(targetUsedCapacity)}`;
    return targetMeta;
  },
  getControllerMeta: function () {
    let controller = Game.rooms[ROOM_NUMBER].controller;
    let current = this.parseNumber(controller.progress);
    let total = this.parseNumber(controller.progressTotal);
    let percentage = roundTo(
      Math.round((controller.progress / controller.progressTotal) * 100),
      1
    );
    let controllerMeta = `Controller (lvl. ${controller.level}, ${percentage}%: ${current}/${total})`;
    return controllerMeta;
  },
  /**
   *
   * @param {number} number
   * @returns {string} progress in text form with units "K", "M"
   */
  parseNumber: function (number) {
    if (number >= 1000000) {
      return this.convertNumToMillions(number, 2) + "M";
    } else if (number >= 1000) {
      return this.convertNumToThousands(number, 2) + "K";
    } else {
      return number;
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
