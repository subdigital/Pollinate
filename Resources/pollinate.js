(function() {
  var Conference;
  var __hasProp = Object.prototype.hasOwnProperty;
  Pollinate.API = (function() {
    function API(login, password) {
      this.login = login;
      this.password = password;
    }
    API.prototype.requestURI = function(path, query) {
      var key, uri, value;
      if (query == null) {
        query = {};
      }
      Pollinate.API_ENDPOINT = "http://pollinate.com/api/v1";
      uri = "" + Pollinate.API_ENDPOINT + path + ".json?";
      for (key in query) {
        if (!__hasProp.call(query, key)) continue;
        value = query[key];
        uri += "" + key + "=" + (escape(value)) + "&";
      }
      uri = uri.replace(/^(&)/g, '');
      return uri;
    };
    API.prototype.request = function(path, options, authenticated) {
      var data, message, uri, xhr, _ref, _ref2, _ref3, _ref4;
      if (authenticated == null) {
        authenticated = true;
      }
      if ((_ref = options.method) == null) {
        options.method = 'GET';
      }
      if ((_ref2 = options.query) == null) {
        options.query = {};
      }
      if ((_ref3 = options.success) == null) {
        options.success = function() {
          return Ti.API.info;
        };
      }
      if ((_ref4 = options.error) == null) {
        options.error = function() {
          return Ti.API.error;
        };
      }
      xhr = Ti.Network.createHTTPClient();
      xhr.onreadystatechange = function(e) {
        var data;
        if (this.readyState === 4) {
          try {
            data = JSON.parse(this.responseText);
            if (data.error != null) {
              return options.error(data);
            } else {
              return options.success(data);
            }
          } catch (exception) {
            return options.error(exception);
          }
        }
      };
      uri = this.requestURI(path, options.query);
      xhr.open(options.method, uri);
      if (authenticated) {
        xhr.setRequestHeader('Authorization', 'Basic ' + Ti.Utils.base64encode(this.login + ':' + this.password));
      }
      message = "Executing ";
      message += authenticated ? "Authenticated " : "Unauthenticated ";
      message += "" + options.method + " " + uri;
      if (options.debug) {
        Ti.API.debug(message);
      }
      if (options.body != null) {
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        data = JSON.stringify(options.body);
        if (options.debug) {
          Ti.API.debug(data);
        }
        return xhr.send(data);
      } else {
        return xhr.send();
      }
    };
    API.prototype.get = function(path, options, authenticated) {
      if (authenticated == null) {
        authenticated = true;
      }
      options.method = 'GET';
      return this.request(path, options, authenticated);
    };
    API.prototype.post = function(path, options, authenticated) {
      if (authenticated == null) {
        authenticated = true;
      }
      options.method = 'POST';
      return this.request(path, options, authenticated);
    };
    return API;
  })();
  Pollinate.App = {
    init: function() {
      var conf_list, tab, tabs;
      Ti.UI.setBackgroundColor('#000');
      Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.OPAQUE_BLACK;
      tabs = Ti.UI.createTabGroup({
        id: "tabs"
      });
      conf_list = Pollinate.Views.createConferenceTable({
        title: "Conferences",
        tabBarHidden: true
      });
      tab = Ti.UI.createTab({
        id: "mainTab",
        window: conf_list
      });
      tabs.addTab(tab);
      Ti.UI.currentTab = tab;
      return tabs.open();
    }
  };
  Pollinate.Factories.Conference = {
    createTestConferences: function() {
      return [new Conference("Houston Code Camp"), new Conference("Austin Code Camp"), new Conference("LSRC"), new Conference("SXSW")];
    }
  };
  Pollinate.Helpers.Application = {
    createOrientiationModes: function() {
      var modes;
      modes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT, Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];
      return modes;
    }
  };
  Pollinate.Models.Conference = Conference = (function() {
    function Conference(name) {
      this.name = name;
      this.lat = 0;
      this.long = 0;
      this.location = "";
    }
    return Conference;
  })();
  Pollinate.Views.createConferenceTable = function(options) {
    var add_button, createConferenceRow, dataBind, rows, table, window;
    if (options == null) {
      options = {};
    }
    window = Ti.UI.createWindow(options);
    rows = [];
    table = Ti.UI.createTableView({
      id: "conference_list",
      className: "list",
      data: rows
    });
    window.add(table);
    add_button = Ti.UI.createButton({
      systemButton: Ti.UI.iPhone.SystemButton.ADD
    });
    add_button.addEventListener('click', function(e) {
      return Titanium.UI.currentTab.open(Pollinate.Views.createNewConferenceWindow());
    });
    window.rightNavButton = add_button;
    createConferenceRow = function(conf) {
      var title;
      title = "" + conf.name;
      return {
        title: title,
        hasChild: true
      };
    };
    dataBind = function(conferences) {
      var c, _i, _len;
      rows = [];
      for (_i = 0, _len = conferences.length; _i < _len; _i++) {
        c = conferences[_i];
        rows.push(createConferenceRow(c));
      }
      return table.setData(rows);
    };
    Ti.App.addEventListener('data:conferences:fetch', function(e) {
      return dataBind(e.conferences);
    });
    table.addEventListener("click", function(e) {
      return Ti.API.debug("The row clicked was: " + e.rowData.title);
    });
    dataBind(Pollinate.Factories.Conference.createTestConferences());
    return window;
  };
  Pollinate.Views.createNewConferenceWindow = function() {
    var window;
    window = Ti.UI.createWindow({
      title: "New Conference"
    });
    return window;
  };
}).call(this);
