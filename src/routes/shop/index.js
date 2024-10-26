/**
 * shop Page
 */
import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
   InstantSearch,
   Hits,
   Stats,
   SortBy,
   Configure,
   Pagination
} from 'react-instantsearch-dom';
import { Grid } from '@material-ui/core';

//page title
import PageTitle from '../../components/widgets/PageTitle';
import Hit from '../../components/ecommerce/shop/hit';
import Filter from '../../components/ecommerce/shop/filter';


const client = algoliasearch(
	'latency',
	'6be0576ff61c053d5f9a3225e2a90f76'
);
class Shop extends React.Component {

   render() {
      return (
         <div className="iron-Shop-page-wrap">
            <PageTitle
               title="Products"
            />
            <div className="product-list section-pad iron-shop-wrapper">
               <div className="container">
                  <InstantSearch 
                     indexName="instant_search" 
                     searchClient={client}
                  >
                     <Grid container spacing={4}>
                        <Grid item xs={12} sm={12} md={4} lg={3} className="mb-md-0 mb-30">
                           <div className="iron-filters-wrapper">
                             <Filter/>
                           </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={9}>
                           <div className="stats-info d-md-flex mb-30 justify-content-between align-items-center">
                              <div className="app-selectbox-sm mb-30 mb-md-0">
                                 <SortBy
                                    defaultRefinement="instant_search"
                                    items={[
                                       { value: 'instant_search', label: 'Featured' },
                                       { value: 'instant_search_price_asc', label: 'Lowest Price' },
                                       { value: 'instant_search_price_desc', label: 'Highest Price' },
                                    ]}
                                 />
                              </div>
                              <Stats />
                           </div>
                           <Configure hitsPerPage={12} />
                           <Hits
										hitComponent={(props) => <Hit {...props} />}
										className="mb-30"
										showLoadingIndicator
									/>
                           <div className="iron-pagination-wrap">
                              <Pagination
                                 totalPages={5}
                                 showFirst
                                 showLast
                                 showNext
                                 showPrevious
                              />
                           </div>
                        </Grid>
                     </Grid>
                  </InstantSearch>
               </div>
            </div>
         </div>
      )
   }
}

export default Shop;