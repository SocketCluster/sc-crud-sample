import SCModel from '/node_modules/sc-model/sc-model.js';

function getPageComponent(pageOptions) {
  return Vue.extend({
    props: {
      categoryId: String,
      productId: String
    },
    data: function () {
      this.productModel = new SCModel({
        socket: pageOptions.socket,
        type: 'Product',
        id: this.productId,
        fields: ['name', 'qty', 'price', 'desc']
      });

      return {
        product: this.productModel.value
      };
    },
    beforeRouteLeave: function (to, from, next) {
      this.productModel.destroy();
      next();
    },
    methods: {
      computeCategoryDetailsUrl: function (categoryId) {
        return `#/category/${categoryId}`;
      },
      saveValue: function () {
        this.productModel.save();
      }
    },
    template: `
      <div class="page-container">
        <div class="nav-breadcrumbs">
          <a :href="computeCategoryDetailsUrl(categoryId)"><< Back to parent category</a>
        </div>
        <h2 class="content-heading">#<span>{{product.id}}</span>&nbsp;-&nbsp;<span>{{product.name}}</span></h2>
        <div class="content-body">
          <div class="input-area">
            <label for="input-qty">Qty:</label>
            <div>
              <input id="input-qty" type="text" class="form-control" v-model="product.qty" @change="saveValue">
            </div>
          </div>
          <div class="input-area">
            <label for="input-price">Price:</label>
            <div>
              <input id="input-price" type="text" class="form-control" v-model="product.price" @change="saveValue">
            </div>
          </div>
          <div class="input-area">
            <label for="input-desc">Description:</label>
            <div>
              <input id="input-desc" type="text" class="form-control" v-model="product.desc" @change="saveValue">
            </div>
          </div>
          <div>
            <b>Press enter key to save.</b>
          </div>
        </div>
      </div>
    `
  });
}

export default getPageComponent;
