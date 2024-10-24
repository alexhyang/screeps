const { getUsedCapacity } = require("./util.resourceManager");
const { getTerminal } = require("./util.structureFinder");

/**
 * Create an order in the market
 * @param {number} amount
 * @param {number} price
 * @param {string} resourceType by default RESOURCE_HYDROGEN
 * @param {string} roomName by default "W35N43"
 */
const createOrder = (
  amount,
  price,
  resourceType = RESOURCE_HYDROGEN,
  roomName = "W35N43"
) => {
  let result = Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: resourceType,
    price: price,
    totalAmount: amount,
    roomName: roomName,
  });
  console.log(result);
  if (result == OK) {
    console.log(
      `Order created: ${amount} ${resourceType} at ${price} from ${roomName}`
    );
  }
};

/**
 * Get orders from market and save them in memory
 * @param {string} resourceType
 * @param {number} minPrice minimum price of orders to be saved
 */
const updateOrdersInMemory = (resourceType, minPrice) => {
  Memory.orders = Game.market
    .getAllOrders({
      type: ORDER_BUY,
      resourceType: resourceType,
    })
    .filter((o) => o.price > minPrice)
    .sort((a, b) => b.price - a.price);
};

/**
 * Determine if orders in memory should be updated
 * @returns {boolean} true if it's time to update orders in memory, false
 *    otherwise
 */
const shouldUpdateOrders = () => {
  return Memory.orderCountdown == undefined || Memory.orderCountdown <= 0;
};

/**
 * Reset order count down to given value
 * @param {number} countdown
 */
const resetOrderCountDown = (countdown = 550) => {
  Memory.orderCountdown = countdown;
};

/**
 * Deal orders of given resource type from specified room
 * @param {string} myRoomName
 * @param {string} resourceType
 * @param {boolean} deal deal first order in list if true
 */
const dealOrders = (myRoomName, resourceType, deal) => {
  let minPrice;
  let sendCost;
  let terminal = getTerminal(Game.rooms[myRoomName]);
  switch (resourceType) {
    case RESOURCE_HYDROGEN:
      minPrice = 127;
      break;
    case RESOURCE_REDUCTANT:
      minPrice = 830;
      break;
    case RESOURCE_KEANIUM:
      minPrice = 115;
      break;
    case RESOURCE_ZYNTHIUM_BAR:
      minPrice = 175;
      break;
    default:
  }

  if (shouldUpdateOrders()) {
    updateOrdersInMemory(resourceType, minPrice);
    resetOrderCountDown(550);
  }

  if (Memory.orders != undefined && Memory.orders.length > 0) {
    console.log("order countdown", Memory.orderCountdown);
    console.log("terminal cool down", terminal.cooldown);
    Memory.orders.forEach((o) => {
      const { id, price, amount, roomName } = o;
      sendCost = Game.market.calcTransactionCost(amount, myRoomName, roomName);
      console.log(
        `id: ${id}`,
        `price: ${price}`,
        `amount: ${amount}`,
        `cost: ${sendCost}`
      );
    });
  }

  let order = Memory.orders[0];
  if (order && deal == true) {
    const { id, amount } = Memory.orders[0];
    if (terminal.cooldown == 0 && getUsedCapacity(terminal) > sendCost) {
      let result = Game.market.deal(id, amount, myRoomName);
      console.log(result);
    }
  }
};

module.exports = {
  dealTransactions: () => {
    if (Memory.orderCountdown <= 0) {
      Memory.orderCountdown = 0;
    } else {
      Memory.orderCountdown--;
    }

    // dealOrders("W35N43", RESOURCE_REDUCTANT, false);
    // dealOrders("W35N43", RESOURCE_ZYNTHIUM_BAR, false);
    // console.log(Game.market.deal("66d52d531b117e0012b318b3", 3000, "W34N43"));
    // Game.market.changeOrderPrice("66c57d55270e2b00128e4bbc", 190);
  },
};
