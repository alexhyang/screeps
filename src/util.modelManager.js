var model = {
  /**
   * Get the cost of the given creep model
   * @param {object.<string, object.<string, number>>} creepModel
   * @returns {number} cost of creep model
   */
  getModelCost: (creepModel) => {
    let cost = 0;
    for (var part in creepModel.body) {
      let numOfParts = creepModel.body[part];
      console.log(part, numOfParts);
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
  },

  /**
   * Get the body parts of the given creep model
   * @param {object.<string, object.<string, number>>} creepModel
   * @returns {string[]} an array of body parts
   */
  getBodyParts: (creepModel) => {
    let parts = [];
    for (var part in creepModel.body) {
      let numOfParts = creepModel.body[part];
      parts = parts.concat(Array(numOfParts).fill(part));
    }
    return parts;
  },
};

module.exports = model;
