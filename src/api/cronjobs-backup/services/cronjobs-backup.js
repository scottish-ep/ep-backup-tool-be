'use strict';

/**
 * cronjobs-backup service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cronjobs-backup.cronjobs-backup');
