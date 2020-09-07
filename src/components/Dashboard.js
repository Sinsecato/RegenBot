import React, { Component } from "react";
import {
  checkTriggerPrices,
  closePosition,
  getLimitMap,
  addLimitOrder,
} from "../server";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Clock from "./Clock";
import BalanceTable from "./BalanceTable";
import LimitTable from "./Limits";
import ConfirmModal from "./ConfirmModal";
import ExitModal from "./ExitModal";
import RegenLogo from "../images/RegenLogo.png";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poolBalanceRows: [],
      limitOrderRows: [],
      confirmModalOpen: false,
      confirmModalText: {
        header: "Update Limit Order",
        symbol: "",
        stopComparator: "",
        stopPrice: "",
        targetComparator: "",
        targetPrice: "",
      },
      exitModalOpen: false,
      exitModalPending: false,
      exitModalText: {
        symbol: "",
      },
    };
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleCompChange = this.handleCompChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleUpdateClick = this.handleUpdateClick.bind(this);
    this.handleUpdateClose = this.handleUpdateClose.bind(this);
    this.handleTriggerUpdate = this.handleTriggerUpdate.bind(this);
    this.handleExitClick = this.handleExitClick.bind(this);
    this.handleExitClose = this.handleExitClose.bind(this);
    this.handlePositionExit = this.handlePositionExit.bind(this);
  }

  getOutputData() {
    this.getPoolBalanceOutput();
  }

  getPoolBalanceOutput() {
    const poolBalanceRows = [];
    const openPositionSymbols = [];
    checkTriggerPrices().then((result) => {
      if (result.positionsToClose.length > 0) {
        console.log("here");
        result.positionsToClose.map(async (symbol) => {
          await this.handlePositionExit(symbol);
        });
      }
      result.poolBalanceData.map((poolBalance) => {
        const output = {
          id: poolBalance.symbol,
          symbol: poolBalance.symbol,
          amount: (poolBalance.amount / 1e18).toPrecision(8),
          price: (poolBalance.sUsdPrice / 1e18).toPrecision(8),
          buttonProps: {
            symbol: poolBalance.symbol,
            amount: poolBalance.amount,
          },
          handleExitClick: this.handleExitClick,
        };
        poolBalanceRows[poolBalanceRows.length] = output;
        openPositionSymbols[openPositionSymbols.length] = poolBalance.symbol;
      });
      this.getLimitOrderOutput(poolBalanceRows, openPositionSymbols);
    });
  }

  getLimitOrderOutput(poolBalanceRows, _openPositionSymbols) {
    const openPositionSymbols = _openPositionSymbols;

    let limitOrderRows = [];
    getLimitMap().then((limitMap) => {
      openPositionSymbols.map((ops) => {
        const symbol = ops;
        let stopComparator;
        let stopPrice;
        let targetComparator;
        let targetPrice;
        if (symbol != "sUSD") {
          stopComparator = limitMap.has(symbol)
            ? limitMap.get(symbol).StopComparator
            : "";
          stopPrice = limitMap.has(symbol)
            ? limitMap.get(symbol).StopPrice
            : "0";
          targetComparator = limitMap.has(symbol)
            ? limitMap.get(symbol).TargetComparator
            : "";
          targetPrice = limitMap.has(symbol)
            ? limitMap.get(symbol).TargetPrice
            : "0";
          const output = {
            id: symbol + "_Limit",
            symbol: symbol,
            stopComparator: stopComparator,
            stopPrice: stopPrice,
            handleCompChange: this.handleCompChange,
            handlePriceChange: this.handlePriceChange,
            handleUpdateClick: this.handleUpdateClick,
            targetComparator: targetComparator,
            targetPrice: targetPrice,
            limitOrderMemory: limitMap.get(symbol),
          };
          limitOrderRows[limitOrderRows.length] = output;
        }
      });
      this.setState({ poolBalanceRows, limitOrderRows });
    });
  }

  componentDidMount() {
    this.getOutputData();
  }

  handleRefresh() {
    this.getOutputData();
  }

  handleCompChange(_symbol, _value, _type) {
    let limitOrderRows = this.state.limitOrderRows;
    for (let i = 0; i < limitOrderRows.length; i++) {
      if (limitOrderRows[i].symbol === _symbol) {
        if (_type === "stop") {
          limitOrderRows[i].stopComparator = _value;
        } else {
          limitOrderRows[i].targetComparator = _value;
        }
        break;
      }
    }
    this.setState({ limitOrderRows });
    console.log(this.state.limitOrderRows);
  }

  handlePriceChange(_symbol, _value, _type) {
    let limitOrderRows = this.state.limitOrderRows;
    for (let i = 0; i < limitOrderRows.length; i++) {
      if (limitOrderRows[i].symbol === _symbol) {
        if (_type === "stop") {
          limitOrderRows[i].stopPrice = _value;
        } else {
          limitOrderRows[i].targetPrice = _value;
        }
        break;
      }
    }
    this.setState({ limitOrderRows });
  }

  handleUpdateClose(_symbol) {
    this.setState({ confirmModalOpen: false });
  }

  handleExitClick(_symbol) {
    const exitModalText = {
      symbol: _symbol,
      modalAction: this.handlePositionExit,
    };
    this.setState({
      exitModalOpen: true,
      exitModalText: exitModalText,
      exitModalError: "",
    });
  }

  handlePositionExit(_symbol) {
    let _exitModalOpen = true;
    this.setState({ exitModalOpen: _exitModalOpen, exitModalPending: true });
    closePosition(_symbol).then((receipt) => {
      if (receipt.receipt === "sendError") {
        this.resetExitModal(
          _symbol,
          "ERROR - Could not send Tx, try again soon",
          true
        );
      } else if (receipt.receipt === "error") {
        this.resetExitModal(_symbol, "ERROR - Transaction Failed", true);
      } else {
        this.resetExitModal(_symbol, "", false);
        this.handleRefresh();
      }
    });
  }

  resetExitModal(_symbol, _error, _exitModalOpen) {
    const exitModalText = {
      symbol: _symbol,
      modalAction: this.handlePositionExit,
      error: _error,
    };
    this.setState({
      exitModalText: exitModalText,
      exitModalPending: false,
      exitModalOpen: _exitModalOpen,
    });
  }

  handleExitClose(_symbol) {
    this.setState({ exitModalOpen: false });
  }

  handleUpdateClick(_symbol) {
    const _limitOrderRow = this.findLimitOrderRow(_symbol);
    const confirmModalText = {
      header: "Update Limit Order",
      symbol: _symbol,
      stopComparator: _limitOrderRow.stopComparator,
      stopPrice: _limitOrderRow.stopPrice,
      targetComparator: _limitOrderRow.targetComparator,
      targetPrice: _limitOrderRow.targetPrice,
      modalAction: this.handleTriggerUpdate,
    };
    this.setState({
      confirmModalOpen: true,
      confirmModalText: confirmModalText,
    });
  }

  findLimitOrderRow(_symbol) {
    let limitOrderRows = this.state.limitOrderRows;
    for (let i = 0; i < limitOrderRows.length; i++) {
      if (limitOrderRows[i].symbol === _symbol) {
        return limitOrderRows[i];
      }
    }
  }

  handleTriggerUpdate(_symbol) {
    const _limitOrderRow = this.findLimitOrderRow(_symbol);
    addLimitOrder(
      _symbol,
      _limitOrderRow.stopComparator,
      _limitOrderRow.stopPrice,
      _limitOrderRow.targetComparator,
      _limitOrderRow.targetPrice
    );
    console.log(_limitOrderRow);
  }

  render() {
    return (
      <div>
        <div className="AppHeader">
          <div className="appHeaderLogoWrapper">
            <img src={RegenLogo} alt="Regen Bot" />
          </div>
          <div className="appRefreshWrapper">
            <Button
              variant="outlined"
              size="large"
              color="primary"
              endIcon={<RefreshIcon fontSize="large" color="secondary" />}
              onClick={this.handleRefresh}
            >
              <Clock action={this.handleRefresh} />
            </Button>
            <div className="RefreshLabel">Refresh Timer</div>
          </div>
        </div>
        <BalanceTable output={this.state.poolBalanceRows} />
        <br />
        <br />
        <LimitTable output={this.state.limitOrderRows} />
        <ConfirmModal
          open={this.state.confirmModalOpen}
          close={this.handleUpdateClose}
          text={this.state.confirmModalText}
        ></ConfirmModal>
        <ExitModal
          open={this.state.exitModalOpen}
          close={this.handleExitClose}
          pending={this.state.exitModalPending}
          text={this.state.exitModalText}
        ></ExitModal>
      </div>
    );
  }
}

export default Dashboard;
