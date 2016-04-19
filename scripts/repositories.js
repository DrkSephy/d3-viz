'use strict';

var utils = require('./utils');
// import {fetchJSON} from './utils.js';

// Fetch total number of JavaScript repositories
utils.fetchJSON('https://api.github.com/search/issues?q=javascript')
.then((data) => {
  console.log(data.total_count);
});
