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
        categories: this.categoryCollection.value,
        newCategoryName: '',
        realtime: true
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
      goToPrevPage: function () {
        this.categoryCollection.fetchPreviousPage();
      },
      goToNextPage: function () {
        this.categoryCollection.fetchNextPage();
      }
    },
    template: `
      <div class="page-container">
        <h2>Inventory Categories</h2>
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
          <div class="category-search">
            <input type="text" class="form-control" v-model="newCategoryName">
          </div>
          <div class="category-actions">
            <input type="button" class="btn" value="Add category" @click="addCategory">
            <input type="checkbox" class="checkbox" style="margin-left: 10px; margin-top: 0;" v-model="realtime"> <span>Realtime collection</span>
          </div>
          <div class="category-navigation">
            <a href="javascript:void(0);" @click="goToPrevPage">Prev page</a> | <a href="javascript:void(0);" @click="goToNextPage">Next page</a>
          </div>
        </div>
      </div>
    `
  });
}

export default getPageComponent;
