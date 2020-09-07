import React, { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import myTheme from "../theme";
import { ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import CustomText from "./CustomText";
import CustomSelect from "./CustomSelect";
import TableStyles from "./tableStyles";

export default function LimitTable(props) {
  const useStyles = makeStyles(TableStyles);
  const classes = useStyles();

  useEffect(() => {});

  return (
    <ThemeProvider theme={myTheme}>
      <div className="balanceTableWrapper">
        <div className="balanceTableHeader">
          <div className="balanceTableLabel">
            <div className="balanceTableLabelText">Order Triggers</div>
          </div>
        </div>
        <TableContainer className="tableContainer" component={Paper}>
          <Table className="balanceTable" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerLeft}>SYMBOL</TableCell>
                <TableCell className={classes.headerCenter}>
                  STOP LOSS
                </TableCell>
                <TableCell className={classes.headerCenter}>
                  PRICE TARGET
                </TableCell>
                <TableCell className={classes.headerRight}>
                  UPDATE LIMITS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.output.map((row) => (
                <TableRow>
                  <TableCell className={classes.bodyLeft}>
                    {row.symbol}
                  </TableCell>
                  <TableCell className={classes.bodyCenter}>
                    <div>
                      <CustomSelect
                        label="Comparator"
                        id={row.id + "_sc"}
                        value={row.stopComparator}
                        symbol={row.symbol}
                        type={"stop"}
                        handleChange={row.handleCompChange}
                      />
                      <CustomText
                        label="StopPrice"
                        id={row.id + "_sp"}
                        value={row.stopPrice}
                        symbol={row.symbol}
                        type="stop"
                        helperText=""
                        unsubmitted={false}
                        handleChange={row.handlePriceChange}
                      />
                    </div>
                  </TableCell>
                  <TableCell className={classes.bodyCenter}>
                    <div>
                      <CustomSelect
                        label="Comparator"
                        id={row.id + "_st"}
                        value={row.targetComparator}
                        symbol={row.symbol}
                        type={"target"}
                        handleChange={row.handleCompChange}
                      />
                      <CustomText
                        label="TargetPrice"
                        id={row.id + "_tp"}
                        value={row.targetPrice}
                        symbol={row.symbol}
                        type="target"
                        helperText=""
                        unsubmitted={false}
                        handleChange={row.handlePriceChange}
                      />
                    </div>
                  </TableCell>
                  <TableCell className={classes.bodyRight}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => row.handleUpdateClick(row.symbol)}
                    >
                      Update Limits
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
