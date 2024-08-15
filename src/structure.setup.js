const { getTerminal } = require("./util.structureFinder");

const W36N43 = "W36N43";
const W35N43 = "W35N43";
const W34N43 = "W34N43";
const W38N43 = "W38N43";
const W37N43 = "W37N43";

/**
 * Set up links in my rooms
 */
const setUpLinks = () => {
  const link36From = Game.rooms[W36N43].lookForAt("structure", 38, 16)[0];
  const link36To = Game.rooms[W36N43].lookForAt("structure", 33, 34)[0];
  if (link36To.store.getUsedCapacity(RESOURCE_ENERGY) < 400) {
    link36From.transferEnergy(link36To);
  }

  const link37From = Game.rooms[W37N43].lookForAt("structure", 24, 10)[0];
  const link37To = Game.rooms[W37N43].lookForAt("structure", 27, 28)[0];
  if (link37To.store.getUsedCapacity(RESOURCE_ENERGY) < 400) {
    link37From.transferEnergy(link37To);
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

  if (terminal35.store.getUsedCapacity(RESOURCE_ENERGY) < 60000) {
    // terminal34.send(RESOURCE_ENERGY, 5000, W35N43);
  }

  if (terminal36.store.getUsedCapacity(RESOURCE_ENERGY) < 30000) {
    // terminal34.send(RESOURCE_ENERGY, 5000, W36N43);
  }
  if (terminal37.store.getUsedCapacity(RESOURCE_ENERGY) < 30000) {
    // terminal38.send(RESOURCE_ENERGY, 5000, W37N43);
  }
};

module.exports = {
  run: function () {
    setUpLinks();
    setUpTerminals();
  },
};
