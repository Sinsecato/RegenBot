// dHedge ABI
const DHEDGE_POOL_ABI = [
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "sourceKey",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "sourceAmount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "destinationKey",
        type: "bytes32",
      },
    ],
    name: "exchange",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getFundComposition",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

exports.pools = {
  dhedge: {
    address: process.env.REACT_APP_MY_DHEDGE_POOL,
    abi: DHEDGE_POOL_ABI,
  },
};
