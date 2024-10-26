/**
 * App Light Theme
 */
import { createTheme  } from '@material-ui/core/styles';

const theme = createTheme ({
   palette: {
		type: "light",
      primary: {
         main: '#283593'
      },
      secondary: {
         main: '#FF5722'
      }
	}
	,overrides: {
		MuiTableRow:{
			root: {
				height:48
			},
		},
	},
});

export default theme;