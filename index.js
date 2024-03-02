const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');
const moment = require('moment');
const schedule = require('node-schedule');

// Replace these with your actual credentials
const consumerKey = 'gIp8dHZSvM9KSq1vFEaPDYJ7f';
const consumerSecret = '4HUMnRqmOKSpcWwczR5jFsTX0EEUI1B2asI0oJ5GidZ8DlfDxs';
const accessToken = '1098181745915105280-ONEI6x6absVtxAEDZ0MFN4EISNo48L';
const accessTokenSecret = 'Zb0cDsrlxIXcjLvRGiz09ZnEQuwm5TzsfZjIGW8InIAxd';

const client = new TwitterApi({
  appKey: consumerKey,
  appSecret: consumerSecret,
  accessToken: accessToken,
  accessSecret: accessTokenSecret
});

function getAndPostRates() {
    axios.get(`https://cedirates.com/api/v1/average/${moment().format('D-M-YYYY')}`).then((data) => {
        if(data.data) {
        client.v2.tweet({ text: `${moment().format('ddd D MMM, YYYY • hh:mm A')} \n \n 💵 1 USD = ₵${data.data.averageDollar.sellingRate.toFixed(2)} \n 💷 1 GBP = ₵${data.data.averagePound.sellingRate.toFixed(2)} \n 💶 1 EUR = ₵${data.data.averageEuro.sellingRate.toFixed(2)}` }).then((data) => {
            // console.log(data)
            console.log('Posted tweet')
        }).catch((err) => {
            console.log(`Error sending Tweet: ${err}`)
        })
    } else {
        console.log(`Error with data from backend`)
    }
    }).catch((error) => {
        console.log(`Error with fetching data: ${error}`)
    })
};
    
const job = schedule.scheduleJob('0 10 * * *', getAndPostRates);

console.log(`Job scheduled to run every day at 10 am: ${job.nextInvocation()}`);