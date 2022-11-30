const { sanitize } = require('@strapi/utils');
const moment = require('moment');

module.exports = {  
	'0 0 1 * * *': async ({ strapi }) => {
    const today = new Date();
    console.log('today', today);
  }
}
