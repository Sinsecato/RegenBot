import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: "1.5rem",
    color: "#fff",
  },
  modalText: {
    fontSize: "2rem",
  },
  newValues: {
    color: "#ff5722",
    fontSize: "1.5rem",
  },
  wrapper: {
    position: "relative",
    padding: ".75rem",
  },
  loginButton: {
    padding: "14px 20px",
  },
}));

export default function Login(props) {
  const [input, setInput] = React.useState("");
  const classes = useStyles();

  const handleBlur = (event) => {
    setInput(event.target.value);
  };

  const handleLogin = () => {
    props.action(input);
  };

  return (
    <div>
      <Modal
        open={props.open}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <div>
            <span className={classes.wrapper}>
              <TextField
                variant="outlined"
                placeholder="password"
                onBlur={handleBlur}
              />
            </span>
            <span className={classes.wrapper}>
              <Button
                className={classes.loginButton}
                variant="outlined"
                size="large"
                color="secondary"
                onClick={handleLogin}
              >
                Login
              </Button>
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
