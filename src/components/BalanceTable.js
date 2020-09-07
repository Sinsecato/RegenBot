import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TableCell from "@material-ui/core/TableCell";
import LaunchIcon from "@material-ui/icons/Launch";

import myTheme from "../theme";
import { ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import TableStyles from "./tableStyles";

export default function BalanceTable(props) {
  const useStyles = makeStyles(TableStyles);
  const classes = useStyles();

  return (
    <ThemeProvider theme={myTheme}>
      <div className="balanceTableWrapper">
        <div className="balanceTableHeader">
          <div className="balanceTableLabel">
            <div className="balanceTableLabelText">Pool Balances</div>
            <div>
              <a
                href={
                  "https://etherscan.io/address/" +
                  process.env.REACT_APP_MY_DHEDGE_POOL
                }
                target="_blank"
              >
                {process.env.REACT_APP_MY_DHEDGE_POOL}
                <LaunchIcon fontSize="small" />
              </a>
            </div>
          </div>
        </div>
        <TableContainer className="tableContainer" component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerLeft}>SYMBOL</TableCell>
                <TableCell className={classes.headerCenter}>BALANCE</TableCell>
                <TableCell className={classes.headerCenter}>PRICE</TableCell>
                <TableCell className={classes.headerRight}>
                  CLOSE POSITION
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.output.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className={classes.bodyLeft}>
                    {row.symbol}
                  </TableCell>
                  <TableCell className={classes.bodyCenter}>
                    {row.amount}
                  </TableCell>
                  <TableCell className={classes.bodyCenter}>
                    {row.price}
                  </TableCell>
                  <TableCell className={classes.bodyRight}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => row.handleExitClick(row.symbol)}
                    >
                      Close Position
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </ThemeProvider>
  );
}
