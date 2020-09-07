const { ethers, Wallet, utils } = require("ethers");
const { pools } = require("./backend/poolAddresses");
const { decrypt } = require("./backend/decryption");
const { exitPosition } = require("./backend/exitPosition");
const {
  getPoolBalanceData,
  getBalanceAmount,
} = require("./backend/poolBalanceData");

//const inBytes = utils.formatBytes32String("test");

const network = process.env.REACT_APP_NETWORK.toString();
//const network = "ropsten";

const provider = new ethers.providers.InfuraProvider(
  network,
  process.env.REACT_APP_MY_INFURA_API
);

let KEY;
let wallet;
let dHedgeSigner;
async function createWallet(password) {
  KEY = await fetchKey(process.env.REACT_APP_ENC, password);
  try {
    wallet = new Wallet(KEY, provider);
    if (wallet.address === process.env.REACT_APP_MY_WALLET_ADDRESS) {
      dHedgeSigner = dHedgePoolContract.connect(wallet);
      return true;
    } else {
      console.log("false");
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function fetchKey(enc, password) {
  return await decrypt(enc, password);
}

const sUSDBytes = ethers.utils.formatBytes32String("sUSD");
const dHedgePoolContract = new ethers.Contract(
  pools.dhedge.address,
  pools.dhedge.abi,
  provider
);

const limitOrderDataMap = new Map();

let isPending = false;
function getTxPending() {
  return isPending;
}

async function checkTriggerPrices() {
  const poolBalanceData = await getPoolBalanceData(dHedgePoolContract);
  let positionsToClose = [];
  await poolBalanceData.forEach(async (_poolBalance) => {
    if (
      _poolBalance.symbol != "sUSD" &&
      limitOrderDataMap.has(_poolBalance.symbol)
    ) {
      const _currentPrice = _poolBalance.sUsdPrice / 1e18;
      const _limitOrder = limitOrderDataMap.get(_poolBalance.symbol);
      const _stopComparator = _limitOrder.StopComparator;
      const _stopPrice = _limitOrder.StopPrice;
      const _targetComparator = _limitOrder.TargetComparator;
      const _targetPrice = _limitOrder.TargetPrice;

      let isTrigger = false;
      isTrigger = await comparePrice(
        _currentPrice,
        _stopComparator,
        _stopPrice
      );
      if (isTrigger == false) {
        isTrigger = await comparePrice(
          _currentPrice,
          _targetComparator,
          _targetPrice
        );
      }
      if (isTrigger == true) {
        positionsToClose[positionsToClose.length] = _poolBalance.symbol;
        isPending = true;
        console.log(`${_poolBalance.symbol} Trigger Hit: ${isTrigger}`);
      }
    }
  });
  return {
    poolBalanceData: poolBalanceData,
    positionsToClose: positionsToClose,
    isPending: isPending,
  };
}

async function comparePrice(_currentPrice, _comparator, _triggerPrice) {
  if (_comparator === "Below") {
    if (_currentPrice < _triggerPrice) {
      return true;
    }
  } else if (_comparator === "Above") {
    if (_currentPrice > _triggerPrice) {
      return true;
    }
  }
  return false;
}

async function addLimitOrder(
  _symbol,
  _stopComparator,
  _stopPrice,
  _targetComparator,
  _targetPrice
) {
  limitOrderDataMap.set(_symbol, {
    StopComparator: _stopComparator,
    StopPrice: _stopPrice,
    TargetComparator: _targetComparator,
    TargetPrice: _targetPrice,
  });
}

async function getLimitMap() {
  return limitOrderDataMap;
}

async function getLimitOrderData() {
  return JSON.parse(limitOrderDataMap);
}

async function closePosition(_symbol) {
  const receiptObj = await exitPosition(
    _symbol,
    dHedgeSigner,
    dHedgePoolContract
  );
  return receiptObj;
}

exports.createWallet = createWallet;
exports.checkTriggerPrices = checkTriggerPrices;
exports.closePosition = closePosition;
exports.addLimitOrder = addLimitOrder;
exports.getLimitOrderData = getLimitOrderData;
exports.getLimitMap = getLimitMap;
exports.getTxPending = getTxPending;
exports.getBalanceAmount = getBalanceAmount;
