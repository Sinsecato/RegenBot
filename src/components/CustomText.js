import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { getLimitMap } from "../server";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "14ch",
  },
}));

export default function CustomText(props) {
  const classes = useStyles();

  let limitMap = new Map();

  const [memoryPrice, setMemoryPrice] = React.useState(props.value);
  const [price, setPrice] = React.useState(props.value);
  const [unsubmitted, setUnsubmitted] = React.useState(props.unsubmitted);
  const [helperText, setHelperText] = React.useState(props.helperText);

  useEffect(() => {
    checkSubmitted();
  });

  const handleChange = (event) => {
    const input = event.target.value;
    fetchLimitMap(input).then(() => {
      setPrice(input);
      setUnsubmitted(input != memoryPrice);
      props.handleChange(props.symbol, input, props.type);
    });
  };

  async function fetchLimitMap(input) {
    try {
      limitMap = await getLimitMap();
      if (limitMap.has(props.symbol)) {
        let _memoryPrice = limitMap.get(props.symbol)[props.label];
        setMemoryPrice(_memoryPrice);
      } else {
        setMemoryPrice(0);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const checkSubmitted = () => {
    fetchLimitMap(price).then(() => {
      setUnsubmitted(price != memoryPrice);
      unsubmitted ? setHelperText("Not Updated") : setHelperText("");
    });
  };

  return (
    <TextField
      error={unsubmitted}
      className={classes.textField}
      label={props.label}
      helperText={helperText}
      id={props.id}
      type="Number"
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
      variant="outlined"
      value={price}
      onChange={handleChange}
    />
  );
}
