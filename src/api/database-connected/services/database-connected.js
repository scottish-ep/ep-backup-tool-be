'use strict';

/**
 * database-connected service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::database-connected.database-connected');
