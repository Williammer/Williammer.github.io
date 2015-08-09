---
layout: post
title: Optimize TV application
excerpt: suggestions for tv app optimization
---
# Background
We've all been through the painful experience of using an application that is slow and sometimes freeze or even crash. Not to consider the case of system level bugs or some careless yet easy to fix bugs like infinite loop, it is the memory or performance that cause it. Two constraints accounts for this issue: 1. our xdk applications contain large amount of resources and, 2. many devices we targeted doesn't has affluent capacity of memory for our applications.
 
Therefore, we will need optimization to make our app survived on the low memory capacity devices and, make our app more pleasant to use on devices that have larger memory.
          
# Investigate
Normally, the major performance and memory consumers in our applications are requests of json files, images, etc, but each application should better have a specific memory analysis. The recommended way is to use profiler of Chrome devTool to find it out. There are many resources and tutorials online about how to use Chrome devTool to profile memory, but I think Google's official doc is always the best choice: https://developer.chrome.com/devtools/docs/javascript-memory-profiling.

On PS4, there is an API called WM_devSettings.memoryInfo that can show memory usage information from console log, so just put this variable into console.log and place it to wherever you want it to be loaded in the application.

On PS3, the Target Manager software can watch memory usage information. 
 
# Suggestions
These are some measures that I found helpful while trying to enhance the memory and performance in some XDK projects on Playstation, hope it can be helpful to developers who try to optimize their applications.

## Client-side:
1. should try to use css sprite to reduce http request number of images.
2. should implement lazyload for Grid.
3. should remove eventListener and clear timer when not needed.
4. should optimize the app with build tool, like gradle, grunt, etc.
5. should add in-app cache with certain size.
6. should properly clean up or dispose not-used object/array, or even DOM elements.

## Server-side:
1. should have "limit/size" parameter from API to implement lazyload on Grid.
2. should perform lossless-compression on the images that will be requested.
3. should set reasonable Cache and Expire Header to the images and json files that will be requested.
4. should be able to request different size of the same image with image size parameters, so as to avoid resizing images on front-end.
5. The structure of json datas should be well designed to satisfy the need of displaying info in application, it should neither needs to request too many json files, nor to request one large json file with a lot of data that are not gonna be used then.

## Playstation:
1. For both PS3 and PS4, we should set EnableDebugger=false in webmaf_setting.ini file to avoid memory being consumed by PS Debugger.
2. For PS4 that use webmaf 1.31 and above, it is able to change the browser memory by setting BrowserHeapSizeMB=VALUE in webmaf_setting.ini file. Default value for BrowserHeapSizeMB is around 160MB, and this value can be adjusted base on how much memory the app will need to support stream(it's a bit unclear how much exact memory value should we allocate to browser/video, since I don't know how to see the Video Memory usage information in PS4,  if anyone knows it plz let me know). Normally it is able to set it to 220 and the stream is not affected.
3. For PS3, the BrowserHeapSizeMB and VideoPlayerSizeMB have altogether 128MB, we can set proper value to these two settings to balance the memory allocation in PS3.

## More:
1. The book《High performance javaScript》has so many good suggestions for writing performance-friendly javaScript.
2. The book《High performance web sites》and 《Even faster web sites》has more in-depth optimize suggestions for both client and server side. 
3. This article covers everything about memory-friendly javaScript: http://www.smashingmagazine.com/2012/11/writing-fast-memory-efficient-javascript 


# Afterword
Optimization is a continuous process, it's not easy, and we will need to explore more measures and get apps optimized together! I hope this little blog can be an appetizer for more optimization blogs. If you have experience of other effective optimize measures, please also share with us.
