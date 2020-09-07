import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

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
    padding: "2rem",
    color: "#fff",
    minWidth: "40%",
  },
  modalText: {
    fontSize: "1rem",
  },
  newValues: {
    color: "#ff5722",
    fontSize: "1.5rem",
  },
}));

export default function ConfirmModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(props.open);
  const [success, setSuccess] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSuccess(false);
    props.close();
  };

  const handleClick = () => {
    props.text.modalAction(props.text.symbol);
    setSuccess(true);
  };

  useEffect(() => {});

  return (
    <div>
      <Modal
        className={classes.modal}
        open={props.open}
        onClose={props.close}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <h1>
            {props.text.header} for {props.text.symbol}
          </h1>
          <p id="confirm-stop-trigger" className={classes.modalText}>
            Stop Trigger Price:{"   "}
            <span className={classes.newValues}>
              {props.text.stopComparator} ${props.text.stopPrice}
            </span>
          </p>
          <p id="confirm-stop-trigger" className={classes.modalText}>
            Profit Trigger Price:{"   "}
            <span className={classes.newValues}>
              {props.text.targetComparator} ${props.text.targetPrice}
            </span>
          </p>
          {success ? (
            <div>
              <h1>Success!</h1>
              <Button variant="outlined" size="large" onClick={handleClose}>
                CLOSE
              </Button>
            </div>
          ) : (
            <Button variant="outlined" size="large" onClick={handleClick}>
              CONFIRM
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}
