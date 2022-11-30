const { sanitize } = require('@strapi/utils');
const moment = require('moment');
const { execute } = require('@getvim/execute');
const compress = require('gzipme');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const sendToBackupServer = (fileName = fileNameGzip) => {
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

const importDb = () => {
  execute(
      `psql -d postgresql://${username}:${password}@${hostname}/${databaseImport} < ${fileName}`
  ).then(() => {
      console.log('run import success');
  }).catch(err => {
      console.log('run import error', err);
  });
}

const backup = () => {
  console.log('run backup');

  const currentDate = Date.now();
  const hostname = process.env.DB_HOST;
  const username = process.env.DB_USER;
  const database = process.env.DB_NAME;
  const port = process.env.DB_PORT;
  const password = process.env.DB_PASSWORD;

  const pathDir = strapi.dirs.dist.root;

  const fileName = pathDir + `/public/backup-database/database-backup-${currentDate}.sql`;
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
	'0 * * * * *': async ({ strapi }) => {
    // backup();
  }
}
