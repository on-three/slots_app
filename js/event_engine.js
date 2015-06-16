//npm install node-json-rpc
//$ npm install node-json-rpc

function eventEngine(slotgame) {
    console.log('Testing...');
    var irc = require('irc');
    var client = new irc.Client('irc.rizon.net', 'slotbot', {
      channels: ['#/jp/shows'],
    });
    client.addListener('error', function(message) {
      console.log('error: ', message);
    });
    client.addListener('pm', function (from, message) {
      console.log(from + ' => ME: ' + message);
      //irc.notice(from, message);
    });

    client.addListener('notice', function (from, to, message) {
      //Porygon notice => ME: Received 1 botcoins from on_three
      //var myString = "something format_abc";
      //Strip non ascii (irc color and format codes)
      console.log(message);
      var msg = message.replace(/[^\x00-\x7F]/g, "");
      var msg = message.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');
      console.log(msg);
      //var r = /^Received[^0-9].(\d+)[^0-9]./g;
      //Received 2 botcoins from on_three
      //Received 2 botcoins from on_three
      var r = /^Received (\d+) botcoins from (.+)/g
      var match = r.exec(msg);
      //alert(match[1]);  // abc
      if(!match) {
        return;
      }
      var sAmount = match[1];
      var amount = parseInt(sAmount);
      var nick = match[2];
      console.log('amount received is: ' + sAmount + ' from: ' + nick);
      //var busy = slotgame.busy;
      var busy = false;
      console.log(from + ' notice => ME: ' + message);
      if(from === 'Porygon' && amount == 2 && !busy) { //} && queue.length < 5) {
        if(busy) {
          //queue the spin
        }else{
          //do a spin for player
          slotgame.doSpin(nick);
        }
      }else if(from == 'Porygon'){
        //refund the money. (too much)
        client.say('#/jp/shows', "-give " + from + " " + sAmount);
      }
      //irc.notice(from, message);
    });
    client.addListener('message', function (from, to, message) {
      console.log(from + ' => ' + to + ': ' + message);
    });
}