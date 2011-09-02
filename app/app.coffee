# This file is the entry point for the application. It sets up the four main
# tab windows.
# The `Pollinate` object provides common access to app data, API wrapper and UI utilities

# ## Pollinate ##
Pollinate =
  Models:
    Conference: {}
  Helpers:  {}
  Factories: {}
  Views:
    Settings: {}

# Include your libraries like:
# Ti.include('vendor/date.js')
# Ti.include('vendor/underscore.js')
# Ti.include('vendor/backbone.js')

Ti.include('pollinate.js')

# Alias, so you could do $.App.init() below. If you have an API class, 
# make sure to either use the full app name or declare the below at the top
# and use $.API for the class name. Uncomment to use.
# $ = Pollinate

Pollinate.App.init()
