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
 * Get orders with given information and save them in memory
 * @param {string} resourceType
 * @param {number} minPrice minimum price of orders to be saved
 * @param {number} countdown time left to update orders in memory
 */
const updateOrdersInMemory = (resourceType, minPrice, countdown = 11) => {
  if (Memory.orderCountdown == undefined || Memory.orderCountdown <= 0) {
    Memory.orders = Game.market
      .getAllOrders({
        type: ORDER_BUY,
        resourceType: resourceType,
      })
      .filter((o) => o.price > minPrice)
      .sort((a, b) => b.price - a.price);
    Memory.orderCountdown = countdown;
  }
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
    case RESOURCE_KEANIUM:
      minPrice = 115;
      break;
    case RESOURCE_ZYNTHIUM_BAR:
      minPrice = 170;
      break;
    default:
  }

  updateOrdersInMemory(resourceType, minPrice);

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

  Memory.orderCountdown--;
};

module.exports = {
  createOrder,
  dealOrders,
};
