'use strict';

/**
 * database-connected controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::database-connected.database-connected');
