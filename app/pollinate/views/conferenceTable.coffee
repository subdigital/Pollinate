Pollinate.Views.createConferenceTable = (options = {}) ->

  window = Ti.UI.createWindow(options)

  rows = []

  # Fetch data and populate rows if you got 'em
  table = Ti.UI.createTableView
    id: "conference_list"
    className: "list"
    data: rows

  window.add table

  add_button = Ti.UI.createButton
    systemButton: Ti.UI.iPhone.SystemButton.ADD

  add_button.addEventListener 'click', (e) ->
    Titanium.UI.currentTab.open(Pollinate.Views.createNewConferenceWindow())

  window.rightNavButton = add_button

  createConferenceRow = (conf) ->
    title = "#{conf.name}"
    {
      title:    title,
      hasChild: true
    }

  dataBind = (conferences) ->
    rows = []
    rows.push createConferenceRow(c) for c in conferences
    table.setData(rows)

  Ti.App.addEventListener 'data:conferences:fetch', (e) ->
    dataBind(e.conferences)

  table.addEventListener "click", (e) ->
    Ti.API.debug("The row clicked was: " + e.rowData.title)

  dataBind(Pollinate.Factories.Conference.createTestConferences())

  window
