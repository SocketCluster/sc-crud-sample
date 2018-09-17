import getCategoryListPageComponent from '/pages/page-category-list.js';
import getCategoryDetailsPageComponent from '/pages/page-category-details.js';
import getProductDetailsPageComponent from '/pages/page-product-details.js';
import getLoginPageComponent from '/pages/page-login.js';

let socket = window.socket = socketCluster.connect();

const pageOptions = {
  socket
};

const PageCategoryList = getCategoryListPageComponent(pageOptions);
const PageCategoryDetails = getCategoryDetailsPageComponent(pageOptions);
const PageProductDetails = getProductDetailsPageComponent(pageOptions);
const PageLogin = getLoginPageComponent(pageOptions);

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
  components: {
    'page-login': PageLogin
  },
  router,
  data: function () {
    return {
      isAuthenticated: false
    };
  },
  created: function () {
    this.isAuthenticated = this.isSocketAuthenticated();
    socket.on('authStateChange', () => {
      this.isAuthenticated = this.isSocketAuthenticated();
    });
  },
  methods: {
    isSocketAuthenticated: function () {
      return socket.authState === 'authenticated';
    }
  },
  template: `
    <div>
      <div v-if="isAuthenticated" style="padding: 10px;">
        <router-view></router-view>
      </div>
      <div v-if="!isAuthenticated" style="padding: 10px;">
        <page-login></page-login>
      </div>
    </div>
  `
});
