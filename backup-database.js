const { execute } = require('@getvim/execute');
const compress = require('gzipme');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const cron = require('node-cron');

const dotenv = require('dotenv');
dotenv.config();

const hostname = process.env.DB_HOST;
const username = process.env.DB_USER;
const database = process.env.DB_NAME;
const databaseImport = process.env.DB_NAME_IMPORT;
const port = process.env.DB_PORT;
const password = process.env.DB_PASSWORD;

const currentDate = Date.now();

// const fileName = `database-backup-${currentDate}.tar`;
// const fileNameGzip = `${fileName}.tar.gz`;
const fileName = `database-backup-${currentDate}.sql`;
const fileNameGzip = `${fileName}.gz`;

function importDb () {
    console.log('fileName: ' + fileName);
    execute(
        `psql -d postgresql://${username}:${password}@${hostname}/${databaseImport} < ${fileName}`
    ).then(() => {
        console.log('run import success');
    }).catch(err => {
        console.log('run import error', err);
    });
}

function backup () {
    execute(
        `PGPASSWORD=${password} pg_dump -U ${username} -h ${hostname} -p ${port} ${database} > ${fileName}        `
    ).then(async (res) => {
        importDb();
        await compress(fileName);
        // sendToBackupServer();
        // fs.unlinkSync(fileName);
        console.log("Zipped backup created");
    }).catch(err => {
        console.log('run backup error', err);
    })
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


function startSchedule() {
    cron.schedule('0 * * * * *', () => {
        backup();
        // sendToBackupServer();
    }, {});
}

module.exports = {
    startSchedule
}