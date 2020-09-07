const { ethers } = require("ethers");

async function parseDhedgeBalances(_balanceArray) {
  const _symbolBytes = _balanceArray[0];
  const _balanceAmounts = _balanceArray[1];
  const _sUsdPrices = _balanceArray[2];
  const poolBalanceObj = [];
  for (let i = 0; i < _balanceAmounts.length; i++) {
    const _tokenQty = _balanceAmounts[i].toString();
    const _symbolString = ethers.utils.parseBytes32String(_symbolBytes[i]);
    const _sUsdPrice = _sUsdPrices[i].toString();
    if (_tokenQty > 0) {
      poolBalanceObj[poolBalanceObj.length] = {
        symbol: _symbolString,
        amount: _tokenQty,
        sUsdPrice: _sUsdPrice,
      };
    }
  }
  return poolBalanceObj;
}

exports.parseDhedgeBalances = parseDhedgeBalances;
