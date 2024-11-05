/**
 * Invoices List
 */
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import Button from '@material-ui/core/Button';
import axios from 'axios';

//firebase
import firebase from '../../../firebase';

//component
import ContentLoader from '../../../components/global/loaders/ContentLoader';
import ProductsGrid from '../../../components/widgets/productGrid';
import ConfirmProduct from './components/ConfirmProduct';

export default class Products extends Component {
   constructor(props) {
      super(props);
      this.confirmationDialog = React.createRef();
      this.state = {
      searchQuery: '',
         allProducts: [],
         filteredProducts: [],
         gridlayout: true,
         loading: true,
         error: null,
         filters: {
            timeInterval: '',
            quantity: '10'
         }
      };
   }

   componentDidMount() {
      this.fetchProducts();
   }
   //get products data
   // Obtener productos del backend
   fetchProducts = async () => {
      try {
         const response = await fetch('http://localhost:4000/api/products/');
         if (!response.ok) throw new Error('Error al cargar productos');
         
         const products = await response.json();
         this.setState({
            allProducts: products,
            filteredProducts: products,
            loading: false
         });
      } catch (error) {
         console.error('Error:', error);
         this.setState({
            error: error.message,
            loading: false
         });
      }
   };

   // Manejar búsqueda
   handleSearch = (event) => {
      const searchQuery = event.target.value.toLowerCase();
      const { allProducts } = this.state;
      
      const filtered = allProducts.filter(product => 
         product.name.toLowerCase().includes(searchQuery) ||
         product._id.includes(searchQuery)
      );

      this.setState({
         searchQuery,
         filteredProducts: filtered
      });
   };

   handleFilterChange = (type, event) => {
      this.setState({
         filters: {
            ...this.state.filters,
            [type]: event.target.value
         }
      });
   };

  



    // Toggle layout
    gridLayout = () => {
      this.setState({ gridlayout: true });
   };

   // show grid layout
   listLayout = () => {
      this.setState({ gridlayout: false });
   };

 // Eliminar producto
 onDeleteProductItem = async (product) => {
   if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
         const response = await fetch(`http://localhost:4000/api/products/${product._id}`, {
            method: 'DELETE'
         });

         if (response.ok) {
            this.setState(prevState => ({
               allProducts: prevState.allProducts.filter(p => p._id !== product._id),
               filteredProducts: prevState.filteredProducts.filter(p => p._id !== product._id)
            }));
            alert('Producto eliminado exitosamente');
         } else {
            throw new Error('Error al eliminar el producto');
         }
      } catch (error) {
         alert('Error al eliminar el producto');
      }
   }
};


   render() {
      const {filteredProducts, loading, error, gridlayout } = this.state;
      const columns = [
         {
            maxWidth: 75,
            Header: 'ID',
            accessor: '_id',
         },
         {
            sortable: false,
            maxWidth: 100,
            Header: 'image',
            accessor: 'image',
            Cell: props =>
               <span className='avatar'>
                  <img src={require(`../../../assets/images/${props.value}`).default} alt="client-avatar" width="30" height="30" />
               </span>
         },
         {
            minWidth: 150,
            Header: 'Nombre',
            accessor: 'name',
         },
         {
            minWidth: 120,
            Header: 'brand',
            accessor: 'brand',
         },
         {
            Header: 'Categoría',
            accessor: 'category'

         },
      
         {
            Header: 'Precio',
            accessor: 'price',
            Cell: props => `$${props.value}`
         },
         {
            Header: 'Acciones',
            Cell: props => {
               return (
                  <div  className="d-flex justify-content-around">
                     <Button component={Link} to={`/admin-panel/admin/product-edit/${props.original._id}`} className="action-btn"><i className="material-icons primary-color">edit</i>
                     </Button>
                     <Button className="action-btn"
                        onClick={() => this.onDeleteProductItem(props.original)}
                     >
                        <i className="material-icons active-color">delete</i></Button>
                  </div>
               )
            },
         }
      ]

      if (loading) return <ContentLoader />;
      if (error) return <div>Error: {error}</div>;

      return (
         <Fragment>
            {filteredProducts.length > 0 ? 
               <div className="inner-container">
                  <div className="iron-products-wrap">
                     <div className="iron-shadow rounded p-sm-20 p-15 mb-20 bg-base">
                        <Grid container spacing={3} className="search-box-wrap my-0">
                           <Grid item sm={12} md={3} lg={3} className="py-0 d-flex justify-content-start align-items-center">
                              <h4 className="mb-lg-0 mb-5">Buscar</h4>
                           </Grid>
                           <Grid item sm={12} md={9} lg={9} className="py-0 d-sm-flex d-block">
                              <div className="search-box d-block d-sm-flex align-items-center">
                                 <TextField
                                    label="Buscar Productos"
                                    className="my-0 iron-form-input-wrap mr-5"
                                    fullWidth
                                    value={this.state.searchQuery}
                                    onChange={this.handleSearch}
                                 />
                                 <Button className="button btn-primary mx-sm-10 my-10 my-sm-0">buscar</Button>
                              </div>
                              <div className="btn-wrap d-sm-flex d-block justify-content-between align-items-center">
                                 <Button component={Link} to="/admin-panel/admin/product-add" className="button btn-primary">agregar productos<i className="material-icons ml-5">add</i></Button>
                              </div>
                           </Grid>
                        </Grid>
                     </div>
                     <div>
                        <div className="d-flex justify-content-between align-items-center my-15">
                           <h5 className="text-capitalize mb-0">
                              {this.state.gridlayout ?
                                 'project grid'
                                 :
                                 'project list'
                              }
                           </h5>
                           <div className="projects-icon">
                              <Button className={`btn-icon ${this.state.gridlayout ? 'active' : ''}`} onClick={this.gridLayout}>
                                 <i className="material-icons">apps</i>
                              </Button>
                              <Button className={`btn-icon ${this.state.gridlayout ? 'active' : ''}`} onClick={() => this.listLayout()}>
                                 <i className="material-icons">list</i>
                              </Button>
                           </div>
                        </div>
                        {/* Filtros */}
                        <div className="mb-10">
                           <Grid container spacing={0}>
                              <Grid item xs={12} sm={12} md={6} lg={4}>
                                 <form className="product-values">
                                    <FormControl className="iron-select-width2">
                                 
                                       <InputLabel>Recent</InputLabel>
                                       <Select
                                          value={this.state.filters.timeInterval}
                                          onChange={(e) => this.handleFilterChange('timeInterval', e)}
                                        
                                       >
                                            <MenuItem value="this week">Esta semana</MenuItem>
                                          <MenuItem value="this month">Este mes</MenuItem>
                                          <MenuItem value="past month">Mes pasado</MenuItem>
                                          <MenuItem value="this year">Este año</MenuItem>
                                       </Select>
                                    </FormControl>
                                    <FormControl className="iron-select-width2">
                                       <InputLabel>No of items</InputLabel>
                                       <Select
                                          value={this.state.filters.quantity}
                                          onChange={(e) =>this.handleFilterChange('quantity', e)}
                                         
                                       >
                                          <MenuItem value={5}>5</MenuItem>
                                          <MenuItem value={10}>10</MenuItem>
                                          <MenuItem value={15}>15</MenuItem>
                                          <MenuItem value={20}>20</MenuItem>
                                       </Select>
                                    </FormControl>
                                 </form>
                              </Grid>
                           </Grid>
                        </div>
                        <div>
                           {this.state.gridlayout ?
                              <Fragment>

                              
                                 <div className="product-grid-wrap">
                                    <Grid container spacing={4}>
                                    {filteredProducts.map((product, index) => (
                                       <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                          <div className="product-grid-item bg-white p-3 rounded shadow-sm">
                                             <div className="product-info p-3">
                                                <h5>{product.name}</h5>
                                                <p className="mb-1">{product.category}</p>
                                                <p className="price">${product.price}</p>
                                             </div>
                                             <div className="product-actions mt-3">
                                                <Button 
                                                   component={Link} 
                                                   to={`/admin-panel/admin/product-edit/${product._id}`}
                                                   className="edit-btn mr-2"
                                                >
                                                   <i className="material-icons">edit</i>
                                                </Button>
                                                <Button
                                                   onClick={() => this.onDeleteProductItem(product)}
                                                   className="delete-btn"
                                                >
                                                   <i className="material-icons">delete</i>
                                                </Button>
                                             </div>
                                          </div>
                                       </Grid>
                                    ))}
                                    </Grid>
                                 </div >
                              </Fragment>
                              :
                              <Fragment>
                                 <div className="product-list-wrap iron-shadow p-20 bg-base rounded" >
                                    <ReactTable
                                       data={filteredProducts}
                                       columns={columns}
                                       defaultPageSize={10}
                                       className="-striped -highlight"
                                    />
                                 </div >
                              </Fragment>
                           }
                        </div>
                     </div>
                  </div>
                  <ConfirmProduct
                     ref={this.confirmationDialog}
                     onConfirm={(res) => this.deleteDataItem(res)}
                  />
               </div>
               :
               <ContentLoader />
            }
         </Fragment>
      );
   }
}