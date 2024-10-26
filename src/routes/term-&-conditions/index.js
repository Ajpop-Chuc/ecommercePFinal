/**
 * Term And Condition Page
 */
/* eslint-disable */
import React, { Fragment } from 'react';

//component
import RctCard from '../../components/global/rct-card';
import ContentLoader from '../../components/global/loaders/ContentLoader';

// firebase
import firebase from '../../firebase';
import 'firebase/database';

// page title bar
import PageTitle from '../../components/widgets/PageTitle.js';


export default class TermAndCondition extends React.Component {

   constructor(props) {
		super(props);
		this.state = {
			termsConditions: null,
		}
	}

	componentDidMount() {
		this.getTermsConditionsData();
	}

	//get termsConditions data
	getTermsConditionsData() {
		const termsConditionsRef = firebase.database().ref('term_condition');
		termsConditionsRef.on('value', (snapshot) => {
			let termsConditions = snapshot.val();
			this.setState({
				termsConditions: termsConditions
			});
		});
	}
	createMarkup(value) {
		return { __html: value };
  	}

	render() {
		const { termsConditions } = this.state;
      return (
			<Fragment>
				{
					termsConditions !== null ?
						<div className="iron-tnc-page-wrap">
							<PageTitle
								title="terms &amp; conditions"
								desc="Please read and contact with if you have some issue."
							/>
							<div className="inner-container section-pad bg-base">
								<div className="container">
									<div className="iron-tnc-page">
									{termsConditions && termsConditions.map((item, index) => {
												return (
													<RctCard key={index}>
														<h4>{item.name}</h4>
														<p className="mb-0" dangerouslySetInnerHTML={this.createMarkup(`${item.content}`)}></p>
													</RctCard>
												)
											})
										}
									</div>
								</div>
							</div>
						</div>
						:
						<ContentLoader />
				}
			</Fragment>
      );
   }
}

