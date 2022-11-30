'use strict';

/**
 * cronjobs-backup router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::cronjobs-backup.cronjobs-backup');
