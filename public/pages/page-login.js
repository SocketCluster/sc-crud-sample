
function getPageComponent(pageOptions) {
  let socket = pageOptions.socket;

  return Vue.extend({
    data: function () {
      return {
        error: null,
        username: 'bob',
        password: 'password123'
      };
    },
    methods: {
      login: function () {
        var details = {
          username: this.username,
          password: this.password
        };
        socket.emit('login', details, (err, failure) => {
          if (err) {
            this.error = 'Failed to login due to error: ' + err;
          } else if (failure) {
            this.error = failure;
          } else {
            this.error = '';
          }
        });
      },
      inputKeyDown: function (event) {
        if (event.key === 'Enter') {
          this.login();
        }
      }
    },
    template: `
      <div class="page-container">
        <h2 class="content-row heading">Login</h2>
        <div class="content-body">
          <div v-if="error" class="input-area">
            <span class="error-container">{{error}}</span>
          </div>
          <div class="input-area">
            <div class="login-label">
              Username:
            </div>
            <input type="text" v-model="username" class="form-control" @keydown="inputKeyDown">
          </div>
          <div class="input-area">
            <div class="login-label">
              Password:
            </div>
            <input type="password" v-model="password" class="form-control" @keydown="inputKeyDown">
          </div>
          <div class="input-area" style="padding-top: 10px;">
            <input type="button" class="form-control" value="Login" @click="login">
          </div>
        </div>
      </div>
    `
  });
}

export default getPageComponent;
