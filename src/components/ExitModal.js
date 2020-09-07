import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

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

export default function ExitModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(props.open);
  const [text, setText] = React.useState(props.text);
  const [pending, setPending] = React.useState(props.pending);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setPending(true);
    props.text.modalAction(props.text.symbol);
  };

  useEffect(() => {
    setPending(props.pending);
  });

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
          <h1>Close Position</h1>
          <p id="confirm-stop-trigger" className={classes.modalText}>
            Are you sure you wish to close your{" "}
            <span className={classes.newValues}>{props.text.symbol}</span>{" "}
            Position?
          </p>

          {pending ? (
            <div>
              <CircularProgress /> Tx Pending
            </div>
          ) : (
            <div>
              <Button variant="outlined" size="large" onClick={handleSubmit}>
                CLOSE POSITION
              </Button>{" "}
              {props.text.error}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
