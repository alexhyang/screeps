const { getMyRooms } = require("./configAPI");
const { getTeam } = require("./squad");
const {
  getEnergyAvailable,
  getEnergyCapacityAvailable,
} = require("./util.resourceManager");
const { getRoom } = require("./utils.game");

module.exports = {
  run: function () {
    getMyRooms().forEach((roomName) => {
      let room = getRoom(roomName);
      let energyAvailable = getEnergyAvailable(room);
      let energyCapacityAvailable = getEnergyCapacityAvailable(room);

      if (Game.time % 1500 == 0) {
        Game.notify(roomName, `${energyAvailable}/${energyCapacityAvailable}`);
      }
      if (getTeam("all", roomName).length == 0) {
        Game.notify(`No creep working in ${roomName}`, 30);
      }
    });
  },
};
