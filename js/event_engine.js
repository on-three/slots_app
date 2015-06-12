//npm install node-json-rpc
//$ npm install node-json-rpc

var event_engine = {

  logo : function(stage) {
    var w = stage.canvas.width;
    var h = stage.canvas.height;
    var txt = new createjs.Text("#/jp/shows", "24px Arial", "#ffffff");
    txt.shadow = new createjs.Shadow("#000000", 2, 2, 5);
    var text_width = txt.getBounds().width;
    var text_height = txt.getBounds().height;
    txt.x = w - text_width - 10;
    txt.y = h - text_height - 5;
    stage.addChild(txt);
  },

  lane : function(stage, ypos) {
    this.y = ypos;
    this.t_complete = 0;
    this.AddText = function() {
      //keep track of the time from now in seconds this lane will be clear
      this.t_complete = performance.now() + 6000;
    };
    this.CanAdd = function(stage, text) {
      //can we add the given text to this lane?
      var t_remaining = this.t_complete - performance.now();
      if(t_remaining <= 0) {
        return true;
      }
      var stage_width = stage.canvas.width;
      var text_width = text.getBounds().width;
      var speed = (stage_width + text_width)/6000;
      var t_screen = stage_width/speed;//milliseconds for front of blurb to cross the screen
      return (t_screen > t_remaining);
    }
  },

  niconicoDisplay : function(stage) {
    this.lanes = [];
    for (var i = 0; i < 10; i++) {
      this.lanes.push(new event_engine.lane(stage, i*34+10));
    };

    this.Add = function (msg) {
        for(l in this.lanes) {
          ln = this.lanes[l];
          if(ln.CanAdd(stage, msg)) {
            ln.AddText();
            return ln.y;
            break;
          }
        }
        return 0;
      };
    },

  subtitleDisplay : function(stage) {
    var that = this;
    this.queue = [];
    this.currentText = undefined;
    this.Clear = function() {
      this.queue = [];
    };
    this.Add = function (msg) {
      if(this.currentText!=undefined) {
        this.queue.push(msg)
        return;
      }
      var w = stage.canvas.width;
      var h = stage.canvas.height;
      //limit text width to 3/4 canvas width
      var max_text_width = 3*w/4;
      this.currentText = new createjs.Container()
      var outline = new createjs.Text(msg, "48px Arial", "#000000");
      outline.outline = 3;
      outline.lineWidth = max_text_width;
      var fill = new createjs.Text(msg, "48px Arial", "#ffff00");
      fill.lineWidth = max_text_width;
      this.currentText.addChild(fill);
      this.currentText.shadow = new createjs.Shadow("#000000", 2, 2, 5);
      var text_width = fill.getBounds().width;
      var text_height = fill.getBounds().height;
      this.currentText.alpha = 0;
      this.currentText.y = h;
      //center
      this.currentText.x = w/2 - text_width/2;
      var y = h - text_height - 30;

      stage.addChild(this.currentText);
      createjs.Tween.get(this.currentText,{loop: false})
        .to({alpha:1,y:y}, 1500, createjs.Ease.backIn)
        .wait(5000)
        .to({alpha:0,y:y-text_height}, 1500, createjs.Ease.backOut)
        .call(function(){
          stage.removeChild(that.currentText);
          that.currentText = undefined;
          if(that.queue.length) {
            var n = that.queue.pop();
            that.Add(n);
          }
        });
      };
    },

  scrollingMessageDisplay : function(stage) {
    var that = this;
    this.currentText = undefined;
    this.Clear = function() {
      if(that.currentText!=undefined) {
        stage.removeChild(that.currentText);
        that.currentText = undefined;
      }
    };
    this.Add = function (msg) {
      if(this.currentText!=undefined) {
        return;
      }
      var w = stage.canvas.width;
      var h = stage.canvas.height;
      this.currentText = new createjs.Container()
      var outline = new createjs.Text(msg, "48px Arial", "#000000");
      outline.outline = 3;
      var fill = new createjs.Text(msg, "48px Arial", "#ffff00");
      this.currentText.addChild(fill);
      this.currentText.shadow = new createjs.Shadow("#000000", 2, 2, 5);
      var text_width = fill.getBounds().width;
      var text_height = fill.getBounds().height;
      this.currentText.y = h - text_height - 30;;
      //center
      this.currentText.x = w;

      //loop scrolling message 3 times
      stage.addChild(this.currentText);
      createjs.Tween.get(this.currentText,{loop: false})
        .to({x:-1*text_width}, 6000)
        .to({x:w},0)
        .to({x:-1*text_width}, 6000)
        .to({x:w},0)
        .to({x:-1*text_width}, 6000)
        .call(function(){
          stage.removeChild(that.currentText);
          that.currentText = undefined;
          });
      };
    },

imagesDisplay : function(stage) {
    var that = this;
    this.queue = [];
    this.currentImage = undefined;
    this.loading = false;
    this.Clear = function() {
      this.queue = [];
    };
    this.Show = function (url) {
      if(this.loading) {
        this.queue.push(url)
        return;
      }
      //first fetch our image (won't work well with large video files)
      var image = new Image();
      this.loading = true;
      
      image.onerror = function() {
        that.loading = false;
        if(that.queue.length) {
          var n = that.queue.pop();
          that.Show(n);
        }
      };
      image.onload = function() {

        var w = stage.canvas.width;
        var h = stage.canvas.height;
        //limit text width to 3/4 canvas width
        var max_text_width = 3*w/4;
        this.currentImage = new createjs.Container()

        var logo = new createjs.Bitmap(image);
        this.currentImage.addChild(logo);
        var image_width = logo.getBounds().width;
        var image_height = logo.getBounds().height;

        //scale the image to fit our screen (max 50% height)
        var scale =(h/2)/ image_height;
        logo.scaleX = scale;
        logo.scaleY = scale;

        this.currentImage.alpha = 0;
        this.currentImage.y = 0;
        //center
        this.currentImage.x = -1*image_width;
        stage.addChild(this.currentImage);
        createjs.Tween.get(this.currentImage,{loop: false})
          .to({alpha:1,x:0}, 1500, createjs.Ease.backInOut)
          .wait(2000)
          .to({alpha:0,x:-1*image_width}, 1500, createjs.Ease.backInOut)
          .call(function(){
            stage.removeChild(that.currentImage);
            that.currentImage = undefined;
            that.loading = false;
            if(that.queue.length) {
              var n = that.queue.pop();
              that.Show(n);
            }
          });
        };
        image.src = url;
      };
    },

  fourChinDisplay : function(stage) {
    var that = this;
    this.queue = [];
    this.loading = false;
    this.Clear = function() {
      that.queue = [];
    };
    this.Show = function (url) {
      if(that.loading) {
        that.queue.push(url)
        return;
      }
      that.loading=true;
      //Load the page into an iframe in our div
      //waiting for it to load before (maipulating and)
      //showing it.c d
      var $j = jQuery.noConflict();
      that.post = $j('#fourChinPost');

      // var iframe = document.createElement('iframe');
      // iframe.frameBorder=0;
      // iframe.width="100%";
      // iframe.height="100%";
      // iframe.id="mypost";
      // document.getElementById("fourChinPost").appendChild(iframe);
      // iframe.setAttribute("src", url);
      // var f=$j('#mypost')
      // f.load(function(){ 
      //   //f.contents().find('div').hide(); 
      //   if(!that.loading) {
      //     return;
      //   }
      //   $j("#mypost").contents().find('form#delform)').not().remove();
      //   //$j("#mypost > *:not(#delform)").remove();
      //   //$j("#mypost div.reply:not(#p57532420)").remove();
      //   //f.not("body > *:not(#p32818709)").remove();
      //   that.loading=false;
      //   that.post.show('slide',{direction:'down'},500)
      //     .delay(4000)
      //     .hide('slide',{direction:'down'},500);
      // })
      // iframe.onload = function() {
      //   if(!that.loading) {
      //     return;
      //   }
      //   var f=$('#foo')
      //   //remove a lot from the iframe, only displaying the post we want
      //   that.loading=false;
      //   that.post.show('slide',{direction:'down'},500)
      //   .delay(4000)
      //   .hide('slide',{direction:'down'},500,  function(){document.getElementById("fourChinPost").removeChild(iframe)});
      // }
      
      //first fetch the page.
      var request = require("request");
      var $j = jQuery.noConflict();
      that.post = $j('#fourChinPost');
 
      request({uri: url}, function(error, response, body) {
        that.loading = false;
        if(error) {
          //load up the next in the queue
          if(that.queue.length) {
            var n = that.queue.pop();
            that.Show(n);
          }
          return;
        }
        //html = $j.parseHTML( body ).contents().find('form#delform');
        var tempDom = $j('<output>').append($j.parseHTML(body));
        that.d = $j('#pc57535792', tempDom);
        that.post.append( that.d );
        //document.getElementById("fourChinPost").addChild( d );
        // var iframe = document.createElement('iframe');
        // iframe.frameBorder=0;
        // iframe.width="100%";
        // iframe.height="100%";
        // iframe.id="randomid";
        // iframe.setAttribute("src", url);
        // document.getElementById("fourChinPost").appendChild(iframe);
        that.post.show('slide',{direction:'down'},500)
        .delay(4000)
        .hide('slide',{direction:'down'},500);
      });
    };
  },

  init: function(stage) {
    var rpc = require('node-json-rpc');
    var request = require("request");
    niconico = new event_engine.niconicoDisplay(stage);
    subtitle = new event_engine.subtitleDisplay(stage);
    images = new event_engine.imagesDisplay(stage);
    scrolling = new event_engine.scrollingMessageDisplay(stage);
    fourChin = new event_engine.fourChinDisplay(stage);
    event_engine.logo(stage);

    var options = {
      // int port of rpc server, default 5080 for http or 5433 for https 
      port: 5080,
      // string domain name or ip of rpc server, default '127.0.0.1' 
      host: '127.0.0.1',
      // string with default path, default '/' 
      path: '/',
      // boolean false to turn rpc checks off, default true 
      strict: true
    };
   
    // Create a server object with options 
    this.serv =  new rpc.Server(options);

    this.serv.addMethod('StaticMessage', function (para, callback){
      var msg = para.msg;
      subtitle.Add(msg);
      var error, result;
      result = 'OK';
      callback(error, result);
    });

    this.serv.addMethod('ClearAll', function (para, callback){
      subtitle.Clear();
      scrolling.Clear();
      var error, result;
      result = 'OK';
      callback(error, result);
    });

    this.serv.addMethod('ScrollingMessage', function (para, callback){
      var error, result;
      var msg = para.msg;
      scrolling.Add(msg)
      result = 'OK';
      callback(error, result);
    });

    this.serv.addMethod('AddNicoNicoMsg', function (para, callback){

      var msg = para.msg;

      var error, result;
      //add text to stage
      var c = new createjs.Container()
      var outline = new createjs.Text(msg, "36px Arial", "#000000");
      outline.outline = 3;
      var fill = new createjs.Text(msg, "36px Arial", "#ffff00");
      c.addChild(fill);
      fill.shadow = new createjs.Shadow("#000000", 2, 2, 4);
      var w = stage.canvas.width;
      var text_width = fill.getBounds().width;
      c.x = w;
      c.y = niconico.Add(fill);
      stage.addChild(c);

      createjs.Tween.get(c,{loop: false})
        .to({x:-1.0*text_width}, 6000)
        .call(function(){stage.removeChild(c);});
      result = "OK";
      callback(error, result);
    });

    this.serv.addMethod('showImage', function (para, callback){
      var error, result;
      var url = para.url;
      images.Show(url);

      result = 'OK';
      callback(error, result);
    });

    this.serv.addMethod('showFourChinPost', function (para, callback){
      var error, result;
      var url = para.url;
      fourChin.Show(url);

      result = 'OK';
      callback(error, result);
    });
      
  // Start the server 
  this.serv.start(function (error) {
    // Did server start succeed ? 
    if (error) throw error;
    else console.log('Server running ...');
  });
}

}