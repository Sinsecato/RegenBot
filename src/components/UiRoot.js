import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { ThemeProvider } from "@material-ui/core/styles";
import myTheme from "../theme";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { createWallet } from "../server";

export default function UiRoot() {
  const [password, setPassword] = React.useState(false);

  const handleLogin = (_input) => {
    createWallet(_input).then((result) => {
      setPassword(result);
    });
  };

  useEffect(() => {
    window.onbeforeunload = confirmExit;
    function confirmExit() {
      return "show warning";
    }
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={myTheme}>
        <Container fixed>
          (
          {password ? (
            <Dashboard />
          ) : (
            <Login open={true} action={handleLogin} />
          )}
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}
