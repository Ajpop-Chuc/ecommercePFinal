/**
 * post detail component
*/
/* eslint-disable */
import React, { Fragment } from 'react';
import { Grid, Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import ImageUploader from 'react-images-upload';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

//components
import SocialIcons from '../../../../components/widgets/SocialIcons';
import firebase from '../../../../firebase';
import 'firebase/database';
import ContentLoader from '../../../../components/global/loaders/ContentLoader';

class ProductEdit extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
       name: '',
         description: '',
         images: [],
         videos: [],
         specifications: {
            material: '',
            care_instructions: ''
         },
         price: 0,
         inventory: 0,
         supplierId: '',
         isActive: true,
         variations: [
            { size: '', color: '' }
         ],
         category: '',
         tags: [],
         loading: true,
         error: null
      };
   }

   componentDidMount() {
      this.fetchProductData();
   }

   //getproducts
   fetchProductData = async () => {
      try {
         const productId = this.props.match.params.id;
         const response = await fetch(`http://localhost:4000/api/products/${productId}`);
         if (!response.ok) {
            throw new Error('Producto no encontrado');
         }
         const productData = await response.json();
         
         // Actualizar el estado con los datos del producto
         this.setState({
            name: productData.name,
            description: productData.description,
            images: productData.images || [],
            videos: productData.videos || [],
            specifications: {
               material: productData.specifications?.material || '',
               care_instructions: productData.specifications?.care_instructions || ''
            },
            price: productData.price,
            inventory: productData.inventory,
            supplierId: productData.supplierId,
            variations: productData.variations || [{ size: '', color: '' }],
            category: productData.category,
            tags: productData.tags || [],
            isActive: productData.isActive,
            loading: false
         });
      } catch (error) {
         this.setState({
            error: error.message,
            loading: false
         });
      }
   };

   handleChange = name => event => {
      this.setState({
         [name]: event.target.value,
      });
   };

   handleSpecificationChange = name => event => {
      this.setState(prevState => ({
         specifications: {
            ...prevState.specifications,
            [name]: event.target.value
         }
      }));
   };

   handleVariationChange = (index, field) => event => {
      const newVariations = [...this.state.variations];
      newVariations[index] = {
         ...newVariations[index],
         [field]: event.target.value
      };
      this.setState({ variations: newVariations });
   };

   addVariation = () => {
      this.setState(prevState => ({
         variations: [...prevState.variations, { size: '', color: '' }]
      }));
   };

   handleTagAdd = (tag) => {
      if (tag.trim() !== '') {
         this.setState(prevState => ({
            tags: [...prevState.tags, tag.trim()]
         }));
      }
   };

   removeTag = (indexToRemove) => {
      this.setState(prevState => ({
         tags: prevState.tags.filter((_, index) => index !== indexToRemove)
      }));
   };

   onDrop = (pictures) => {
      if (pictures && pictures.length > 0) {
         this.setState(prevState => ({
            images: [...prevState.images, ...pictures]
         }));
      }
   };

   handleVideoUpload = (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
         const videoUrl = URL.createObjectURL(files[0]);
         this.setState(prevState => ({
            videos: [...prevState.videos, videoUrl]
         }));
      }
   };

   handleSubmit = async (e) => {
      e.preventDefault();
      const productId = this.props.match.params.id;

      try {
         // Validaciones
         if (!this.state.name?.trim() || !this.state.description?.trim()) {
            alert('Nombre y descripción son requeridos');
            return;
         }

         const productData = {
            name: this.state.name.trim(),
            description: this.state.description.trim(),
            price: Number(this.state.price),
            inventory: Number(this.state.inventory),
            category: this.state.category.trim(),
            tags: this.state.tags,
            supplierId: this.state.supplierId || '123',
            specifications: this.state.specifications,
            variations: this.state.variations.filter(v => v.size || v.color),
            isActive: this.state.isActive,
            images: this.state.images,
            videos: this.state.videos
         };

         const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
         });

         if (response.ok) {
            alert('Producto actualizado exitosamente');
            window.location.href = '/admin-panel/admin/products';
         } else {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar el producto');
         }
      } catch (error) {
         console.error('Error:', error);
         alert('Error al actualizar el producto: ' + error.message);
      }
   };

   render() {
      const { productData } = this.state;
      return (
         <Fragment>
            {productData !== null ?
               <div className="iron-product-add-wrap iron-product-edit-wrap pt-50 px-sm-50 px-md-0">
                  <Grid container spacing={4} className="my-0">
                     <Grid item xs={12} sm={12} md={10} lg={9} className="py-0 mx-auto">
                        <Grid container spacing={4} className="my-0">
                           <Grid item xs={12} sm={12} md={6} lg={6} className="py-0 mb-md-0 mb-30">
                              <Grid container spacing={3} className="iron-product-gallery my-0">
                                 <Grid item xs={3} sm={2} md={2} lg={2} className="py-0">
                                    <div className="product-gallery-nav">
                                       {productData.image_gallery && productData.image_gallery.map((gallery, index) => {
                                          return (
                                             <div key={index} className="product-gallery-item">
                                                <div className="image-upload">
                                                   <a href="#">
                                                      <img
                                                         src={require(`../../../../assets/images/${gallery}`).default}
                                                         alt="product-item"
                                                         height="50"
                                                      />
                                                   </a>
                                                   <div className="image-content d-flex justify-content-center align-items-center">
                                                      <ImageUploader
                                                         withPreview
                                                         withIcon={false}
                                                         buttonClassName="primary-color bg-base border-circle"
                                                         buttonText=""
                                                         onChange={() => this.onDrop()}
                                                         imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                                         maxFileSize={5242880}
                                                      />
                                                   </div>
                                                </div>
                                             </div>
                                          )
                                       })}
                                    </div>
                                 </Grid>
                                 <Grid item xs={9} sm={10} md={10} lg={10} className="py-0">
                              <div className="preview-full-image">
                                 <div className="iron-shadow product-gallery-item">
                                    <img
                                       src={this.state.images[0] || "/api/placeholder/625/800"}
                                       alt="product-preview"
                                       className="w-full"
                                    />
                                 </div>
                              </div>
                           </Grid>
                              </Grid>
                           </Grid>
                           {/* Columna del Formulario */}
                     <Grid item xs={12} sm={12} md={6} lg={6} className="py-0">
                        <div className="detail-content">
                           <Link to="/admin-panel/admin/products" className="text-14 d-inline-block font-medium py-10 mb-10">
                              Volver a productos
                           </Link>

                           <form onSubmit={this.handleSubmit} className="product-values">
                              {/* Nombre del Producto */}
                              <div className="d-flex justify-content-start align-items-start mb-10">
                                 <i className="zmdi zmdi-edit mr-5 primary-color pt-10 text-h4"></i>
                                 <Input
                                    value={this.state.name}
                                    onChange={this.handleChange('name')}
                                    placeholder="Nombre del Producto"
                                    className="text-capitalize add-product-input text-h3"
                                 />
                              </div>

                                    {/* Precio */}
                              <div className="d-flex justify-content-start align-items-start mb-10">
                                 <i className="zmdi zmdi-edit mr-5 primary-color pt-5 text-h5"></i>
                                 <Input
                                    type="number"
                                    value={this.state.price}
                                    onChange={this.handleChange('price')}
                                    placeholder="Precio"
                                    className="text-capitalize add-product-input text-h4 active-input"
                                 />
                              </div>

                              {/* Descripción */}
                              <div className="mb-10">
                                 <h6 className="text-14 mb-0 edit-text">Descripción:</h6>
                                 <TextField
                                    multiline
                                    rows={4}
                                    value={this.state.description}
                                    onChange={this.handleChange('description')}
                                    className="text-capitalize add-product-input pl-30 w-full"
                                 />
                              </div>

                                  {/* Inventario */}
                              <div className="mb-10">
                                 <h6 className="text-14 mb-0 edit-text">Inventario:</h6>
                                 <Input
                                    type="number"
                                    value={this.state.inventory}
                                    onChange={this.handleChange('inventory')}
                                    className="text-capitalize add-product-input pl-30"
                                 />
                              </div>

                              {/* Categoría */}
                              <div className="mb-10">
                                 <h6 className="text-14 mb-0 edit-text">Categoría:</h6>
                                 <Input
                                    value={this.state.category}
                                    onChange={this.handleChange('category')}
                                    className="text-capitalize add-product-input pl-30"
                                 />
                              </div>

                                   {/* Especificaciones */}
                              <div className="mb-10">
                                 <h6 className="text-14 mb-0 edit-text">Especificaciones:</h6>
                                 <div className="pl-30">
                                    <Input
                                       placeholder="Material"
                                       value={this.state.specifications.material}
                                       onChange={this.handleSpecificationChange('material')}
                                       className="text-capitalize add-product-input mb-2"
                                    />
                                    <Input
                                       placeholder="Instrucciones de cuidado"
                                       value={this.state.specifications.care_instructions}
                                       onChange={this.handleSpecificationChange('care_instructions')}
                                       className="text-capitalize add-product-input"
                                    />
                                 </div>
                              </div>

                                         {/* Variaciones */}
                              <div className="mb-10">
                                 <h6 className="text-14 mb-0 edit-text">Variaciones:</h6>
                                 {this.state.variations.map((variation, index) => (
                                    <div key={index} className="pl-30 mb-2">
                                       <div className="flex gap-2">
                                          <Input
                                             placeholder="Talla"
                                             value={variation.size}
                                             onChange={this.handleVariationChange(index, 'size')}
                                             className="text-capitalize add-product-input"
                                          />
                                          <Input
                                             placeholder="Color"
                                             value={variation.color}
                                             onChange={this.handleVariationChange(index, 'color')}
                                             className="text-capitalize add-product-input"
                                          />
                                          {index > 0 && (
                                             <button
                                                type="button"
                                                onClick={() => this.removeVariation(index)}
                                                className="text-red-500"
                                             >
                                                ×
                                             </button>
                                          )}
                                       </div>
                                    </div>
                                 ))}
                                 <Button
                                    type="button"
                                    onClick={this.addVariation}
                                    className="ml-30 mt-2"
                                 >
                                    + Agregar Variación
                                 </Button>
                              </div>

                              {/* Videos */}
                              <div className="mb-10">
                                 <h6 className="text-14 mb-0 edit-text">Videos:</h6>
                                 <input
                                    type="file"
                                    accept="video/*"
                                    onChange={this.handleVideoUpload}
                                    className="pl-30"
                                 />
                                 {this.state.videos.map((video, index) => (
                                    <div key={index} className="pl-30 mt-2">
                                       <video width="200" controls>
                                          <source src={video} type="video/mp4" />
                                          Tu navegador no soporta el tag de video.
                                       </video>
                                    </div>
                                 ))}
                              </div>

                                   {/* Tags */}
                              <div className="mb-10">
                                 <h6 className="text-14 mb-0 edit-text">Tags:</h6>
                                 <div className="pl-30">
                                    <Input
                                       placeholder="Presiona Enter para agregar un tag"
                                       onKeyPress={this.handleTagChange}
                                       className="text-capitalize add-product-input"
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                       {this.state.tags.map((tag, index) => (
                                          <span
                                             key={index}
                                             className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                                          >
                                             {tag}
                                             <button
                                                type="button"
                                                onClick={() => this.removeTag(index)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                             >
                                                ×
                                             </button>
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              </div>



                                    {/* Estado Activo */}
                                 <div className="mb-10">
                                    <h6 className="text-14 mb-0 edit-text">Estado:</h6>
                                    <div className="pl-30">
                                       <label className="flex items-center">
                                          <input
                                             type="checkbox"
                                             checked={this.state.isActive}
                                             onChange={(e) => this.setState({ isActive: e.target.checked })}
                                             className="mr-2"
                                          />
                                          Activo
                                       </label>
                                    </div>
                                 </div>

                                 {/* Supplier ID */}
                                 <div className="mb-10">
                                    <h6 className="text-14 mb-0 edit-text">ID de Proveedor:</h6>
                                    <Input
                                       value={this.state.supplierId}
                                       onChange={this.handleChange('supplierId')}
                                       className="text-capitalize add-product-input pl-30"
                                    />
                                 </div>
                                    
                              
                                    <div className="mb-10">
                                       <h6 className="text-14 mb-0 edit-text">total products :</h6>
                                       <TextField
                                          id="filled-number"
                                          value={this.state.age}
                                          onChange={this.handleChange('age')}
                                          type="number"
                                          className="iron-select-width2 pl-30"
                                          InputLabelProps={{
                                             shrink: true,
                                          }}
                                       />
                                    </div>
                                 </form>

                                 <div className="mb-sm-50 mb-20 detail-btns pl-25">
                                    <Button
                                    type="submit"
                                    onClick={this.handleSubmit}
                                       className="button btn-active btn-lg mr-15 mb-20 mb-sm-0"
                                    >
                                       guardar
                              </Button>
                                    <Button
                                     type="button"
                                     onClick={() => window.location.href = '/admin-panel/admin/products'}
                                       className="button btn-base btn-lg mb-20 mb-sm-0"
                                    >
                                       cancelar
                              </Button>
                                 </div>
                                 <div className="d-flex justify-content-start align-items-center pl-25">
                                    <span className="d-inline-block mr-15 text-14">Buscanos</span>
                                    <div className="detail-product-share">
                                       <SocialIcons></SocialIcons>
                                    </div>
                                 </div>
                              </div>
                           </Grid>
                        </Grid>
                     </Grid>
                  </Grid>
               </div >
               :
               <ContentLoader />
            }
         </Fragment>
      )
   }
}

export default ProductEdit;