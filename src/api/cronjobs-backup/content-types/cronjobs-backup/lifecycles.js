const schedule = require('node-schedule');
const { sanitize } = require('@strapi/utils');
const moment = require('moment');
const { execute } = require('@getvim/execute');
const compress = require('gzipme');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const backup = (hostname, username, database, port, password, jobName) => {

  console.log('run backup');
  const currentDate = Date.now();
  const pathDir = strapi.dirs.dist.root;
  const fileName = pathDir + `/public/backup-database/${jobName}-${currentDate}.sql`;
  const fileNameGzip = `${fileName}.gz`;

  execute(
      `PGPASSWORD=${password} pg_dump -U ${username} -h ${hostname} -p ${port} ${database} > ${fileName}        `
  ).then(async (res) => {
      await compress(fileName);
  }).catch(err => {
      console.log('run backup error', err);
  })
}

module.exports = {

  
  async afterCreate(event) {
    console.log("result", event.result);
    const schedule = require('node-schedule');
    const hours = event.result.hours;
    const minutes = event.result.minutes;
    const seconds = event.result.seconds;
    const job = schedule.scheduleJob(`${seconds} ${minutes} ${hours} * * *`, async function(){
      const id = event.result.id;
      const cronJobs = await strapi.db.query("api::cronjobs-backup.cronjobs-backup").findOne({
        where: {
          id: id,
        },
        populate: ["database_connected"],
      });
      console.log('cron jobs', cronJobs);
      if (cronJobs) {
        backup(
          cronJobs.database_connected.hostname, 
          cronJobs.database_connected.username, 
          cronJobs.database_connected.database, 
          cronJobs.database_connected.port, 
          cronJobs.database_connected.password,
          cronJobs.name)
      }
    });
  },
  async beforeCreate(event){
  }
};
