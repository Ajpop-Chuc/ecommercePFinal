/**
 * Dasboard Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
   AsyncInvoiceListComponent,
   AsyncReportsComponent,
   AsyncProductsGridComponent,
   AsyncProductAddComponent,
   AsyncProductEditComponent,
   AsyncProfileDetailComponent,
   AsyncProveedorAddComponent,
   AsyncProveedorEditComponent,
   AsyncProveedorComponent,
   usuariosComponent,
   usuariosAddComponent
} from '../../util/AsyncRoutes';

const AdminPanel = ({ match }) => {
   return (
      <div className="dashboard-wrapper">
         <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/reports`} />
            <Route path={`${match.url}/reports`} component={AsyncReportsComponent} />
            <Route path={`${match.url}/invoices`} component={AsyncInvoiceListComponent} />
            <Route path={`${match.url}/products`} component={AsyncProductsGridComponent} />
            <Route path={`${match.url}/product-add`} component={AsyncProductAddComponent} />
            <Route path={`${match.url}/product-edit/:type/:id`} component={AsyncProductEditComponent} />
            <Route path={`${match.url}/account`} component={AsyncProfileDetailComponent} />
            <Route path={`${match.url}/vendedor`} component={AsyncProveedorComponent} />
            <Route path={`${match.url}/vendedor-add`} component={AsyncProveedorAddComponent} />
            <Route path={`${match.url}/vendedor-edit/:type/:id`} component={AsyncProveedorEditComponent} />
            <Route path={`${match.url}/usuarios-add`} component={usuariosComponent} />
            <Route path={`${match.url}/usuarios`} component={usuariosAddComponent} />
            
           
         </Switch>
      </div>
   )
}

export default AdminPanel;