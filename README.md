# Pugsby's Media Center
A web based media center I made with support for custom plugins
## Plugin Documentation
### Files
In the root of a plugin, the following files are supported:
- init.js
- icon.png
- style.css
- script.js
No other files are supported by default, you can load other files by either loading them from URL or by loading them in relative to index.html.
#### init.js
Use this for initialization of the plugin. You do not need to load other files or the icon since they're already loaded with the plugin.
#### icon.png
This is the icon displayed on the menu.
#### style.css
Use this for styles for the plugin, you can also style already existing objects.
#### script.js
Use this for scripting the plugin itself.
### File Format
Plugins use .pmcp, you can create a .pmcp file by zipping a folder and changing the extension to .pmcp. To set the title of the plugin, simply just write it in the name of the file.
### Template
There is a template in the root of the github repo.
