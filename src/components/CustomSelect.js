import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
  selectField: {
    width: "12ch",
    fontSize: "1rem",
  },
}));

export default function CustomText(props) {
  const classes = useStyles();

  const handleChange = (event) => {
    props.handleChange(props.symbol, event.target.value, props.type);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={props.key}>{props.label}</InputLabel>
      <Select
        className={classes.selectField}
        labelId="demo-simple-select-label"
        id={props.id}
        value={props.value}
        onChange={handleChange}
      >
        <MenuItem value="">""</MenuItem>
        <MenuItem value={"Below"}>Below</MenuItem>
        <MenuItem value={"Above"}>Above</MenuItem>
      </Select>
    </FormControl>
  );
}
