'use strict';

var utils = require('./js/utils');

utils.fetchJSON('https://api.github.com/search/issues?q=javascript')
.then((data) => {
  console.log(data);
});

