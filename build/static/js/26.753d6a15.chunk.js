(this.webpackJsonpembryo=this.webpackJsonpembryo||[]).push([[26],{468:function(e,t,c){"use strict";c(0);var a=c(1);t.a=function(e){return Object(a.jsx)("div",{className:"page-title-bar text-center",children:Object(a.jsxs)("div",{className:"container",children:[Object(a.jsxs)("h1",{className:"mb-30",children:[" ",e.title]}),Object(a.jsxs)("p",{className:"lead text-capitalize mb-0",children:[" ",e.desc," "]})]})})}},474:function(e,t,c){"use strict";c.d(t,"c",(function(){return r})),c.d(t,"d",(function(){return n})),c.d(t,"a",(function(){return i})),c.d(t,"b",(function(){return l}));var a=c(92),s=c(155);function r(e){var t=!1,c=s.store.getState().ecommerce.cart;if(c&&c.length>0){var r,n=Object(a.a)(c);try{for(n.s();!(r=n.n()).done;){r.value.productID===e&&(t=!0)}}catch(i){n.e(i)}finally{n.f()}}return t}function n(e){var t=!1,c=s.store.getState().ecommerce.wishlist;if(c&&c.length>0){var r,n=Object(a.a)(c);try{for(n.s();!(r=n.n()).done;){r.value.productID===e&&(t=!0)}}catch(i){n.e(i)}finally{n.f()}}return t}function i(){var e=0,t=s.store.getState().ecommerce.cart;if(t&&t.length>0){var c,r=Object(a.a)(t);try{for(r.s();!(c=r.n()).done;){e+=c.value.totalPrice}}catch(n){r.e(n)}finally{r.f()}return e}}function l(){var e=s.store.getState().ecommerce,t=e.tax,c=e.shipping;return(i()+c+t).toFixed(2)}},477:function(e,t,c){"use strict";c.d(t,"a",(function(){return s}));c(0);var a=c(1);function s(e){var t=e.children;return Object(a.jsx)("div",{className:"rct-card-wrap",children:t})}},554:function(e,t,c){"use strict";var a=c(10),s=c(8),r=c(11),n=c(12),i=c(0),l=c(23),o=c(511),d=c(512),j=c(447),b=c(406),h=c(513),u=c(16),m=c(28),x=c(474),O=c(80),p=c(111),f=c(1),v=function(e){Object(r.a)(c,e);var t=Object(n.a)(c);function c(){return Object(a.a)(this,c),t.apply(this,arguments)}return Object(s.a)(c,[{key:"onAddToCart",value:function(e){var t=this;this.props.addProductItem(e),setTimeout((function(){t.props.showAlert("Your product Is Successfully added in cart","success")}),500)}},{key:"addProductToWishList",value:function(e){var t=this;this.props.addToWishlist(e),setTimeout((function(){t.props.showAlert("Your product Is Successfully added in wishlist!","success")}),500)}},{key:"render",value:function(){var e=this,t=this.props.hit;return Object(f.jsxs)(o.a,{className:"iron-product-item post-rounded iron-shadow",children:[Object(f.jsxs)("div",{className:"iron-overlay-wrap overflow-hidden d-flex justify-content-center align-items-center",children:[Object(f.jsx)(u.b,{to:"/products/men/5",className:"d-block",children:Object(f.jsx)(d.a,{height:"140",component:"img",image:t.image})}),Object(f.jsx)("div",{className:"iron-overlay-content d-flex justify-content-end align-items-start",children:Object(f.jsx)("div",{className:"iron-overlay-holder",children:Object(x.d)(t.objectID)?Object(f.jsx)(j.a,{className:"active",children:Object(f.jsx)("i",{className:"material-icons",children:"favorite"})}):Object(f.jsx)(j.a,{onClick:function(){return e.addProductToWishList(t)},children:Object(f.jsx)("i",{className:"material-icons",children:"favorite"})})})})]}),Object(f.jsx)(b.a,{}),Object(f.jsxs)(h.a,{className:"iron-product-content p-20 pt-30 border",children:[Object(f.jsx)("h5",{className:"text-truncate",children:Object(f.jsx)(u.b,{to:"/products/men/5",children:t.name})}),Object(f.jsxs)("div",{className:"d-flex justify-content-between align-items-center",children:[Object(f.jsx)("div",{className:"price-wrap",children:Object(f.jsxs)("span",{children:[Object(f.jsx)(O.a,{})," ",t.price]})}),Object(f.jsx)(p.a,{})]}),Object(f.jsx)("div",{className:"iron-btn-grp",children:Object(x.c)(t.objectID)?Object(f.jsx)(j.a,{component:u.b,to:"/cart",className:"btn-wrap",children:Object(f.jsx)("i",{className:"material-icons",children:"visibility"})}):Object(f.jsx)(i.Fragment,{children:Object(f.jsx)(j.a,{className:"btn-wrap",onClick:function(){return e.onAddToCart(t)},children:Object(f.jsx)("i",{className:"material-icons",children:"shopping_cart"})})})})]})]})}}]),c}(i.Component);t.a=Object(l.b)((function(e){var t=e.ecommerce;return{cart:t.cart,wishlist:t.wishlist}}),{addProductItem:m.b,addToWishlist:m.c,showAlert:m.o})(v)},555:function(e,t,c){"use strict";c.d(t,"a",(function(){return b}));c(0);var a=c(964),s=c(919),r=c(947),n=c(958),i=c(965),l=c(966),o=c(959),d=c(477),j=c(1);function b(){return Object(j.jsxs)("div",{className:"filters-wrapper",children:[Object(j.jsx)(d.a,{children:Object(j.jsx)(a.a,{translations:{placeholder:"Search Products"},showLoadingIndicator:!0})}),Object(j.jsx)(d.a,{children:Object(j.jsx)(s.a,{header:"Brand",children:Object(j.jsx)(r.a,{attribute:"brand",searchable:!0,limit:5})})}),Object(j.jsx)(d.a,{children:Object(j.jsx)(s.a,{header:"Type",children:Object(j.jsx)(r.a,{attribute:"type",limit:5})})}),Object(j.jsx)(d.a,{children:Object(j.jsx)(s.a,{header:"Category",children:Object(j.jsx)(r.a,{attribute:"categories",searchable:!0,limit:5})})}),Object(j.jsxs)(d.a,{children:[Object(j.jsx)(s.a,{header:"Price",className:"mb-20",children:Object(j.jsx)(n.a,{attribute:"price",items:[{end:10,label:"Below $10"},{start:10,end:100,label:"$10 - $100"},{start:100,end:500,label:"$100 - $500"},{start:500,label:"Above $500"}]})}),Object(j.jsx)(s.a,{header:"Enter Price Range",children:Object(j.jsx)(i.a,{attribute:"price",className:"py-2",translations:{submit:"Go",separator:"-"}})})]}),Object(j.jsx)(d.a,{children:Object(j.jsx)(s.a,{header:"Rating Menu",children:Object(j.jsx)(l.a,{attribute:"rating",min:1,max:5,translations:{ratingLabel:""}})})}),Object(j.jsx)(d.a,{children:Object(j.jsx)(o.a,{})})]})}},927:function(e,t,c){"use strict";c.r(t);var a=c(13),s=c(10),r=c(8),n=c(11),i=c(12),l=c(0),o=c.n(l),d=c(615),j=c.n(d),b=c(948),h=c(953),u=c(960),m=c(967),x=c(961),O=c(950),p=c(37),f=c(468),v=c(554),g=c(555),N=c(1),w=j()("latency","6be0576ff61c053d5f9a3225e2a90f76"),y=function(e){Object(n.a)(c,e);var t=Object(i.a)(c);function c(){return Object(s.a)(this,c),t.apply(this,arguments)}return Object(r.a)(c,[{key:"render",value:function(){return Object(N.jsxs)("div",{className:"iron-Shop-page-wrap",children:[Object(N.jsx)(f.a,{title:"Products"}),Object(N.jsx)("div",{className:"product-list section-pad iron-shop-wrapper",children:Object(N.jsx)("div",{className:"container",children:Object(N.jsx)(b.a,{indexName:"instant_search",searchClient:w,children:Object(N.jsxs)(p.a,{container:!0,spacing:4,children:[Object(N.jsx)(p.a,{item:!0,xs:12,sm:12,md:4,lg:3,className:"mb-md-0 mb-30",children:Object(N.jsx)("div",{className:"iron-filters-wrapper",children:Object(N.jsx)(g.a,{})})}),Object(N.jsxs)(p.a,{item:!0,xs:12,sm:12,md:8,lg:9,children:[Object(N.jsxs)("div",{className:"stats-info d-md-flex mb-30 justify-content-between align-items-center",children:[Object(N.jsx)("div",{className:"app-selectbox-sm mb-30 mb-md-0",children:Object(N.jsx)(h.a,{defaultRefinement:"instant_search",items:[{value:"instant_search",label:"Featured"},{value:"instant_search_price_asc",label:"Lowest Price"},{value:"instant_search_price_desc",label:"Highest Price"}]})}),Object(N.jsx)(u.a,{})]}),Object(N.jsx)(m.a,{hitsPerPage:12}),Object(N.jsx)(x.a,{hitComponent:function(e){return Object(N.jsx)(v.a,Object(a.a)({},e))},className:"mb-30",showLoadingIndicator:!0}),Object(N.jsx)("div",{className:"iron-pagination-wrap",children:Object(N.jsx)(O.a,{totalPages:5,showFirst:!0,showLast:!0,showNext:!0,showPrevious:!0})})]})]})})})})]})}}]),c}(o.a.Component);t.default=y}}]);
//# sourceMappingURL=26.753d6a15.chunk.js.map