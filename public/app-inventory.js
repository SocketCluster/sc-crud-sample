import getCategoryListPageComponent from '/pages/page-category-list.js';
import getCategoryDetailsPageComponent from '/pages/page-category-details.js';
import getProductDetailsPageComponent from '/pages/page-product-details.js';

let socket = window.socket = socketCluster.connect();

const pageOptions = {
  socket
};

const PageCategoryList = getCategoryListPageComponent(pageOptions);
const PageCategoryDetails = getCategoryDetailsPageComponent(pageOptions);
const PageProductDetails = getProductDetailsPageComponent(pageOptions);

let routes = [
  { path: '/category/:categoryId/product/:productId', component: PageProductDetails, props: true },
  { path: '/category/:categoryId', component: PageCategoryDetails, props: true },
  { path: '/', component: PageCategoryList, props: true }
];

let router = new VueRouter({
  routes
});

new Vue({
  el: '#app',
  router,
  template: `
    <div>
      <router-view></router-view>
    </div>
  `
});
