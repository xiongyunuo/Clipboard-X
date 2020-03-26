const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

function getInstallerConfig () {
  console.log('creating windows installer');
  const rootPath = path.join('./');
  const outPath = path.join(rootPath, 'build');

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Clipboard X-win32-ia32/'),
    authors: 'Yunuo Xiong',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'Clipboard X.exe',
    setupExe: 'Clipboard X-Installer.exe',
    setupIcon: path.join(rootPath, 'icons', 'Icon.ico')
  });
}

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });