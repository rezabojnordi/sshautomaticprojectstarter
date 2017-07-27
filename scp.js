/**
 * @developer reza bojnordi
 */

//**************************variable***************************************
var client = require('scp2'),
  config = require('./config'),
  colors = require('colors'),
  ping = require('ping'),
  readlineSync = require('readline-sync'); //inputer for developer

//*****************************************************************
//******************************config***********************************************
var scp = {
  host: '192.168.1.20:22', //ip server and port
  user: 'root', //server user
  pass: '', // server password
  pathProject: 'pm2 start /home/reza/change/file.js', // specifies the project root folder
  unzipProject: 'unzip /home/reza/change/file.zip -d /home/reza/change/', //unzip project
  deleteProject: 'pm2 delete file', //delete the project from pm2 process list
  rmDirectoryProject: 'rm -rf /home/reza/change/file.js' //remove the previous project directory

}

//***********************************************************************************

var logo =
  ".oOOOo.        .oOo        .oOOOo.                            o\n" +
  "o     o        O          .O     o                           O \n" +
  "O.             o      O   o                                  o \n" +
  " `OOoo.        OoO   oOo  O                                  o \n" +
  "      `O .oOo. o      o   O   .oOOo `OoOo. .oOoO' 'OoOo. .oOoO \n" +
  "       o O   o O      O   o.      O  o     O   o   o   O o   O \n" +
  "O.    .O o   O o      o    O.    oO  O     o   O   O   o O   o \n" +
  " `oooO'  `OoO' O'     `oO   `OooO'   o     `OoO'o  o   O `OoO'o";

var command =
  '1:Send projects already configured on the server but should add?\n\n' +
  '2:online logs mongo?\n\n' +
  '3:Failed logs by mongo?\n\n' +
  '4:Check the operating system logs Centos?\n\n' +
  '5:Check the operating system security logs Centos?\n\n' +
  '6:open port for http? \n\n' +
  '7:clean redise?';

var dev = "============================...:::Reza Bojnordi:::...============================";

console.log('\n\n' + logo + '\n\n' + '\n\n' + command + '\n' + dev + '\n\n');

main();

function main () {
  var number = readlineSync.question('Please enter the number now?');
  if (number == 1) {
    //console.log('Hi ' + userName + '!');
    serverUpValidation(1);

  } else if (number == 2) {

    serverUpValidation(2);

  } else if (number == 3) {
    serverUpValidation(3);

  } else if (number == 4) {
    serverUpValidation(4);

  } else if (number == 5) {
    serverUpValidation(5);
  } else if (number == 6) {
    serverUpValidation(6);
  } else if (number == 7) {
    serverUpValidation(7);
  } else {
    console.log('NOT VALID');
  }
}

/**
 *
 * Send projects already configured on the server but should add
 */
function sendProject () {
  client.scp('file.zip', 'root:' + scp.pass + '@' + scp.host + ':/home/reza/change/', function (err) {
    if (err) {
      console.log('err');
    } else {
      console.log('upload in server');

      //**************remove old project in directory*************************
      config.ssh.exec(scp.rmDirectoryProject, {
        out: console.log.bind('delete project')

        //****************unzip project*******************************
      }).exec(scp.unzipProject, {
        out: console.log.bind('unzip project')
        //!*************delete project***********************************
      }).exec(scp.deleteProject, {
        out: console.log.bind('pm2 delete')
        //!*************start project************************************
      }).exec(scp.pathProject, {
        out: console.log.bind('pm2 start')
      }).start();

    }

  })

}

/**
 * Failed logs by mongo
 */
function failedLogMonGo () {
  ///var/log/mongodb
  console.log('-----------> faile mongo logs<----------------'.red);
  config.ssh.exec('cat /var/log/mongodb/mongod.log | grep "Failed"', {
    out: console.log.bind(console)
  }).start();

}

function onlineLogMonGo () {
  console.log('----------->online mongo logs<----------------'.green);
  config.ssh.exec('tail -f  /var/log/mongodb/mongod.log',{
    out:console.log.bind(console)
  }).start();
}

/**
 * messages logs
 */
function logMessage () {
  console.log('----------->messages logs<----------------'.green);
  config.ssh.exec('cat /var/log/messages', {
    out: console.log.bind(console)

  }).start();
}

/**
 *security logs
 */

function logSecurity () {
  console.log('--------------------------->security logs<----------------------------------'.green);

  config.ssh.exec('cat /var/log/secure', {
    out: console.log.bind(console)
  }).start()

}

/**
 * open port for http
 */

function openPortHttp () {
  //var userNumber = readlineSync.question('Please enter the number now?');
  var portHttp = readlineSync.question('Please enter the port http now?');

  //iptables -I INPUT 5 -i eth0 -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT
  config.ssh.exec('iptables -I INPUT 5 -i eth0 -p tcp --dport' + ' ' + +portHttp + ' -m state --state NEW,ESTABLISHED -j ACCEPT', {
    out: console.log.bind(console)
  }).exec('/sbin/service iptables save', {
    out: console.log.bind(console)
  }).start();

  //console.log('iptables -I INPUT 5 -i eth0 -p tcp --dport' + ' ' + +portHttp + ' -m state --state NEW,ESTABLISHED -j ACCEPT')
  // console.log(portHttp);

}

/**
 * clean redise
 */
function cleanReDiSe()
{
  //redis-cli flushall
  config.ssh.exec('redis-cli flushall',{
    out:console.log.bind(console)
  }).start();
}


/**
 * checking up server
 */
function serverUpValidation (number) {
  ping.promise.probe('192.168.1.68')
    .then(function (res) {
      // console.log('number', number);
      //console.log('res', res.alive);
      if (res.alive == true) {
        if (number == 5) {
          logSecurity()
        } else if (number == 4) {
          logMessage()

        } else if (number == 3) {
          failedLogMonGo();
        } else if (number == 2) {
          onlineLogMonGo();
        } else if (number == 1) {
          sendProject();
        } else if (number == 6) {
          openPortHttp();
        } else if (number == 7) {
          cleanReDiSe();
        } else {
          console.log('not valid'.red);
        }

      } else {
        console.log('%%%%%%%%%server down%%%%%%%%%'.red);
      }
    });
}
