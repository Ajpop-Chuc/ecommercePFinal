/**
 * Theme Options
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button,IconButton } from '@material-ui/core';
// redux actions
import {
	rtlLayoutAction,
	darkModeAction
} from '../../actions/action';

class ThemeOptions extends Component {

	/**
	 * RTL Mode Event Hanlder
	*/
   rtlLayoutOption(value) {
      let body = document.body;
      if (value === true) {
         body.classList.add("rtl-layout");
      }
      else {
         body.classList.remove("rtl-layout");
      }
      this.props.rtlLayoutAction(value);
	}
	/**
	 * Dark Mode Event Hanlder
	*/
	darkModeHanlder(isTrue) {
		let body = document.body;
		if (isTrue === true) {
			body.classList.add("dark-mode");
		}
		else {
			body.classList.remove("dark-mode");
		}
		this.props.darkModeAction(isTrue);
	}

   render() {
      const { rtlLayout,darkMode } = this.props;
      return (
         <div className="custom-box">
            <div>
               {rtlLayout === false ?
                  <Button className="btn rtl-box py-10 px-0" onClick={() => this.rtlLayoutOption(true)}>RTL</Button>
                  :
                  <Button className="btn rtl-box py-10 px-0" onClick={() => this.rtlLayoutOption(false)}>LTR</Button>
               }
            </div>
				<div className="pt-5">
               {darkMode === false ?
						<IconButton className="btn rtl-box py-10 px-0" 
							onClick={() => this.darkModeHanlder(true)}
						>
							<i className="material-icons" >brightness_4</i>
						</IconButton>
                  :
						<IconButton className="btn rtl-box py-10 px-0" 
							onClick={() => this.darkModeHanlder(false)}
						>
							<i className="material-icons">brightness_4</i>
						</IconButton>
               }
            </div>
         </div>
      );
   }
}

// map state to props
const mapStateToProps = ({ appSettings }) => {
   const { rtlLayout,darkMode } = appSettings;
   return { rtlLayout,darkMode };
};

export default connect(mapStateToProps, {
	rtlLayoutAction,
	darkModeAction
})(ThemeOptions);
