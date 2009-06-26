FBL.ns(function() { with (FBL) {
  Firebug.ConsoleHelper = extend(Firebug.Module, {
    observedEvents: [],
    
    log: function(context, object, className, sourceLink) {
      this.observedEvents.push({object:object, className:className, sourceLink:sourceLink});
    },
    
    formatters: {
      spy: function(object) {
        return "spy:" + object;
      },
      errorMessage: function(object) {
        return "errorMessage: " + object;
      },
      other: function(object) {
        return object;
      }
    },
    
    onSaveConsole: function(context) {
      var self = this;
      
      var content = '<html><body><div id="consoleOutput">' +
                       jQuery(Firebug.Console.getPanel(context, true).getTopContainer()).html() +
                    '</div><div id="observedEvents">';
      
      jQuery.each(this.observedEvents, function() {
        content += '<div class="event">';
        if (self.formatters[this.className]) {
          content += self.formatters[this.className](this.object);
        } else {
          content += self.formatters.other(this.object);
        }
        content += '</div>';
      });
      
      content += '</div></body></html>\n';
      
      var path = "/Users/schapht/Desktop/console.html";
      var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
      file.initWithPath(path);
      if (!file.exists()) {
        alert("creating file...");
        file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420);
      }

      var stream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
      stream.init(file, 0x02 | 0x08 | 0x20, 0644, 0);
      stream.write(content, content.length);
      stream.close();
    }
  });

  Firebug.Console.addListener(Firebug.ConsoleHelper);
  Firebug.registerModule(Firebug.ConsoleHelper);
}});