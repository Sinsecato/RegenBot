import { createMuiTheme } from "@material-ui/core/styles";
import { indigo, deepOrange } from "@material-ui/core/colors";
import { dark } from "@material-ui/core/styles/createPalette";

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: deepOrange[500],
    },
  },
});
