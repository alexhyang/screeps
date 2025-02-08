const { getMyRooms } = require("./configAPI");
const { getTeam } = require("./squad");
const { getResourceMeta, getDefenseMeta } = require("./Room");

module.exports = {
  run: function () {
    let msg;
    const timeNow = new Date(Date.now());
    const hrNow = timeNow.getHours();
    const minNow = timeNow.getMinutes();
    const secNow = timeNow.getSeconds();
    // TODO: fix logic later, no creep is only checked at 12pm and 4pm
    if (
      (!Memory.lastSentHour || Memory.lastSentHour != hrNow) &&
      (hrNow == 20 || hrNow == 4) &&
      minNow == 0 &&
      secNow <= 5
    ) {
      getMyRooms().forEach((roomName) => {
        // UTC-->Pacific: 20:00 -> 12:00, 4:00 -> 20:00
        msg =
          roomName +
          ": " +
          getResourceMeta(roomName) +
          ", " +
          getDefenseMeta(roomName);
        Game.notify(msg);
        if (getTeam("all", roomName).length == 0) {
          Game.notify(`No creep working in ${roomName}`, 30);
        }
      });
      Memory.lastSentHour = hrNow;
    }

    getMyRooms().forEach((roomName) => {
      // UTC-->Pacific: 20:00 -> 12:00, 4:00 -> 20:00
      if (getTeam("all", roomName).length == 0) {
        Game.notify(`No creep working in ${roomName}`, 30);
      }
    });
  },
};
