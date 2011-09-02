Pollinate.App =

  init: ->
    Ti.UI.setBackgroundColor '#000'
    Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.OPAQUE_BLACK

    tabs = Ti.UI.createTabGroup
      id: "tabs"

    conf_list = Pollinate.Views.createConferenceTable
      title: "Conferences"
      tabBarHidden: true

    tab = Ti.UI.createTab
      id: "mainTab"
      window: conf_list

    tabs.addTab tab
    Ti.UI.currentTab = tab
    tabs.open()

