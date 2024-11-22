/**
 *  admin sidebar menu
 */
/* eslint-disable */
export default [
   {
      "menu_title": "admin.reports",
      "path": "/admin-panel/admin/reports",
      "icon": "poll",
      "child_routes": null
   },
   {
      "menu_title": "admin.invoices",
      "path": "/admin-panel/admin/invoices",
      "icon": "recent_actors",
      "child_routes": null
   },
   {
      "menu_title": "admin.products",
      "path": "#",
      "icon": "shopping_cart",
      "child_routes": [
         {
            "path": "/admin-panel/admin/products",
            "menu_title": "admin.products",
            "icon": "arrow_right_alt"
         },
         {
            "path": "/admin-panel/admin/product-add",
            "menu_title": "admin.productAdd",
            "icon": "arrow_right_alt"
         }
      ]
   },
   {
      "menu_title": "admin.profile",
      "path": "/admin-panel/admin/account",
      "icon": "account_circle",
      "child_routes": null
   },
   {
      "menu_title": "Proveedores",
      "path": "#",
      "icon": "shopping_cart",
      "child_routes": [
         {
            "path": "/admin-panel/admin/vendedor",
            "menu_title": "Ver proveedor",
            "icon": "arrow_right_alt"
         },
         {
            "path": "/admin-panel/admin/vendedor-add",
            "menu_title": "Crear proveedor",
            "icon": "arrow_right_alt"
         }
      ]
   },
   {
      "menu_title": "admin.goToHome",
      "path": "/home-one",
      "icon": "home",
      "child_routes": null
   },
   {
      "menu_title": "Usuarios",
      "path": "#",
      "icon": "account_circle",
      "child_routes": [
         {
            "path": "/admin-panel/admin/usuarios",
            "menu_title": "Ver usuarios",
            "icon": "arrow_right_alt"
         },
         {
            "path": "/admin-panel/admin/usuarios-add",
            "menu_title": "Crear usuario",
            "icon": "arrow_right_alt"
         }
      ]
   }
]   