import SCCollection from '/node_modules/sc-collection/sc-collection.js';
import SCModel from '/node_modules/sc-model/sc-model.js';

function getPageComponent(pageOptions) {
  return Vue.extend({
    props: {
      categoryId: String
    },
    data: function () {
      this.categoryModel = new SCModel({
        socket: pageOptions.socket,
        type: 'Category',
        id: this.categoryId,
        fields: ['name', 'desc']
      });

      this.productsCollection = new SCCollection({
        socket: pageOptions.socket,
        type: 'Product',
        fields: ['name', 'qty', 'price'],
        view: 'categoryView',
        viewParams: {category: this.categoryId},
        pageOffset: 0,
        pageSize: 5,
        getCount: true
      });

      let lowStockThreshold = 3;

      this.lowStockProductsCollection = new SCCollection({
        socket: pageOptions.socket,
        type: 'Product',
        fields: ['name', 'qty', 'price'],
        view: 'lowStockView',
        viewParams: {category: this.categoryId, qty: lowStockThreshold},
        viewPrimaryKeys: ['category'],
        pageOffset: 0,
        pageSize: 5,
        getCount: false
      });

      return {
        // A category object which will be updated in real-time by our model.
        category: this.categoryModel.value,
        // An array of products which will be updated in real-time by our collection.
        products: this.productsCollection.value,
        // An object which contains meta data about the collection (such as the total number of items); also updates in teal-time.
        productsMeta: this.productsCollection.meta,
        lowStockProducts: this.lowStockProductsCollection.value,
        lowStockThreshold,
        newProductName: '',
        realtime: this.productsCollection.realtimeCollection
      };
    },
    computed: {
      firstItemIndex: function () {
        if (!this.products.length) {
          return 0;
        }
        return this.productsMeta.pageOffset + 1;
      },
      lastItemIndex: function () {
        return this.productsMeta.pageOffset + this.products.length;
      }
    },
    methods: {
      refreshLowStockCollection: function () {
        this.lowStockProductsCollection.destroy();
        this.lowStockProductsCollection = new SCCollection({
          socket: pageOptions.socket,
          type: 'Product',
          fields: ['name', 'qty', 'price'],
          view: 'lowStockView',
          viewParams: {category: this.categoryId, qty: parseInt(this.lowStockThreshold)},
          viewPrimaryKeys: ['category'],
          pageOffset: 0,
          pageSize: 5,
          getCount: false
        });
        this.lowStockProducts = this.lowStockProductsCollection.value;
      },
      computeProductDetailsUrl: function (category, product) {
        return `#/category/${category.id}/product/${product.id}`;
      },
      addProduct: function () {
        if (this.newProductName === '') {
          return;
        }
        var newProduct = {
          name: this.newProductName,
          category: this.category.id
        };
        this.newProductName = '';

        this.productsCollection.create(newProduct)
        .then((err, newId) => {
          // TODO: Success message
        })
        .catch((err) => {
          // TODO: Handle error
        });
      },
      inputKeyDown: function (event) {
        if (event.key === 'Enter') {
          this.addProduct();
        }
      },
      goToPrevPage: function () {
        this.productsCollection.fetchPreviousPage();
      },
      goToNextPage: function () {
        this.productsCollection.fetchNextPage();
      },
      toggleRealtime: function () {
        this.productsCollection.destroy();
        this.productsCollection = new SCCollection({
          socket: pageOptions.socket,
          type: 'Product',
          fields: ['name', 'qty', 'price'],
          view: 'categoryView',
          viewParams: {category: this.categoryId},
          pageOffset: 0,
          pageSize: 5,
          getCount: true,
          realtimeCollection: this.realtime
        });
        this.products = this.productsCollection.value;
        this.productsMeta = this.productsCollection.meta;
      }
    },
    beforeRouteLeave: function (to, from, next) {
      this.categoryModel.destroy();
      this.productsCollection.destroy();
      this.lowStockProductsCollection.destroy();
      next();
    },
    template: `
      <div class="page-container">
        <a href="/#/"><< Back to category list</a>
        <h2 class="content-heading">{{category.name}}</h2>
        <div class="content-body">
          <div class="all-category-products">
            <p>
              <h4>Category description:</h4>
              <span>{{category.desc}}</span>
            </p>
            <h4>Products:</h4>
            <div style="min-height: 300px;">
              <table class="table">
                <tr>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
                <tr v-for="product of products">
                  <td><a :href="computeProductDetailsUrl(category, product)">{{product.name}}</a></td>
                  <td>{{product.qty}}</td>
                  <td>{{product.price}}</td>
                </tr>
              </table>
            </div>

            <div class="control-bar">
              <div style="padding-bottom: 20px;">
                <a href="javascript:void(0);" @click="goToPrevPage">Prev page</a> <span>Items </span><span>{{firstItemIndex}}</span><span> to </span><span>{{lastItemIndex}}</span> of <span>{{productsMeta.count}}</span> <a href="javascript:void(0);" @click="goToNextPage">Next page</a>
              </div>
              <div style="width: 50%; float: left; margin-right: 10px;">
                <input type="text" class="form-control" v-model="newProductName" @keydown="inputKeyDown">
              </div>
              <input type="button" class="btn" value="Add product" @click="addProduct">
              <input type="checkbox" class="checkbox" style="margin-left: 10px; margin-top: 0;" v-model="realtime" @change="toggleRealtime"> <span>Realtime collection</span>
            </div>
          </div>

          <hr style="margin-top: 50px; margin-bottom: 50px;">

          <div class="low-stock-category-products">
          <h4>Products that are running low:</h4>
            <div style="min-height: 300px;">
              <table class="table">
                <tr>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
                <tr v-for="product of lowStockProducts">
                  <td><a :href="computeProductDetailsUrl(category, product)">{{product.name}}</a></td>
                  <td>{{product.qty}}</td>
                  <td>{{product.price}}</td>
                </tr>
              </table>
            </div>
            <div style="margin-bottom: 100px;">
              <h4>Low stock threshold:</h4>
              <input id="input-desc" type="text" v-model="lowStockThreshold" class="form-control" @change="refreshLowStockCollection" style="width: 100px; float: left; margin-right: 10px;">
              <input type="button" class="btn" value="Update" @click="refreshLowStockCollection" style="float: left;">
            </div>
          </div>
        </div>
      </div>
    `
  });
}

export default getPageComponent;
