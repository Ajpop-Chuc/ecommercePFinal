/**
 * Privacy Policy Page
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

export default class PrivacyPolicy extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			privacyPolicy: null,
		}
	}

	componentDidMount() {
		this.getPrivacyPolicyData();
	}

	//get privacyPolicy data
	getPrivacyPolicyData() {
		const privacyPolicyRef = firebase.database().ref('privacy_policy');
		privacyPolicyRef.on('value', (snapshot) => {
			let privacyPolicy = snapshot.val();
			this.setState({
				privacyPolicy: privacyPolicy
			});
		});
	}
	createMarkup(value) {
		return { __html: value };
  	}

	render() {
		const { privacyPolicy } = this.state;
		return (
			<Fragment>
				{
					privacyPolicy !== null ?
						<div className="iron-privacy-policy-page-wrap">
							<PageTitle
								title="privacy policy"
								desc="Your information is fully secure with us."
							/>
							<div className="inner-container section-pad bg-base">
								<div className="container">
									<div className="iron-privacy-policy">
										{privacyPolicy && privacyPolicy.map((item, index) => {
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