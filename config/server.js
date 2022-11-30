const cronTasks = require("./cron-task");

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env("PUBLIC_URL", "https://vanlang.eastplayers-client.com"),
  proxy: true,
  app: {
    keys: env.array('APP_KEYS'),
  },
  acquireConnectionTimeout: 1000000,
  pool: {
    min: 0,
    max: 5,
    acquireTimeoutMillis: 1000000,
    createTimeoutMillis: 1000000,
    destroyTimeoutMillis: 1000000,
    idleTimeoutMillis: 1000000,
    reapIntervalMillis:1000000,
    createRetryIntervalMillis: 1000000,
    propagateCreateError: false // <- default is true, set to false
  },
  debug: false,
  cron: {
    enabled: true,
    tasks: cronTasks,
  }
});
