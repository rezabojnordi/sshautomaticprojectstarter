# sshautomaticprojectstarter

this utility gives you the following options: 

1. sends the your zipped project to the server

2.unzips and runs your project 

3.shows mongo's fail logs 

4.shows linux's message log 

5.shows linux's security logs 

6.shows your server requests to mongo database 

7.flush your redis database


#how to use
Specify your IP, port, username and password of your ssh connection in config.js. Do the same for scp connection in scp.js also you have to specify the directories of you project on the server.

/-------------------------------------------------
var SSH = require('simple-ssh');
exports.ssh = new SSH({
  host: '192.168.1.68', // server host
  user: 'root', //server user
  pass: '', //server password
  port:'2270' //server port
});
//-------------------------------------------------
var scp = {
  host: '192.168.1.68:2270', //ip server and port
  user: 'root', //server user
  pass: '', // server password
  pathProject: 'pm2 start /home/reza/change/file.js', // specifies the project root folder
  unzipProject: 'unzip /home/reza/change/file.zip -d /home/reza/change/', //unzip project
  deleteProject: 'pm2 delete file', //delete the project from pm2 process list
  rmDirectoryProject: 'rm -rf /home/reza/change/file.js' //remove the previous project directory

}






