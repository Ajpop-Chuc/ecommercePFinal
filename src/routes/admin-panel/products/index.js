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

// Components
import ContentLoader from '../../../components/global/loaders/ContentLoader';
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

   getImageUrl = (imageUrl) => {
      if (!imageUrl) return null;
      if (imageUrl.startsWith('http')) {
         return imageUrl;
      }
      return `http://localhost:4000${imageUrl}`;
   };

   componentDidMount() {
      this.fetchProducts();
   }

   fetchProducts = async () => {
      try {
         const response = await fetch('http://localhost:4000/api/products/');
         if (!response.ok) throw new Error('Error al cargar productos');
         
         const products = await response.json();
         console.log('Productos cargados:', products);
         
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

   gridLayout = () => {
      this.setState({ gridlayout: true });
   };

   listLayout = () => {
      this.setState({ gridlayout: false });
   };

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
      const { filteredProducts, loading, error, gridlayout } = this.state;
      
      const columns = [
         {
            maxWidth: 75,
            Header: 'ID',
            accessor: '_id',
         },
         {
            sortable: false,
            maxWidth: 100,
            Header: 'Imagen',
            accessor: 'images',
            Cell: ({ value }) => (
               <div className="product-image-cell">
                  {value && value.length > 0 ? (
                     <img 
                        src={this.getImageUrl(value[0])}
                        alt="Producto"
                        style={{
                           width: '40px',
                           height: '40px',
                           objectFit: 'cover',
                           borderRadius: '4px'
                        }}
                        onError={(e) => {
                           e.target.onerror = null;
                           e.target.style.display = 'none';
                           e.target.parentElement.innerHTML = `
                              <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 4px;">
                                 <i class="material-icons" style="font-size: 24px; color: #999">image</i>
                              </div>
                           `;
                        }}
                     />
                  ) : (
                     <div style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f5f5f5',
                        borderRadius: '4px'
                     }}>
                        <i className="material-icons" style={{ fontSize: '24px', color: '#999' }}>image</i>
                     </div>
                  )}
               </div>
            )
         },
         {
            minWidth: 150,
            Header: 'Nombre',
            accessor: 'name',
         },
         {
            minWidth: 120,
            Header: 'Marca',
            accessor: 'brand',
         },
         {
            Header: 'Categoría',
            accessor: 'category'
         },
         {
            Header: 'Precio',
            accessor: 'price',
            Cell: props => `$${props.value?.toFixed(2) || '0.00'}`
         },
         {
            Header: 'Acciones',
            Cell: props => (
               <div className="d-flex justify-content-around">
                  <Button 
                     component={Link} 
                     to={`/admin-panel/admin/product-edit/${props.original._id}`}
                     className="action-btn"
                  >
                     <i className="material-icons primary-color">edit</i>
                  </Button>
                  <Button 
                     className="action-btn"
                     onClick={() => this.onDeleteProductItem(props.original)}
                  >
                     <i className="material-icons active-color">delete</i>
                  </Button>
               </div>
            )
         }
      ];

      if (loading) return <ContentLoader />;
      if (error) return <div>Error: {error}</div>;

      return (
         <Fragment>
            {filteredProducts.length > 0 ? (
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
                                 <Button className="button btn-primary mx-sm-10 my-10 my-sm-0">Buscar</Button>
                              </div>
                              <div className="btn-wrap d-sm-flex d-block justify-content-between align-items-center">
                                 <Button 
                                    component={Link} 
                                    to="/admin-panel/admin/product-add" 
                                    className="button btn-primary"
                                 >
                                    Agregar Productos
                                    <i className="material-icons ml-5">add</i>
                                 </Button>
                              </div>
                           </Grid>
                        </Grid>
                     </div>

                     <div>
                        <div className="d-flex justify-content-between align-items-center my-15">
                           <h5 className="text-capitalize mb-0">
                              {gridlayout ? 'Vista Cuadrícula' : 'Vista Lista'}
                           </h5>
                           <div className="projects-icon">
                              <Button 
                                 className={`btn-icon ${gridlayout ? 'active' : ''}`} 
                                 onClick={this.gridLayout}
                              >
                                 <i className="material-icons">apps</i>
                              </Button>
                              <Button 
                                 className={`btn-icon ${!gridlayout ? 'active' : ''}`} 
                                 onClick={this.listLayout}
                              >
                                 <i className="material-icons">list</i>
                              </Button>
                           </div>
                        </div>

                        <div className="mb-10">
                           <Grid container spacing={0}>
                              <Grid item xs={12} sm={12} md={6} lg={4}>
                                 <form className="product-values">
                                    <FormControl className="iron-select-width2">
                                       <InputLabel>Periodo</InputLabel>
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
                                       <InputLabel>Mostrar</InputLabel>
                                       <Select
                                          value={this.state.filters.quantity}
                                          onChange={(e) => this.handleFilterChange('quantity', e)}
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
                           {gridlayout ? (
                              <div className="product-grid-wrap">
                                 <Grid container spacing={4}>
                                    {filteredProducts.map((product, index) => (
                                       <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                          <div className="product-grid-item bg-white p-3 rounded shadow-sm">
                                             <div className="product-image">
                                                {product.images && product.images.length > 0 ? (
                                                   <img
                                                      src={this.getImageUrl(product.images[0])}
                                                      alt={product.name}
                                                      style={{
                                                         width: '100%',
                                                         height: '200px',
                                                         objectFit: 'cover',
                                                         borderRadius: '4px'
                                                      }}
                                                      onError={(e) => {
                                                         e.target.onerror = null;
                                                         e.target.style.display = 'none';
                                                         e.target.parentElement.innerHTML = `
                                                            <div style="
                                                               width: 100%;
                                                               height: 200px;
                                                               display: flex;
                                                               align-items: center;
                                                               justify-content: center;
                                                               background: #f5f5f5;
                                                               border-radius: 4px;
                                                            ">
                                                               <i class="material-icons" style="font-size: 48px; color: #999">image</i>
                                                            </div>
                                                         `;
                                                      }}
                                                   />
                                                ) : (
                                                   <div style={{
                                                      width: '100%',
                                                      height: '200px',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                      background: '#f5f5f5',
                                                      borderRadius: '4px'
                                                   }}>
                                                      <i className="material-icons" style={{ fontSize: '48px', color: '#999' }}>image</i>
                                                   </div>
                                                )}
                                             </div>
                                             <div className="product-info p-3">
                                                <h5>{product.name}</h5>
                                                <p className="mb-1">{product.category}</p>
                                                <p className="price">${product.price?.toFixed(2) || '0.00'}</p>
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
                              </div>
                           ) : (
                              <div className="product-list-wrap iron-shadow p-20 bg-base rounded">
                                 <ReactTable
                                    data={filteredProducts}
                                    columns={columns}
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                 />
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
                  <ConfirmProduct
                     ref={this.confirmationDialog}
                     onConfirm={(res) => this.deleteDataItem(res)}
                  />
               </div>
            ) : (
               <ContentLoader />
            )}
         </Fragment>
      );
   }
}