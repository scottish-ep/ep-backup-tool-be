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
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require('@aws-sdk/client-s3');

function assertUrlProtocol(url) {
  // Regex to test protocol like "http://", "https://"
  return /^\w*:\/\//.test(url);
}

const uploadFileToS3 = async (fileStream, fileName, inforAws) => {
  try {
      // const { AWS_REGION, AWS_BUCKET, AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET } = inforAws;

      const s3Client = new S3Client({ region: 'ap-southeast-1', credentials: { accessKeyId: 'AKIA3UH6YQRZQHYSFKG6', secretAccessKey: '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' } });
      exports.s3Client = s3Client;
      const uploadParams = {
          Bucket: 'testingbe',
          Key: fileName,
          Body: fileStream,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      return fileName
  } catch (error) {
      console.log('error', error);
      return ''
  }

}

const backup = (jobName, inforDatabase, inforAws) => {
  console.log('run backup');

  const {hostname, username, database, port, password } = inforDatabase;
  const currentDate = Date.now();
  const pathDir = strapi.dirs.dist.root;
  const fileName = `${jobName}-${currentDate}.sql`;
  const filePath = pathDir + `/public/backup-database/${fileName}`;
  execute(
      `PGPASSWORD=${password} pg_dump -U ${username} -h ${hostname} -p ${port} ${database} > ${filePath}        `
  ).then(async (res) => {
      const fileStream = fs.createReadStream(filePath);
      uploadFileToS3(fileStream, fileName, inforAws);
  }).catch(err => {
      console.log('run backup error', err);
  })
}

module.exports = {
  async afterCreate(event) {
    const schedule = require('node-schedule');
    console.log('event.result', event.result);
    const hours = event.result.hours;
    const minutes = event.result.minutes;
    const seconds = event.result.seconds;
    const job = schedule.scheduleJob(`${seconds} ${minutes} ${hours} * * *`, async function(){
      const id = event.result.id;
      const cronJobs = await strapi.db.query("api::cronjobs-backup.cronjobs-backup").findOne({
        where: {
          id: id,
        },
        populate: ["database_connected.aws_3_connected"],
      });
      console.log('cron jobs', cronJobs);
      if (cronJobs) {
        backup(cronJobs.name ,cronJobs.database_connected, null)
        }
    });
  },
};
