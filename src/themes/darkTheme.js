/**
 * App Dark Theme
 */
import { createTheme  } from '@material-ui/core/styles';

const theme = createTheme ({
	palette: {
		type: "dark",
		primary: {
			main: '#2a2a2c'
		},
		secondary: {
			main: '#FF5722'
		},
		background: {
			paper: '#2a2a2c',
		}
	},
	overrides: {
		MuiFormControl: {
			root: {
				'& >div': {
					'&:hover': {
						'&:before': {
							borderColor: '#fff !important'
						},
					},
					'&:before': {
						borderColor: '#fff'
					},
					'&:after': {
						borderColor: '#fff'
					},
					'& svg': {
						fill: '#fff'
					},
					'& >div': {
						color: '#fff'
					}
				},
				'& label': {
					color: '#fff !important'
				},
				'& input': {
					color: '#fff',
				},
				'& textarea': {
					color: '#fff',
				},
				'& fieldset':{
					borderColor:'#fff !important'
				}
			},
		},
		
		MuiCheckbox: {
			root: {
				color: '#fff !important'
			},
			colorprimary: {
				color: '#fff'
			},
			colorSecondary: {
				color: '#fff'
			}
		},
		MuiTableRow:{
			root: {
				height:48
			},
		},
		MuiTableCell:{
			head: {
				color:'#fff'
			},
			body: {
				color:'#fff'
			},
		}
	},
	typography: {
		body1: {
			color: '#fff'
		}
	}
	// palette: {
	//    type: 'dark',
	//    types: {
	//       dark: {
	//          background: {
	//             paper: darkBgColor,
	//             default: darkBgColor,
	//             appBar: darkBgColor,
	//             contentFrame: darkBgColor,
	//             chip: darkBgColor,
	//             avatar: darkBgColor,
	//             tabs: darkBgColor
	//          }
	//       }
	//    },
	//    primary: {
	//       light: grey[400],
	//       main: grey[700],
	//       dark: grey[900],
	//       contrastText: '#fff'
	//    },
	//    secondary: {
	//       light: grey[700],
	//       main: grey[700],
	//       dark: grey[700],
	//       contrastText: '#fff'
	//    },
	//    background: {
	//       paper: darkBgColor,
	//       default: darkBgColor,
	//       appBar: darkBgColor,
	//       contentFrame: darkBgColor,
	//       chip: darkBgColor,
	//       avatar: darkBgColor,
	//       tabs: darkBgColor
	//    }
	// },
	// status: {
	//    danger: 'orange',
	// },
	// typography: {
	//    button: {
	//       fontWeight: 400,
	//       textAlign: 'capitalize'
	//    }
	// }
});

export default theme;