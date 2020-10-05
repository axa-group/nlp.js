/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const http = require('http');
const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
const HttpProxyAgent = require('http-proxy-agent');
const querystring = require('querystring');
const url = require('url');

function request(options) {
  if (typeof options === 'string') {
    options = {
      url: options,
    };
  }
  let client;
  if (options.url) {
    client = options.url.startsWith('http:') ? http : https;
    const requrl = url.parse(options.url);
    options.host = requrl.hostname;
    options.port = requrl.port;
    if (!options.port) {
      options.port = options.url.startsWith('http:') ? 80 : 443;
    }
    options.path = requrl.path;
    delete options.url;
  }
  if (!client) {
    client = options.port === 80 ? http : https;
  }
  let { postData } = options;
  if (postData) {
    if (typeof postData !== 'string') {
      postData = querystring.stringify(postData);
    }
    delete options.postData;
    if (!options.headers) {
      options.headers = {};
    }
    if (!options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/x-wwww-form-urlencoded';
    }
    if (!options.headers['Content-Length']) {
      options.headers['Content-Length'] = postData.length;
    }
  }
  if (!options.method) {
    options.method = 'GET';
  }
  const proxyServer =
    options.proxy ||
    process.env.https_proxy ||
    process.env.HTTPS_PROXY ||
    process.env.http_proxy ||
    process.env.HTTP_PROXY;
  if (proxyServer) {
    delete options.proxy;
    if (client === https) {
      options.agent = new HttpsProxyAgent(proxyServer);
    } else {
      options.agent = new HttpProxyAgent(proxyServer);
    }
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['Proxy-Connections'] = 'keep-alive';
  }

  return new Promise((resolve, reject) => {
    const req = client.request(options, (res) => {
      let result = '';
      res.on('data', (chunk) => {
        result += chunk;
      });
      res.on('end', () => {
        try {
          const obj = JSON.parse(result);
          resolve(obj);
        } catch (err) {
          resolve(result);
        }
      });
      res.on('error', (err) => reject(err));
    });
    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

module.exports = request;
