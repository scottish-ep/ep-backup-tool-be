const schedule = require('node-schedule');
const { sanitize } = require('@strapi/utils');
const moment = require('moment');
const { execute } = require('@getvim/execute');
const compress = require('gzipme');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const AWS = require('aws-sdk');

function assertUrlProtocol(url) {
  // Regex to test protocol like "http://", "https://"
  return /^\w*:\/\//.test(url);
}

function sendToBackupServer(fileName = fileNameGzip) {
  const form = new FormData();
  form.append('file', fileName);
  axios
  .post(
    "https://services.eastplayers-client.com/api/v1/files/multiple-upload",
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZGNjNjFiLTg0ZjgtNDhkMS04Y2MwLWI1NDY2OTg1OThiNCIsImZ1bGxfbmFtZSI6bnVsbCwiZW1haWwiOiJuYW1lbmFtZUBnbWFpbC5jb20iLCJzY2hlbWEiOiJwdWJsaWMiLCJpYXQiOjE2NTU0MDc1NTksImV4cCI6MTY4Njk0MzU1OX0.mUqlELAL8G5YrK5MA4M_WZeHbQSdbvikU7C4vgPIPaI`,
      },
    }
  )
  .then((res) => {
    console.log('result', res);
  //   fs.unlinkSync(fileNameGzip);
  })
  .catch(err => {
      console.error('run upload error', err);
  });
};

const backup = (hostname, username, database, port, password, jobName) => {

  console.log('run backup');
  const currentDate = Date.now();
  const pathDir = strapi.dirs.dist.root;
  const fileName = pathDir + `/public/backup-database/${jobName}-${currentDate}.sql`;
  const fileNameGzip = `${fileName}.gz`;

  execute(
      `PGPASSWORD=${password} pg_dump -U ${username} -h ${hostname} -p ${port} ${database} > ${fileName}        `
  ).then(async (res) => {
      console.log('res', res);
      const data = await strapi.services("plugin::upload.upload")
      await compress(fileName);
  }).catch(err => {
      console.log('run backup error', err);
  })
}

module.exports = {
  // init(config) {
  //   const S3 = new AWS.S3({
  //     apiVersion: '2006-03-01',
  //     ...config,
  //   });

  //   const upload = (file, customParams = {}) =>
  //     new Promise((resolve, reject) => {
  //       // upload file on S3 bucket
  //       const path = file.path ? `${file.path}/` : '';
  //       S3.upload(
  //         {
  //           Key: `${path}${file.hash}${file.ext}`,
  //           Body: file.stream || Buffer.from(file.buffer, 'binary'),
  //           ACL: 'public-read',
  //           ContentType: file.mime,
  //           ...customParams,
  //         },
  //         (err, data) => {
  //           if (err) {
  //             return reject(err);
  //           }

  //           // set the bucket file url
  //           if (assertUrlProtocol(data.Location)) {
  //             file.url = data.Location;
  //           } else {
  //             // Default protocol to https protocol
  //             file.url = `https://${data.Location}`;
  //           }

  //           resolve();
  //         }
  //       );
  //     });

  //   return {
  //     uploadStream(file, customParams = {}) {
  //       return upload(file, customParams);
  //     },
  //     upload(file, customParams = {}) {
  //       return upload(file, customParams);
  //     },
  //     delete(file, customParams = {}) {
  //       return new Promise((resolve, reject) => {
  //         // delete file on S3 bucket
  //         const path = file.path ? `${file.path}/` : '';
  //         S3.deleteObject(
  //           {
  //             Key: `${path}${file.hash}${file.ext}`,
  //             ...customParams,
  //           },
  //           (err, data) => {
  //             if (err) {
  //               return reject(err);
  //             }

  //             resolve();
  //           }
  //         );
  //       });
  //     },
  //   };
  // },
  
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
