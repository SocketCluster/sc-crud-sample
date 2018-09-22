import SCCollection from '/node_modules/sc-collection/sc-collection.js';

function getPageComponent(pageOptions) {
  return Vue.extend({
    data: function () {
      this.categoryCollection = new SCCollection({
        socket: pageOptions.socket,
        type: 'Category',
        fields: ['name', 'desc'],
        view: 'alphabeticalView',
        viewParams: {}
      });

      return {
        // An array of categories which will be updated in real-time by our collection.
        categories: this.categoryCollection.value,
        newCategoryName: ''
      };
    },
    methods: {
      computeCategoryDetailsUrl: function (category) {
        return `#/category/${category.id}`;
      },
      addCategory: function () {
        if (this.newCategoryName === '') {
          return;
        }
        var newCategory = {
          name: this.newCategoryName
        };
        this.newCategoryName = '';

        this.categoryCollection.create(newCategory)
        .then((err, newId) => {
          // TODO: Success message
        })
        .catch((err) => {
          // TODO: Handle error
        });
      },
      inputKeyDown: function (event) {
        if (event.key === 'Enter') {
          this.addCategory();
        }
      },
      goToPrevPage: function () {
        this.categoryCollection.fetchPreviousPage();
      },
      goToNextPage: function () {
        this.categoryCollection.fetchNextPage();
      }
    },
    beforeRouteLeave: function (to, from, next) {
      this.categoryCollection.destroy();
      next();
    },
    template: `
      <div class="page-container">
        <h2 class="content-heading">Inventory Categories</h2>
        <div class="category-list">
          <table class="table">
            <tr>
              <th>Name</th>
            </tr>
            <tr v-for="category of categories">
              <td><a :href="computeCategoryDetailsUrl(category)">{{category.name}}</a></td>
            </tr>
          </table>
        </div>
        <div class="category-control-section">
          <div style="padding-bottom: 20px;">
            <a href="javascript:void(0);" @click="goToPrevPage">Prev page</a> | <a href="javascript:void(0);" @click="goToNextPage">Next page</a>
          </div>
          <div style="width: 50%; float: left; margin-right: 10px;">
            <input type="text" class="form-control" v-model="newCategoryName" @keydown="inputKeyDown">
          </div>
          <div class="category-actions">
            <input type="button" class="btn" value="Add category" @click="addCategory">
          </div>
        </div>
      </div>
    `
  });
}

export default getPageComponent;
