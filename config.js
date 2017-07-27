var SSH = require('simple-ssh');
exports.ssh = new SSH({
  host: '192.168.1.20', // server host
  user: 'root', //server user
  pass: '', //server password
  port:'22' //server port
});

