const { logRoomInfo } = require("./logger.room");

const printLogHeader = () => {
  console.log("=== " + `${Game.time % 1000000}` + " ===");
};

module.exports = {
  run: function () {
    printLogHeader();
    logRoomInfo("W35N43");
    logRoomInfo("W36N43");
  },
};
