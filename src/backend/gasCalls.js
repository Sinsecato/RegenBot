const axios = require("axios");

async function getGasPrice() {
  return await gasCall();
}

async function gasCall() {
  try {
    let _fast = 0;
    await axios
      .get(
        "https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=" +
          process.env.REACT_APP_ETHGASSTATION_KEY
      )
      .then((res) => {
        _fast = res.data.fast / 10 + 5;
      });
    return _fast;
  } catch (err) {
    console.log(err);
  }
}

exports.getGasPrice = getGasPrice;
