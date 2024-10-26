/**
 * App Settings
 */
import { currencies, currencyUnicode } from "../assets/data/currencydata";

//data
import { languages } from "../assets/data/localeData";

// themes
import primaryTheme from '../themes/primaryTheme';
import darkTheme from '../themes/darkTheme';

//action types
import {
   RTL_LAYOUT,
   CHANGE_CURRENCY,
   HIDE_ALERT,
   SET_LANGUAGE,
   SHOW_ALERT,
	COLLAPSED_SIDEBAR,
	DARK_MODE
} from "../actions/types";

//app config
import AppConfig from "../constants/AppConfig";

const INITIAL_STATE = {
   currencies,
   selectedCurrency: currencies[1],
   currencyUnicode,
   languages,
   selectedLocale: AppConfig.locale,
   showAlert: false,
   alertType: 'success',
   alertMessage: 'Initial Message',
   rtlLayout: AppConfig.rtlLayout,
	navCollapsed: AppConfig.navCollapsed,
	darkMode: false,
	theme:primaryTheme,
}

const AppSettings = (state = INITIAL_STATE, action) => {
   switch (action.type) {
      // collapse sidebar
      case COLLAPSED_SIDEBAR:
         return { ...state, navCollapsed: action.isCollapsed };

      case CHANGE_CURRENCY:
         return {
            ...state,
            selectedCurrency: action.payload
         }
      case SET_LANGUAGE: {
         return {
            ...state,
            selectedLocale: action.payload
         }
      }
      case SHOW_ALERT:
         return {
            ...state,
            showAlert: true,
            alertMessage: action.payload.message,
            alertType: action.payload.type
         }
      case HIDE_ALERT:
         return {
            ...state,
            showAlert: false
         }
      // Rtl layout
      case RTL_LAYOUT:
			return { ...state, rtlLayout: action.payload };

		// Dark mode
		case DARK_MODE:
			let isTrue = action.payload;
			let activeTheme = '';
			if (isTrue === true) {
				activeTheme = darkTheme;
			}else{
				activeTheme = primaryTheme;
			}
			return { ...state, darkMode: action.payload,theme:activeTheme };

		default:
			return { ...state };
			
   }
}

export default AppSettings;