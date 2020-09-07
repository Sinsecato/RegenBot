const { ethers, Wallet, utils } = require("ethers");
const { getGasPrice } = require("./gasCalls");
const { getPoolBalanceData, getBalanceAmount } = require("./poolBalanceData");

const sUSDBytes = ethers.utils.formatBytes32String("sUSD");
let pendingTxMap = new Map();
let failedTxCount = 0;
let lastFailedTxTimestamp = 0;

async function exitPosition(_symbol, dHedgeSigner, _dHedgePoolContract) {
  const isTxPause = await checkTxPause();
  if (!isTxPause) {
    const _symbolBytes = ethers.utils.formatBytes32String(_symbol);
    const _poolBalanceData = await getPoolBalanceData(_dHedgePoolContract);
    const _amount = await getBalanceAmount(_poolBalanceData, _symbol);
    console.log(_amount);
    const isSymbolPending = await checkPending(_symbol);

    if (isSymbolPending === true) {
      return { receipt: false, pendingTxEntry: pendingTxMap.get(_symbol) };
    } else if (isSymbolPending === "error") {
      pendingTxMap.set(_symbol, {
        pending: false,
        nonce: "",
        tx: "",
      });
      return { receipt: "error", pendingTxEntry: "" };
    } else if (isSymbolPending === false) {
      const tx = await submitCloseTx(
        dHedgeSigner,
        _symbol,
        _symbolBytes,
        _amount
      );

      if (tx) {
        return await txConfirmation(_symbol, tx);
      } else {
        return { receipt: "sendError", pendingTxEntry: null };
      }
    }
  }
  return { recept: false, pendingTxEntry: null };
}

async function checkTxPause() {
  //If 3 Failed TX, wait 1 hour before trying next Tx.  Returns true if Pause Needed (isTxPause)
  if (failedTxCount > 2) {
    const _curDate = new Date();
    const _curTimestamp = _curDate.getTime();
    const _timeDif = _curTimestamp - lastFailedTxTimestamp;
    console.log(
      `3 Failed Tx in a Row - Tx halted unitl 1 hour past this timetamp: ${lastFailedTxTimestamp}`
    );
    if (_timeDif > 3600000) {
      failedTxCount = 2;
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

async function checkPending(_symbol) {
  let isPending = false;
  if (pendingTxMap.has(_symbol)) {
    isPending = pendingTxMap.get(_symbol).pending;
  }
  return isPending;
}

async function submitCloseTx(dHedgeSigner, _symbol, _symbolBytes, _amount) {
  try {
    const _gasPrice = await getGasPrice();
    let overrides = {
      gasPrice: utils.parseUnits(_gasPrice.toString(), "gwei"),
    };
    const tx = await dHedgeSigner.exchange(
      _symbolBytes,
      _amount,
      sUSDBytes,
      overrides
    );
    console.log("Tx: " + JSON.stringify(tx));
    pendingTxMap.set(_symbol, {
      pending: true,
      nonce: tx.nonce,
      tx: tx,
    });
    return tx;
  } catch (err) {
    console.error(err);
    pendingTxMap.set(_symbol, {
      pending: "error",
      nonce: "",
      tx: "",
    });
    return null;
  }
}

async function txConfirmation(_symbol, _tx) {
  try {
    const receipt = await _tx.wait().then((result) => {
      failedTxCount = 0;
      console.log(result);
      pendingTxMap.set(_symbol, {
        pending: false,
        nonce: "",
        tx: "",
      });
    });
    return { recept: receipt, pendingTxEntry: pendingTxMap.get(_symbol) };
  } catch (err) {
    failedTxCount++;
    const _lastFailedTxDate = new Date();
    lastFailedTxTimestamp = _lastFailedTxDate.getTime();
    console.error(`outer: ${err}`);
    pendingTxMap.set(_symbol, {
      pending: "error",
      nonce: "",
      tx: "",
    });
    console.log(pendingTxMap.get(_symbol));
    return { receipt: "error", pendingTxEntry: err };
  }
}

exports.exitPosition = exitPosition;
