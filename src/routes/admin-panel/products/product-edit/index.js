/**
 * Product Edit Component - Fixed and Complete Version
 */

import React from 'react';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import ImageUploader from 'react-images-upload';
import SocialIcons from '../../../../components/widgets/SocialIcons';

// Estilos CSS
const styles = `
.tag-item {
   display: inline-flex;
   align-items: center;
   background: #e0e0e0;
   border-radius: 16px;
   padding: 4px 12px;
   margin: 4px;
   font-size: 14px;
}

.tag-remove-btn {
   background: none;
   border: none;
   margin-left: 8px;
   cursor: pointer;
   font-size: 18px;
   line-height: 1;
   padding: 0 4px;
}

.remove-btn {
   min-width: auto !important;
   padding: 6px !important;
}

.variation-row {
   margin-bottom: 8px;
   display: flex;
   gap: 10px;
   align-items: center;
}

.video-preview {
   position: relative;
   display: inline-block;
   margin: 10px 0;
}

.checkbox-container {
   display: flex;
   align-items: center;
   cursor: pointer;
   margin-top: 8px;
}

.checkbox-container input {
   margin-right: 8px;
}

.remove-image-btn {
   position: absolute;
   top: -8px;
   right: -8px;
   background: #ff4444;
   color: white;
   border: none;
   border-radius: 50%;
   width: 20px;
   height: 20px;
   line-height: 1;
   cursor: pointer;
   font-size: 14px;
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1;
}

.no-image-placeholder {
   width: 100%;
   height: 300px;
   display: flex;
   align-items: center;
   justify-content: center;
   background: #f5f5f5;
   color: #666;
   border-radius: 4px;
}

.preview-image {
   position: relative;
   display: inline-block;
   width: 100%;
   height: 50px;
   margin-bottom: 10px;
   cursor: pointer;
}

.preview-image img {
   width: 100%;
   height: 100%;
   object-fit: cover;
   border-radius: 4px;
}

.image-upload {
   position: relative;
}

.tags-container {
   display: flex;
   flex-wrap: wrap;
   gap: 8px;
   margin-top: 8px;
   padding: 10px 0;
}

.detail-content {
   padding: 20px;
   background: white;
   border-radius: 4px;
   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.add-product-input {
   width: 100%;
}

.variation-container {
   border: 1px solid #e0e0e0;
   padding: 15px;
   margin-bottom: 15px;
   border-radius: 4px;
}

.product-gallery-nav {
   height: 100%;
   overflow-y: auto;
   padding-right: 10px;
}

.product-gallery-item {
   margin-bottom: 15px;
   position: relative;
}

.image-content {
   border: 2px dashed #ddd;
   border-radius: 4px;
   padding: 10px;
   text-align: center;
}

.preview-full-image {
   width: 100%;
   min-height: 400px;
   border-radius: 4px;
   background: #f5f5f5;
   display: flex;
   align-items: center;
   justify-content: center;
   overflow: hidden;
}

.preview-full-image img {
   width: 100%;
   height: auto;
   object-fit: contain;
}

.add-Button {
   margin-top: 10px !important;
}

.video-container {
   margin: 15px 0;
}

.video-preview video {
   max-width: 100%;
   border-radius: 4px;
}

.form-field {
   margin-bottom: 20px;
}

.form-field label {
   display: block;
   margin-bottom: 5px;
   color: #666;
}

.button-group {
   display: flex;
   gap: 10px;
   margin-top: 20px;
}

.iron-shadow {
   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.loader-container {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100vh;
   width: 100%;
}

.error-container {
   text-align: center;
   padding: 20px;
   color: #f44336;
   background: #ffebee;
   border-radius: 4px;
   margin: 20px;
}
`;

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
         newTag: '',
         currentPreviewIndex: 0,
         loading: true,
         error: null
      };
   }

   componentDidMount() {
      const styleSheet = document.createElement("style");
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      this.loadProductData();
   }

   loadProductData = async () => {
      try {
         const productId = this.props.match.params.id;
         const response = await fetch(`http://localhost:4000/api/products/${productId}`);
         if (!response.ok) throw new Error('Error al cargar el producto');
         
         const product = await response.json();
         
         this.setState({
            name: product.name || '',
            description: product.description || '',
            images: product.images || [],
            videos: product.videos || [],
            specifications: {
               material: product.specifications?.material || '',
               care_instructions: product.specifications?.care_instructions || ''
            },
            price: product.price || 0,
            inventory: product.inventory || 0,
            supplierId: product.supplierId || '',
            isActive: product.isActive ?? true,
            variations: product.variations?.length > 0 ? product.variations : [{ size: '', color: '' }],
            category: product.category || '',
            tags: product.tags || [],
            loading: false
         });
      } catch (error) {
         console.error('Error:', error);
         this.setState({
            error: error.message,
            loading: false
         });
      }
   }

   onDrop = async (pictures) => {
      try {
         if (!pictures || pictures.length === 0) return;

         const formData = new FormData();
         pictures.forEach(file => {
            formData.append('images', file);
         });

         const response = await fetch('http://localhost:4000/api/upload', {
            method: 'POST',
            body: formData
         });

         if (!response.ok) throw new Error('Error al subir las imágenes');

         const data = await response.json();
         
         this.setState(prevState => ({
            images: [...prevState.images, ...data.paths]
         }));

      } catch (error) {
         console.error('Error al subir imágenes:', error);
         alert('Error al subir las imágenes');
      }
   };

   handlePreviewChange = (index) => {
      this.setState({ currentPreviewIndex: index });
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

   removeVariation = (index) => {
      if (this.state.variations.length > 1) {
         this.setState(prevState => ({
            variations: prevState.variations.filter((_, i) => i !== index)
         }));
      }
   };

   handleTagChange = (event) => {
      this.setState({ newTag: event.target.value });
   };
   
   addTag = () => {
      if (this.state.newTag.trim() !== '') {
         this.setState(prevState => ({
            tags: [...prevState.tags, this.state.newTag.trim()],
            newTag: ''
         }));
      }
   };
   
   removeTag = (index) => {
      this.setState(prevState => ({
         tags: prevState.tags.filter((_, i) => i !== index)
      }));
   };

   handleVideoUpload = (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
         const videoUrl = URL.createObjectURL(files[0]);
         this.setState(prevState => ({
            videos: [...(prevState.videos || []), videoUrl]
         }));
      }
   };

   removeVideo = (index) => {
      this.setState(prevState => ({
         videos: prevState.videos.filter((_, i) => i !== index)
      }));
   };

   removeImage = (index) => {
      this.setState(prevState => ({
         images: prevState.images.filter((_, i) => i !== index),
         currentPreviewIndex: 0
      }));
   };

   handleSubmit = async (e) => {
      e.preventDefault();
   
      try {
         if (!this.state.name?.trim()) {
            alert('El nombre del producto es requerido');
            return;
         }

         if (!this.state.description?.trim()) {
            alert('La descripción es requerida');
            return;
         }

         if (!this.state.category?.trim()) {
            alert('La categoría es requerida');
            return;
         }

         const productId = this.props.match.params.id;
         const productData = {
            name: this.state.name.trim(),
            description: this.state.description.trim(),
            price: Number(this.state.price),
            inventory: Number(this.state.inventory) || 0,
            category: this.state.category.trim(),
            tags: this.state.tags,
            specifications: this.state.specifications,
            supplierId: this.state.supplierId?.trim() || '123',
            variations: this.state.variations.filter(v => v.size || v.color),
            isActive: Boolean(this.state.isActive),
            images: this.state.images || [],
            videos: this.state.videos || []
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
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al actualizar el producto');
         }
      } catch (error) {
         console.error('Error:', error);
         alert('Error al actualizar el producto: ' + error.message);
      }
   };

   handleCancel = () => {
      window.location.href = '/admin-panel/admin/products';
   };

   render() {
      const { loading, error } = this.state;

      if (loading) {
         return (
            <div className="loader-container">
               <CircularProgress />
            </div>
         );
      }

      if (error) {
         return (
            <div className="error-container">
               <h3>Error</h3>
               <p>{error}</p>
               <Button onClick={() => window.location.href = '/admin-panel/admin/products'}>
                  Volver a Productos
               </Button>
            </div>
         );
      }

      return (
         <div className="iron-product-add-wrap pt-50 px-sm-50 px-md-0">
            <Grid container spacing={4} className="my-0">
               <Grid item xs={12} sm={12} md={10} lg={9} className="py-0 mx-auto">
                  <Grid container spacing={4} className="my-0">
                     <Grid item xs={12} sm={12} md={6} lg={6} className="py-0 mb-md-0 mb-30">
                        <Grid container spacing={3} className="iron-product-gallery my-0">
                           <Grid item xs={3} sm={2} md={2} lg={2} className="py-0">
                              <div className="product-gallery-nav">
                                 {this.state.images.map((imagePath, index) => (
                                    <div key={index} className="product-gallery-item">
                                       <div className="image-upload">
                                          <div className="preview-image">
                                             <img
                                                src={`http://localhost:4000${imagePath}`}
                                                alt={`Product thumbnail ${index + 1}`}
                                                onClick={() => this.handlePreviewChange(index)}
                                             />
                                             <button
                                                type="button"
                                                onClick={() => this.removeImage(index)}
                                                className="remove-image-btn"
                                             >
                                                ×
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                                 <div className="product-gallery-item">
                                    <div className="image-upload">
                                       <div className="image-content">
                                          <ImageUploader
                                             withPreview={false}
                                             withIcon={false}
                                             buttonClassName="primary-color bg-base border-circle add-Button"
                                             buttonText="+"
                                             onChange={this.onDrop}
                                             imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                             maxFileSize={5242880}
                                          />
                                       </div>
                                    </div>
                                 </div>
                                 </div>
                           </Grid>
                           <Grid item xs={9} sm={10} md={10} lg={10} className="py-0">
                              <div className="preview-full-image">
                                 <div className="iron-shadow product-gallery-item">
                                    <div>
                                       {this.state.images.length > 0 ? (
                                          <img
                                             src={`http://localhost:4000${this.state.images[this.state.currentPreviewIndex]}`}
                                             alt="Product preview"
                                          />
                                       ) : (
                                          <div className="no-image-placeholder">
                                             No hay imagen disponible
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </Grid>
                        </Grid>
                     </Grid>
                     <Grid item xs={12} sm={12} md={6} lg={6} className="py-0">
                        <div className="detail-content">
                           <Link to="/admin-panel/admin/products" className="text-14 d-inline-block font-medium py-10 mb-10">
                              PRODUCTOS DE VENTA
                           </Link>
                           <form className="product-values" onSubmit={this.handleSubmit}>
                              <div className="form-field">
                                 <div className="d-flex justify-content-start align-items-start mb-10">
                                    <i className="zmdi zmdi-edit mr-10 primary-color pt-10 text-h4"></i>
                                    <Input
                                       value={this.state.name}
                                       onChange={this.handleChange('name')}
                                       placeholder="Nombre del Producto"
                                       className="text-capitalize add-product-input text-h3"
                                       inputProps={{
                                          'aria-label': 'Product name',
                                       }}
                                    />
                                 </div>
                              </div>

                              <div className="form-field">
                                 <div className="d-flex justify-content-start align-items-start mb-10">
                                    <i className="zmdi zmdi-money mr-10 primary-color pt-5 text-h5"></i>
                                    <Input
                                       type="number"
                                       value={this.state.price}
                                       onChange={this.handleChange('price')}
                                       placeholder="Precio"
                                       className="text-capitalize add-product-input text-h4 active-input"
                                       inputProps={{
                                          'aria-label': 'Price',
                                       }}
                                    />
                                 </div>
                              </div>

                              <div className="form-field">
                                 <h6 className="text-14 mb-0 add-text">Descripción:</h6>
                                 <TextField
                                    multiline
                                    rows={4}
                                    value={this.state.description}
                                    onChange={this.handleChange('description')}
                                    className="text-capitalize add-product-input pl-30 w-full"
                                 />
                              </div>

                              <div className="form-field">
                                 <h6 className="text-14 mb-0 add-text">Inventario:</h6>
                                 <Input
                                    type="number"
                                    value={this.state.inventory}
                                    onChange={this.handleChange('inventory')}
                                    className="text-capitalize add-product-input pl-30"
                                 />
                              </div>

                              <div className="form-field">
                                 <h6 className="text-14 mb-0 add-text">Categoría:</h6>
                                 <Input
                                    value={this.state.category}
                                    onChange={this.handleChange('category')}
                                    className="text-capitalize add-product-input pl-30"
                                 />
                              </div>

                              <div className="form-field">
                                 <h6 className="text-14 mb-0 add-text">Especificaciones:</h6>
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

                              <div className="form-field">
                                 <h6 className="text-14 mb-0 add-text">Variaciones:</h6>
                                 {this.state.variations.map((variation, index) => (
                                    <div key={index} className="variation-container pl-30">
                                       <div className="variation-row">
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
                                          <Button
                                             type="button"
                                             onClick={() => this.removeVariation(index)}
                                             className="remove-btn"
                                             disabled={this.state.variations.length === 1}
                                          >
                                             <i className="zmdi zmdi-delete"></i>
                                          </Button>
                                       </div>
                                    </div>
                                 ))}
                                 <Button
                                    type="button"
                                    onClick={this.addVariation}
                                    className="button btn-primary ml-30 mt-2"
                                 >
                                    + Agregar Variación
                                 </Button>
                              </div>

                              <div className="form-field">
                                 <h6 className="text-14 mb-0 add-text">Videos:</h6>
                                 <div className="pl-30">
                                    <input
                                       type="file"
                                       accept="video/*"
                                       onChange={this.handleVideoUpload}
                                       className="mb-2"
                                    />
                                    <div className="video-container">
                                       {this.state.videos.map((video, index) => (
                                          <div key={index} className="video-preview">
                                             <video width="200" controls>
                                                <source src={video} type="video/mp4" />
                                                Su navegador no soporta el elemento de video.
                                             </video>
                                             <Button
                                                type="button"
                                                onClick={() => this.removeVideo(index)}
                                                className="remove-btn"
                                             >
                                                <i className="zmdi zmdi-delete"></i>
                                             </Button>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>

                              <div className="form-field">
                                 <h6 className="text-14 mb-0 add-text">Tags:</h6>
                                 <div className="pl-30">
                                    <div className="d-flex align-items-center">
                                       <TextField
                                          value={this.state.newTag}
                                          onChange={this.handleTagChange}
                                          onKeyPress={(e) => {
                                             if (e.key === 'Enter') {
                                                e.preventDefault();
                                                this.addTag();
                                             }
                                          }}
                                          placeholder="Escribe un tag y presiona Enter"
                                          className="text-capitalize add-product-input"
                                       />
                                       <Button
                                          type="button"
                                          onClick={this.addTag}
                                          className="button btn-primary ml-10"
                                       >
                                          Agregar Tag
                                       </Button>
                                    </div>
                                    <div className="tags-container">
                                       {this.state.tags.map((tag, index) => (
                                          <span key={index} className="tag-item">
                                             {tag}
                                             <button
                                                type="button"
                                                onClick={() => this.removeTag(index)}
                                                className="tag-remove-btn"
                                             >
                                                ×
                                             </button>
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              </div>

                              <div className="form-field">
                                 <h6 className="text-14 mb-0 add-text">ID del Proveedor:</h6>
                                 <Input
                                    value={this.state.supplierId}
                                    onChange={this.handleChange('supplierId')}
                                    placeholder="ID del Proveedor"
                                    className="text-capitalize add-product-input pl-30"
                                 />
                              </div>

                              <div className="form-field">
                                 <h6 className="text-14 mb-0 add-text">Estado:</h6>
                                 <div className="pl-30">
                                    <label className="checkbox-container">
                                       <input
                                          type="checkbox"
                                          checked={this.state.isActive}
                                          onChange={(e) => this.setState({ isActive: e.target.checked })}
                                       />
                                       <span className="checkmark"></span>
                                       Activo
                                    </label>
                                 </div>
                              </div>

                              <div className="button-group pl-25">
                                 <Button
                                    type="submit"
                                    className="button btn-primary btn-lg"
                                 >
                                    Actualizar Producto
                                 </Button>
                                 <Button
                                    type="button"
                                    onClick={this.handleCancel}
                                    className="button btn-secondary btn-lg"
                                 >
                                    Cancelar
                                 </Button>
                              </div>
                           </form>
                           <div className="d-flex justify-content-start align-items-center pl-25 mt-4">
                              <span className="d-inline-block mr-15 text-14">Síguenos en</span>
                              <div className="detail-product-share">
                                 <SocialIcons />
                              </div>
                           </div>
                        </div>
                     </Grid>
                  </Grid>
               </Grid>
            </Grid>
         </div>
      );
   }
}

export default ProductEdit;