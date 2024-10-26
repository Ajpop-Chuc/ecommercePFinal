/**
 * About Us Page
 */
import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// page title bar
import PageTitle from '../../components/widgets/PageTitle.js';

//firebase
import firebase from "../../firebase";
import 'firebase/database';

//component
import TestimonialV2 from '../../components/widgets/TestimonialV2';
import TeamGrid from '../../components/widgets/TeamGrid.js';
import ContactForm from '../../components/global/forms/ContactForm.js';
import ContentLoader from '../../components/global/loaders/ContentLoader.js';

export default class AboutUS extends Component {

   constructor(props) {
      super(props);
      this.state = {
			aboutInfo:null,
			missionVision:null,
         teamData: null,
         testimonial: []

      }
   }

   componentDidMount() {
		this.getAboutInfo();
		this.getMissionVision()
      this.getTestimonial();
		this.getTeamData();
   }

	// About Info data
   getAboutInfo() {
      const aboutInfoRef = firebase.database().ref('about_info');
      aboutInfoRef.on('value', (snapshot) => {
         //console.log(snapshot.val())
         let aboutInfo = snapshot.val();
         this.setState({
            aboutInfo: aboutInfo
         });
      });
	}
	// Mission and Vision data
   getMissionVision() {
      const missionVisionRef = firebase.database().ref('mission_vision');
      missionVisionRef.on('value', (snapshot) => {
         //console.log(snapshot.val())
         let missionVision = snapshot.val();
         this.setState({
            missionVision: missionVision
         });
      });
   } 
   // testimonial data
   getTestimonial() {
      const testimonialRef = firebase.database().ref('testimonial');
      testimonialRef.on('value', (snapshot) => {
         //console.log(snapshot.val())
         let testimonial = snapshot.val();
         this.setState({
            testimonial: testimonial
         });
      });
   }

   // team data
   getTeamData() {
      const teamDataRef = firebase.database().ref('team_data');
      teamDataRef.on('value', (snapshot) => {
         //console.log(snapshot.val())
         let teamData = snapshot.val();
         this.setState({
            teamData: teamData
         });
      });
   }

   render() {

      const { aboutInfo, missionVision, testimonial, teamData } = this.state;

      return (
         <Fragment>
            {testimonial !== null && teamData !== null && aboutInfo !== null && missionVision !== null ?
               <div className="iron-about-page-wrap">
                  <PageTitle
                     title="About Us"
                     desc="Creative team and wide goals."
                  />
                  <div className="inner-container">
                     <div className="about-detail-page">
                        {/* about-info sec start */}
                        <div className="about-info section-pad bg-base">
                           <div className="container">
                              <Grid container spacing={4} direction="row-reverse" className="justify-content-center align-items-center">
                                 <Grid item xs={12} sm={12} md={6} lg={6} className="text-md-right">
                                    <img src={require(`../../assets/images/${aboutInfo.image}`).default} width="700" height="700" alt="about-us" />
                                 </Grid>
                                 <Grid item xs={12} sm={12} md={6} lg={6} className="d-flex justify-content-center align-items-center">
                                    <div className="mr-lg-40 ">
                                       <h2 className="mb-30 font-bold font-italic">{aboutInfo.heading}</h2>
                                       <h4 className="mb-20 font-bold">{aboutInfo.sub_heading}</h4>
                                       <p className="mb-40">{aboutInfo.content}</p>
                                       <Button variant="contained" className="button btn-active btn-lg">
                                          read more
													</Button>
                                    </div>
                                 </Grid>
                              </Grid>
                           </div>
                        </div>
                        {/* about-alt sec start */}
                        <div className="about-alt-section section-pad bg-secondary">
                           <div className="container">
										{missionVision && missionVision.map((item, index) => {
											return (
												<Grid key={index} container spacing={4} direction="row" className="grid-items mb-30 mb-md-0">
													<Grid item xs={12} sm={12} md={6} lg={6}>
														<img src={require(`../../assets/images/${item.image}`).default} width="700" height="700" alt="about-us" />
													</Grid>
													<Grid item xs={12} sm={12} md={6} lg={6} className="d-flex justify-content-center align-items-center">
														<div className="mr-40">
															<h2 className="font-bold">{item.heading}</h2>
															<h5>{item.sub_heading}</h5>
															<p>{item.content}</p>
														</div>
													</Grid>
												</Grid>	
											)
										})}
                           </div>
                        </div>
                        {/*testimonial 2 sec start */}
                        <TestimonialV2 data={testimonial} />
                        {/* team grid sec start */}
                        <div className="iron-team-grid-wrap section-pad">
                           <div className="container">
                              <div className="iron-sec-heading-wrap heading-font-v2 text-center mb-sm-60 mb-40">
                                 <div className="heading-title">
                                    <h2>Meet Our Crew</h2>
                                 </div>
                              </div>
                              <TeamGrid teamMembers={teamData}></TeamGrid>
                           </div>
                        </div>
                        {/* about contact form sec start */}
                        <div className="bg-base about-contact-form">
                           <div className="container-fluid px-0">
                              <Grid container spacing={0} direction="row">
                                 <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <div className="about-contact-bg"> </div>
                                 </Grid>
                                 <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <div className="about-contact-form-inner">
                                       <div className="block-title mb-60">
                                          <h2>Write to us</h2>
                                       </div>
                                       <ContactForm />
                                    </div>
                                 </Grid>
                              </Grid>
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

