const weather = require('openweather-apis');
const request = require('request');
const Sentry = require('@sentry/node');

if (process.env.SENTRY_ENABLED) {
  Sentry.init({
    dsn: 'https://46f8a628a3204922bd252bae072ddb9b@sentry.maxemiliang.cloud/4'
  });
}

weather.setLang('en');
weather.setCityId(633679);
weather.setUnits('metric');

weather.setAPPID(process.env.API_KEY);

sendWeatherData();

function sendWeatherData() {
  weather.getAllWeather(function(err, jsonResp) {
    if (err) throw err;
    request
      .post(process.env.ENDPOINT, {
        form: {
          temperature: jsonResp.main.temp,
          humidity: jsonResp.main.humidity,
          source_name: 'external_api_turku',
          token: process.env.STORE_KEY
        }
      })
      .on('error', err => {
        throw err;
      })
      .on('response', res => {
        console.log(
          `[${new Date().toISOString()}] - Sent api data: ${res.statusCode}`
        );
        setTimeout(sendWeatherData, 10000);
      });
  });
}
