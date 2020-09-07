const { parseDhedgeBalances } = require("./parseDhedgeBalances");

async function getPoolBalanceData(_dHedgePoolContract) {
  const poolBalancesArray = await _dHedgePoolContract.getFundComposition();
  const poolBalanceData = await parseDhedgeBalances(poolBalancesArray);

  return poolBalanceData;
}

async function getBalanceAmount(_poolBalanceData, _symbol) {
  for (let i = 0; i < _poolBalanceData.length; i++) {
    if (_poolBalanceData[i].symbol === _symbol) {
      return _poolBalanceData[i].amount;
    }
  }
}

exports.getPoolBalanceData = getPoolBalanceData;
exports.getBalanceAmount = getBalanceAmount;
