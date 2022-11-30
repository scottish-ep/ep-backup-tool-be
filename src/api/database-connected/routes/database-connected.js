'use strict';

/**
 * database-connected router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::database-connected.database-connected');
