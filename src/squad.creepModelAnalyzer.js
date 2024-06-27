/**
 * Get the cost of the given creep model
 * @param {object.<string, object.<string, number>>} creepModel
 * @returns {number} cost of creep model
 */
const getModelCost = (creepModel) => {
  let cost = 0;
  for (var part in creepModel.body) {
    let numOfParts = creepModel.body[part];
    switch (part) {
      case "work":
        cost += 100 * numOfParts;
        break;
      case "attack":
        cost += 80 * numOfParts;
        break;
      case "ranged_attack":
        cost += 150 * numOfParts;
        break;
      case "heal":
        cost += 250 * numOfParts;
        break;
      case "claim":
        cost += 600 * numOfParts;
        break;
      case "tough":
        cost += 10 * numOfParts;
        break;
      default:
        cost += 50 * numOfParts;
    }
  }
  return cost;
};

/**
 * Find total spawning time of a model
 * @param {object.<string, object.<string,number>>} creepModel
 * @returns {number} spawning time of a given model
 */
const getCreepSpawningTime = (creepModel) => {
  let timePerPart = 3;
  let numParts = 0;
  for (var part in creepModel.body) {
    numParts += creepModel.body[part];
  }
  return timePerPart * numParts;
};

/**
 * Get the body parts of the given creep model
 * @param {object.<string, object.<string, number>>} creepModel
 * @returns {string[]} an array of body parts
 */
const buildBodyParts = (creepModel) => {
  let parts = [];
  for (var part in creepModel.body) {
    let numOfParts = creepModel.body[part];
    parts = parts.concat(Array(numOfParts).fill(part));
  }
  return parts;
};

module.exports = {
  getModelCost,
  getCreepSpawningTime,
  buildBodyParts,
};
