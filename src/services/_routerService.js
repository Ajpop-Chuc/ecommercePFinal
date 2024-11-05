import AdminPanel from "../routes/admin-panel";
import ProductEdit from "../routes/admin-panel/products/product-edit";

// routes

const AdminRoutes = [
   {
      path: 'admin',
      component: AdminPanel
   },
   {
      path: 'admin/product-edit/:id',
      component: ProductEdit, // Ruta para la página de edición de productos
   }
]

export default AdminRoutes;