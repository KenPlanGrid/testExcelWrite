const AWS = require('aws-sdk');
const XLSX = require('xlsx');
const request = require('request');

const getAssetsRequest = () => new Promise((resolve, reject) => {
  const reqParams = {
    headers: {
      API_CLIENT: process.env.ASSETS_CLIENT_KEY,
      API_SECRET: process.env.ASSETS_SECRET_KEY,
    },
    url: `https://p5ak3v7pb9.execute-api.us-west-2.amazonaws.com/Production/assets?funds=3`,
  };
  request(reqParams, (err, response, body) => {
    if (err) {
      return reject(err);
    }
    if (!response) {
      return reject('No response from API');
    }
    if (response.statusCode === 403) {
      return reject('Unauthorized Request');
    }
    resolve(JSON.parse(body));
  });
});

const toWorkbook = async () => {
  try {
    const assets = await getAssetsRequest();
    console.log(assets.length);
    const workbook = XLSX.utils.json_to_sheet(assets);
    console.log(workbook);
    XLSX.writeFile(workbook, 'out.xlsb');

  } catch (err) {
    console.log(err);
  }
}

toWorkbook();
