const {
  getUsedCapacity,
  storeHasSpace,
  storeHasResource,
} = require("./util.resourceManager");
const { getTerminal } = require("./util.structureFinder");

const W36N43 = "W36N43";
const W35N43 = "W35N43";
const W34N43 = "W34N43";
const W38N43 = "W38N43";
const W37N43 = "W37N43";

const getLink = (x, y, roomName) => {
  return Game.rooms[roomName].lookForAt(LOOK_STRUCTURES, x, y)[0];
};

/**
 * Set up links in my rooms
 */
const setUpLinks = () => {
  const link36From = getLink(38, 16, W36N43);
  const link36To = getLink(33, 34, W36N43);
  if (storeHasSpace(link36To, 400)) {
    link36From.transferEnergy(link36To);
  }

  const link37_0 = getLink(27, 28, W37N43);
  const link37_1 = getLink(24, 10, W37N43);
  const link37_2 = getLink(18, 5, W37N43);
  if (storeHasResource(link37_2, 200)) {
    link37_2.transferEnergy(link37_1);
  }
  if (storeHasSpace(link37_0, 300)) {
    link37_1.transferEnergy(link37_0);
  }
};

/**
 * Set up terminals in my rooms
 */
const setUpTerminals = () => {
  let terminal35 = getTerminal(Game.rooms[W35N43]);
  let terminal36 = getTerminal(Game.rooms[W36N43]);
  let terminal34 = getTerminal(Game.rooms[W34N43]);
  let terminal38 = getTerminal(Game.rooms[W38N43]);
  let terminal37 = getTerminal(Game.rooms[W37N43]);

  if (getUsedCapacity(terminal35) < 60000) {
    // terminal34.send(RESOURCE_ENERGY, 5000, W35N43);
  }

  if (getUsedCapacity(terminal36) < 30000) {
    // terminal34.send(RESOURCE_ENERGY, 5000, W36N43);
  }
  if (getUsedCapacity(terminal37) < 30000) {
    // terminal38.send(RESOURCE_ENERGY, 5000, W37N43);
  }
};

module.exports = {
  run: function () {
    setUpLinks();
    setUpTerminals();
  },
};
