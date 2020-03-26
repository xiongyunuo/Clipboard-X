# Clipboard-X
Cross-platform app to inspect and manipulate clipboard.  
For release: https://github.com/xiongyunuo/Clipboard-X/releases.  
Make sure you have node.js installed on your computer.  
In terminal, change the current directory to the root directory of this repository.  
If you are working in Windows, first you need to remove "electron-installer-debian", "electron-installer-dmg" dependencies from the "devDependencies" field in the package.json file.  
If you are working in Linux, first you need to remove "electron-winstaller", "electron-installer-dmg" dependencies from the "devDependencies" field in the package.json file.  
To install necessary dependencies, run  
`npm install`  
To run the app, run  
`npm run start`  
To build the app for the respective platform, run  
`npm run build-mac`  
`npm run build-win`  
`npm run build-linux`  
respectively. The packaged app should appear within the "build" folder.  
To create installer for this app for the respective platform, run  
`npm run create-mac-installer`  
`npm run create-debian-installer`  
`npm run create-installer-win`  
respectively. The installers should also appear within the "build" folder.  
