const {
  getUsedCapacity,
  storeHasSpace,
  storeHasResource,
} = require("./util.resourceManager");
const { getTerminal, getFactory } = require("./util.structureFinder");
const { getById } = require("./utils.game");

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
  const link34_0 = getLink(43, 15, W34N43);
  const link34_1 = getLink(23, 21, W34N43);
  const link34_2 = getLink(25, 7, W34N43);
  if (storeHasSpace(link34_2, 400)) {
    link34_0.transferEnergy(link34_2);
  }
  if (storeHasResource(link34_1, 800)) {
    // link34_1.transferEnergy(link34_2);
  }

  const link36_0 = getLink(43, 5, W36N43);
  const link36_1 = getLink(38, 16, W36N43);
  const link36_2 = getLink(33, 34, W36N43);
  if (storeHasSpace(link36_1, 200)) {
    link36_0.transferEnergy(link36_1);
  }
  if (storeHasSpace(link36_2, 400)) {
    link36_1.transferEnergy(link36_2);
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

  const link38From = getLink(47, 12, W38N43);
  const link38To = getLink(25, 19, W38N43);
  if (getUsedCapacity(link38From) >= 150 || storeHasSpace(link38To)) {
    link38From.transferEnergy(link38To);
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
  if (getUsedCapacity(terminal34, RESOURCE_ZYNTHIUM_BAR) > 40000) {
    // terminal34.send(RESOURCE_ZYNTHIUM_BAR, 10000, W35N43)
  }

  // if (getUsedCapacity(terminal38) < 40000) {
  //   terminal35.send(RESOURCE_ENERGY, 10000, W38N43);
  // }
};

const setUpLabs = () => {
  let lab350 = getById("668c3165de4c6f7be357f862");
  let lab350x = getById("668a46d443f11ebccb5d309a");
  let lab350y = getById("668aab54cb336b29e70d629e");
  lab350.runReaction(lab350x, lab350y);

  let lab351 = getById("66c27dc9a0f6f601b170e41a");
  let lab352 = getById("66ac1ccbd8ddf9ff5e7e6d00");

  lab352.runReaction(lab350, lab351);
};

const setUpFactories = () => {
  getFactory(Game.rooms[W34N43]).produce(RESOURCE_ZYNTHIUM_BAR);
  getFactory(Game.rooms[W35N43]).produce(RESOURCE_REDUCTANT);
  // getFactory(Game.rooms[W35N43]).produce(RESOURCE_ZYNTHIUM_BAR);
  getFactory(Game.rooms[W38N43]).produce(RESOURCE_ZYNTHIUM_BAR);
};

module.exports = {
  run: function () {
    setUpLinks();
    setUpTerminals();
    setUpFactories();
    setUpLabs();
  },
};
