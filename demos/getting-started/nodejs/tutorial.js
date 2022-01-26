const axios = require('axios');

var CLIENT_ID = process.env.CLIENT_ID;
if (CLIENT_ID === undefined) {
  CLIENT_ID = '[ENTER-YOUR-CLIENT-ID-HERE-IF-YOU-DONT-LIKE-ENVVARS]';
}

var CONSUMER_KEY = process.env.CONSUMER_KEY;
if (CONSUMER_KEY === undefined) {
  CONSUMER_KEY = '[ENTER-YOUR-KEY-HERE-IF-YOU-DONT-LIKE-ENVVARS]';
}

var USER_ID = process.env.USER_ID;
if (USER_ID === undefined) {
  USER_ID = '[ENTER-YOUR-USER-ID-HERE-IF-YOU-DONT-LIKE-ENVVARS]';
}

const basePath = '/api/v1';
const baseAPI = 'https://api.passiv.com';

const createRequest = (endpoint, method, data=null, user_id=null) => {
  const req = axios.create({
    url: basePath + endpoint,
    baseURL: baseAPI,
    method: method,
    timeout: 30000
  });
  return req; 
}

let req = createRequest('/', 'get')
let res = req.request()

console.log(res.data.json)
