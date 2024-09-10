const {
  getUsedCapacity,
  storeHasSpace,
  storeHasResource,
  storeIsEmpty,
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
  const link34_to = getLink(25, 7, W34N43);
  if (storeHasResource(link34_0, 150) || storeHasSpace(link34_to)) {
    link34_0.transferEnergy(link34_to);
  }
  if (storeHasResource(link34_1, 300) && storeIsEmpty(link34_to)) {
    link34_1.transferEnergy(link34_to, 300);
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
  if (storeHasResource(link38From, 150) || storeHasSpace(link38To)) {
    link38From.transferEnergy(link38To);
  }
};

/**
 * Fill energy from a terminal to another terminal to the given amount
 * @param {StructureTerminal} from
 * @param {StructureTerminal} to
 * @param {number} fillToAmount
 */
const sendEnergy = (from, to, fillToAmount) => {
  if (from && to && getUsedCapacity(to) < fillToAmount) {
    console.log(
      "structure.setup.sendEnergy()",
      from.send(RESOURCE_ENERGY, 5000, to.room.name)
    );
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

  sendEnergy(terminal38, terminal37, 40000);
  // sendEnergy(terminal35, terminal36, 20000);
  sendEnergy(terminal34, terminal36, 20000);
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
