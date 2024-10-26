/**
 * FAQ Page
/* eslint-disable */
import React, { Fragment } from 'react';
import { Accordion, AccordionSummary, AccordionDetails   } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import ContentLoader from '../../components/global/loaders/ContentLoader';

// firebase
import firebase from '../../firebase';
import 'firebase/database';

// page title bar
import PageTitle from '../../components/widgets/PageTitle.js';

export default class FAQ extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: null,
			faq: null,
		}
	}

	componentDidMount() {
		this.getFaqData();
	}

	//get Faq data
	getFaqData() {
		const faqRef = firebase.database().ref('faq');
		faqRef.on('value', (snapshot) => {
			let faq = snapshot.val();
			this.setState({
				faq: faq
			});
		});
	}
	//define toggle  function for accordion
	handleChange = panel => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : false,
		});
	};

	render() {
		const { expanded, faq } = this.state;
		return (
			<Fragment>
				{
					faq !== null ?
						<div className="iron-faq-page-wrap">
							<PageTitle
								title="Frequently Asked Question"
								desc="We explained the basics question in this section."
							/>
							<div className="inner-container bg-base ">
								<div className="iron-faq-page section-pad pb-0">
									<div className="container">
										<Grid container spacing={3}>
											<Grid item xs={12} sm={12} md={12} lg={12} >
												<div className="block-title">
													<h2 className="mb-5">Get Instant answers for most common questions</h2>
													<p className="mb-0">{faq.content}</p>
												</div>
											</Grid>
										</Grid>
									</div>
									<div className="section-pad">
										<div className="container">
											{faq.faqs && faq.faqs.map((item, index) => {
												return (
													<Accordion key={index} expanded={expanded === `panel-${index}`} onChange={this.handleChange(`panel-${index}`)}
														className="iron-accordion-wrap">
														<AccordionSummary expandIcon={<ExpandMoreIcon />} className="iron-accordion-title">
															<h5 className="mb-0">{item.ques}</h5>
														</AccordionSummary>
														<AccordionDetails className="iron-accordion-desc">
															<p>{item.ans}</p>
														</AccordionDetails>
													</Accordion>
												)
											})}
										</div>
									</div>
									<div className="cta-v1">
										<div className="cta-overlay-bg section-gap">
											<div className="container">
												<Grid container spacing={3}>
													<Grid item lg={6} className="mx-auto">
														<div className="block-title text-center">
															<h2 className="font-bold mb-25">{faq.can_get_answer.heading}</h2>
															<h6 className="mb-25">{faq.can_get_answer.content}
                                                </h6>
															<Button component={Link} to="/contact-us" variant="contained" className="button btn-active btn-lg">
																submit request
                                                </Button>
														</div>
													</Grid>
												</Grid>
											</div>
										</div>
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

