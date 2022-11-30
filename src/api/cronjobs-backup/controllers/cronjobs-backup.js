'use strict';

/**
 * cronjobs-backup controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cronjobs-backup.cronjobs-backup');
