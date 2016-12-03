---
layout: post
title: ⭐ Recommend Vorlon.js
excerpt: Recommend an open-source remote debug tool called Vorlon.js
---
I've recently come across a remote debug tool vorlon.js and it turns out to be quite useful (compared to our old friend Weinre) to remote debug our TV apps.

Here are some of its pros I feel appealing:

# 1. Easy to deploy
Vorlon.js is developed by Node.js and there are only 3 simple steps to add it into the app:

1. Install it from npm with:   **`$ npm i -g vorlon`**

2. Run the server with:        **`$ vorlon`**

3. Add the vorlon.js script to index file of your app:    **`<script src="http://localhost-or-your-ip:1337/vorlon.js">`**
   
# 2. Good UI with common devTool modules

It has those devTool common modules, and it's UI is quite concise. Like below:

![](https://raw.githubusercontent.com/Williammer/Williammer.github.io/master/images/20160425-shot1.PNG)

However, since it's quite a different look from the Chrome DevTool, we may need a little bit of time to adjust to it. But I think it's worth such a small effort. 

Besides, it has an extensible structure and allows to add more modules in the form of Plugins. And because it is open-sourced and is quite actively developed/maintained, it will gets better.
If you want to customize its modules, like remove certain default modules to reduce its weight, you can change its Server config.json, here are more details: [http://vorlonjs.com/documentation/#vorlonjs-server-advanced-topics](http://vorlonjs.com/documentation/#vorlonjs-server-advanced-topics)
 
# 3. Device Feature detection by it's integrated Modernizr  
It has integrated modernizr which enable us to see the device's support condition on many properties including HTML5, CSS3, etc.

![](https://raw.githubusercontent.com/Williammer/Williammer.github.io/master/images/20160425-shot2.PNG)

# 4. Reload the app from device
**(Thanks to Alejandro Ayuso's tip, we can also execute "location.reload" on the console of weinre or other remote debugger to achieve this)**

This is my favorite feature of this tool, it's able to save us the time of re-launching the modified app on some devices such as Sony TV/BDP, LG, Playstation, etc. By clicking on the "Reload Client" button on the left sidebar of vorlon.js dashboard, we can escape from the tedious and sometimes time-consuming steps of exit the app -> back to Home -> then navigate to certain portal app or Url Loader - >relaunch the app.

However, Samsung TV doesn't refresh it after reload, maybe it has sth to do with its sync mechanism. If anyone figure out a way to make it refresh on Samsung TV or other TV that doesn't refresh, please share the secret.

# A bit more
There are some other good features of this tool such as "My Device" and "Unit test", you can check out its document to learn more.

This tool is developed by some Microsoft guys, so I can feel that Microsoft does gets better and try to do some good things nowadays. <img src='https://assets-cdn.github.com/images/icons/emoji/unicode/1f609.png' height='22' />
