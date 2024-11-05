/**
 * product add page
*/
/* eslint-disable */
import React from 'react';
import { Grid, Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import ImageUploader from 'react-images-upload';

//components
import SocialIcons from '../../../../components/widgets/SocialIcons';

const data = {
   Preview_Image: "https://via.placeholder.com/625x800",
   image_gallery: [
      "https://via.placeholder.com/625x800",
      "https://via.placeholder.com/625x800",
      "https://via.placeholder.com/625x800",
      "https://via.placeholder.com/625x800",
      "https://via.placeholder.com/625x800"
   ]
}
class ProductAdd extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
       name: '',
         description: '',
         images: ['https://th.bing.com/th/id/OIP.dPvorcJOoSfphu346umFTQAAAA?rs=1&pid=ImgDetMain', 'https://cdn.shopify.com/s/files/1/1775/6429/products/LinaW211Slate_30.jpg?v=1669175602','https://cdn.shopify.com/s/files/1/1775/6429/products/Rudy_december-024_4957cbdc-956c-496d-8b70-1b15abbf3358.jpg?v=1670354964'],
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
         newTag: ''
      };
     
   }

// Actualizar el método onDrop:
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


// Agregar método para cambiar la imagen de preview:
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


   handleTagChange = (event) => {
      this.setState({ newTag: event.target.value });
   };
   
   addTag = () => {
      if (this.state.newTag.trim() !== '') {
         this.setState(prevState => ({
            tags: [...prevState.tags, this.state.newTag.trim()],
            newTag: '' // Limpiar el input después de agregar
         }));
      }
   };
   
   removeTag = (index) => {
      this.setState(prevState => ({
         tags: prevState.tags.filter((_, i) => i !== index)
      }));
   };

   handleSubmit = async (e) => {
      e.preventDefault();
   
      try {
         // Validaciones según el schema
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
   
         if (!this.state.tags || this.state.tags.length === 0) {
            alert('Debe agregar al menos un tag');
            return;
         }
   
         // Crear el objeto según el schema
         const productData = {
            name: this.state.name.trim(),
            description: this.state.description.trim(),
            price: Number(this.state.price),
            inventory: Number(this.state.inventory) || 0,
            category: this.state.category.trim(),
            tags: this.state.tags, // Tags dinámicos
            specifications: this.state.specifications,
            supplierId: this.state.supplierId?.trim() || '123',
            variations: this.state.variations.filter(v => v.size || v.color),
            isActive: Boolean(this.state.isActive),
            images: this.state.images || [],
            videos: this.state.videos || []
         };
   
         console.log('Enviando datos:', productData);
   
         const response = await fetch('http://localhost:4000/api/products/', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
         });
   
         const responseData = await response.json();
         console.log('Respuesta:', responseData);
   
         if (response.status === 201) {
            alert('Producto creado exitosamente');
            
            // Limpiar el formulario después de crear
            this.setState({
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
               variations: [{ size: '', color: '' }],
               category: '',
               tags: [],
               isActive: true,
               newTag: ''
            });
   
            // Redirigir
            window.location.href = '/admin-panel/admin/products';
         } else {
            throw new Error(responseData.error || 'Error al crear el producto');
         }
      } catch (error) {
         console.error('Error completo:', error);
         alert('Error al crear el producto: ' + (error.message || 'Error desconocido'));
      }
   };

   
   // Agregar esta función para manejar los videos
   handleVideoUpload = (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
         // Solo guardar la referencia del video si existe
         const videoUrl = URL.createObjectURL(files[0]);
         this.setState(prevState => ({
            videos: [...(prevState.videos || []), videoUrl]
         }));
      }
   };

   handleCancel = () => {
      window.location.href = '/admin-panel/admin/products';
   };
   
   render() {
      return (
         <div className="iron-product-add-wrap pt-50 px-sm-50 px-md-0">
            <Grid container spacing={4} className="my-0">
               <Grid item xs={12} sm={12} md={10} lg={9} className="py-0 mx-auto">
                  <Grid container spacing={4} className="my-0">
                     <Grid item xs={12} sm={12} md={6} lg={6} className="py-0 mb-md-0 mb-30">
                        <Grid container spacing={3} className="iron-product-gallery my-0">
                           <Grid item xs={3} sm={2} md={2} lg={2} className="py-0">
                              <div className="product-gallery-nav">
                                   {/* Mostrar miniaturas de imágenes cargadas */}
         {this.state.images.map((imagePath, index) => (
            <div key={index} className="product-gallery-item">
               <div className="image-upload">
                  <div className="preview-image">
                     <img
                        src={`http://localhost:4000${imagePath}`}
                        alt={`Product thumbnail ${index + 1}`}
                        height="50"
                        onClick={() => this.handlePreviewChange(index)}
                     />
                  </div>
               </div>
            </div>
         ))}
         {/* Botón de carga siempre visible al final */}
         <div className="product-gallery-item">
            <div className="image-upload">
               <div className="image-content d-flex justify-content-center align-items-center">
                  <ImageUploader
                     withPreview={false}
                     withIcon={false}
                     buttonClassName="primary-color bg-base border-circle add-Button"
                     buttonText=""
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
                  <img
                     src={data.Preview_Image}
                     alt="Product preview"
                  />
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
                              <div className="d-flex justify-content-start align-items-start mb-10">
                                 <i className="zmdi zmdi-plus mr-10 primary-color pt-10 text-h4"></i>
                                 <Input
                                    value={this.state.name}
                                    onChange={this.handleChange('name')}
                                    placeholder="Agrega el nombre del Producto"
                                    className="text-capitalize add-product-input text-h3"
                                    inputProps={{
                                       'aria-label': 'Product name',
                                    }}
                                 />
                              </div>
                              <div className="d-flex justify-content-start align-items-start mb-10">
                                 <i className="zmdi zmdi-plus mr-10 primary-color pt-5 text-h5"></i>
                                 <Input
                                    type="number"
                                    value={this.state.price}
                                    onChange={this.handleChange('price')}
                                    placeholder="Add price"
                                    className="text-capitalize add-product-input text-h4 active-input"
                                    inputProps={{
                                       'aria-label': 'Price',
                                    }}
                                 />
                              </div>
                              {/* Descripción */}
                              <div className="mb-10">
                                 <h6 className="text-14 mb-0 add-text">description :</h6>
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
                                 <h6 className="text-14 mb-0 add-text">inventory :</h6>
                                 <Input
                                    type="number"
                                    value={this.state.inventory}
                                    onChange={this.handleChange('inventory')}
                                    className="text-capitalize add-product-input pl-30"
                                 />
                              </div>

                              {/* Categoría */}
                              <div className="mb-10">
                                 <h6 className="text-14 mb-0 add-text">category :</h6>
                                 <Input
                                    value={this.state.category}
                                    onChange={this.handleChange('category')}
                                    className="text-capitalize add-product-input pl-30"
                                 />
                              </div>

                              {/* Especificaciones */}
                              <div className="mb-10">
                                 <h6 className="text-14 mb-0 add-text">specifications :</h6>
                                 <div className="pl-30">
                                    <Input
                                       placeholder="Material"
                                       value={this.state.specifications.material}
                                       onChange={(e) => this.setState(prev => ({
                                          specifications: { ...prev.specifications, material: e.target.value }
                                       }))}
                                       className="text-capitalize add-product-input mb-2"
                                    />
                                    <Input
                                       placeholder="Care Instructions"
                                       value={this.state.specifications.care_instructions}
                                       onChange={(e) => this.setState(prev => ({
                                          specifications: { ...prev.specifications, care_instructions: e.target.value }
                                       }))}
                                       className="text-capitalize add-product-input"
                                    />
                                 </div>
                              </div>

                              {/* Variaciones */}
                           <div className="mb-10">
                              <h6 className="text-14 mb-0 add-text">variations :</h6>
                              {this.state.variations.map((variation, index) => (
                                 <div key={index} className="pl-30 mb-2">
                                    <div className="grid grid-cols-2 gap-2">
                                       <Input
                                          placeholder="Size"
                                          value={variation.size}
                                          onChange={(e) => {
                                             const newVariations = [...this.state.variations];
                                             newVariations[index].size = e.target.value;
                                             this.setState({ variations: newVariations });
                                          }}
                                          className="text-capitalize add-product-input"
                                       />
                                       <Input
                                          placeholder="Color"
                                          value={variation.color}
                                          onChange={(e) => {
                                             const newVariations = [...this.state.variations];
                                             newVariations[index].color = e.target.value;
                                             this.setState({ variations: newVariations });
                                          }}
                                          className="text-capitalize add-product-input"
                                       />
                                    </div>
                                 </div>
                              ))}
                              <Button
                                 type="button"
                                 onClick={this.addVariation}
                                 className="ml-30 mt-2"
                              >
                                 + Add Variation
                              </Button>
                           </div>

                              {/* Videos */}
                              <div className="mb-10">
                                    <h6 className="text-14 mb-0 add-text">videos :</h6>
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
                                             Your browser does not support the video tag.
                                          </video>
                                       </div>
                                    ))}
                                 </div>

                                   {/* Tags */}
                           <div className="mb-10">
                              <h6 className="text-14 mb-0 add-text">tags :</h6>
                              <div className="pl-30 d-flex align-items-center">
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
                                    className="ml-10"
                                 >
                                    Agregar Tag
                                 </Button>
                              </div>
                              <div className="pl-30 mt-2 flex flex-wrap gap-2">
                                 {this.state.tags.map((tag, index) => (
                                    <div 
                                       key={index} 
                                       className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                                    >
                                       {tag}
                                       <button
                                          type="button"
                                          onClick={() => this.removeTag(index)}
                                          className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                                       >
                                          ×
                                       </button>
                                    </div>
                                 ))}
                              </div>
                           </div>
                                     
                                     {/* Supplier ID */}
                                    <div className="mb-10">
                                       <h6 className="text-14 mb-0 add-text">Supplier ID:</h6>
                                       <Input
                                          value={this.state.supplierId}
                                          onChange={this.handleChange('supplierId')}
                                          placeholder="Add Supplier ID"
                                          className="text-capitalize add-product-input pl-30"
                                       />
                                    </div>

                                       {/* Estado Activo */}
                                       <div className="mb-10">
                                          <h6 className="text-14 mb-0 add-text">status :</h6>
                                          <div className="pl-30">
                                             <label className="flex items-center">
                                                <input
                                                   type="checkbox"
                                                   checked={this.state.isActive}
                                                   onChange={(e) => this.setState({ isActive: e.target.checked })}
                                                   className="mr-2"
                                                />
                                                Active
                                             </label>
                                          </div>
                                       </div>

                              <div className="mb-sm-50 mb-20 detail-btns pl-25">
                                 <Button
                                    type="submit"
                                    className="button btn-active btn-lg mr-15 mb-20 mb-sm-0"
                                 >
                                    Crear
                                 </Button>
                                 <Button
                                    type="button"
                                    onClick={this.handleCancel}
                                    className="button btn-base btn-lg mb-20 mb-sm-0"
                                 >
                                    Cancelar
                                 </Button>
                              </div>
                           </form>
                           <div className="d-flex justify-content-start align-items-center pl-25">
                              <span className="d-inline-block mr-15 text-14">Buscanos</span>
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

export default ProductAdd;