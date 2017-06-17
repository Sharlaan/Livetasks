'use strict';

function App() {
  /**
   * Set API and Socket URLs
   * @type {String}
   */
  // this.CLIENT_URL = 'localhost'
  this.API_URL = 'localhost';

  /**
   * Set API and Socket ports
   * @type {Number}
   */
  this.API_PORT = 3210;

  this.baseApiUrl = 'http://' + this.API_URL + ':' + this.API_PORT;

  /**
   * Application container
   * @type {DomElement}
   */
  this.container = null;

  /**
   * @type {Socket}
   */
  this.socket = null;
}

/**
 * Init application: attach to the dom and prepare data
 */
App.prototype.init = function () {
  this.container = document.getElementById('root');
  this.socket = io.connect(this.baseApiUrl // eslint-disable-line no-undef
  );this.socket.on('newUser', function (message) {
    console.warn(message);
  });
  var groups = new Groups(this.socket); // eslint-disable-line no-undef
  groups.init(this.container);
};
//# sourceMappingURL=App.js.map