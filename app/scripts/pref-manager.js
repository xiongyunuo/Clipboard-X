const fs = require('fs');
const path = require('path');

class PrefManager {
  constructor(rootPath) {
    this.prefFileName = "ClipboardXPref.txt";
    this.prefs = Object.create(null);
    this.pathName = path.join(rootPath, this.prefFileName);
    try {
      let string = fs.readFileSync(this.pathName);
      this.prefs = JSON.parse(string);
    }
    catch (_) {}
  }

  save() {
    try {
      fs.writeFileSync(this.pathName, JSON.stringify(this.prefs));
    }
    catch (_) {}
  }

  setPref(name, value) {
    this.prefs[name] = value;
  }

  getPref(name) {
    return this.prefs[name];
  }
}

module.exports.PrefManager = PrefManager;