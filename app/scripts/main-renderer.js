const { ipcRenderer, clipboard, remote, nativeImage } = require('electron');
const { PrefManager } = require('./pref-manager');
const { StyleUtilize } = require('./styles');
const app = require('electron').remote.app;
const mainProcess = remote.require('./main.js');
const path = require('path');
const customTitlebar = require('custom-electron-titlebar');

let manager = new PrefManager(app.getPath("userData"));
let styleManager = new StyleUtilize(document.querySelector("body"));
let currentWidth = manager.getPref("width") || 300;
let currentHeight = manager.getPref("height") || 800;
let types = ["text", "html", "image", "rtf"];
let clipboardText = document.querySelector(".clipboard-text");
let bookmarkTitle = document.querySelector(".bookmark-title");
let bookmarkUrl = document.querySelector(".bookmark-url");
let image = document.querySelector(".clipboard-img");
let image2 = document.querySelector(".image-wall");
let textarea = document.querySelector(".textarea");
let textarea2 = document.querySelector(".title-setter");
let textarea3 = document.querySelector(".url-setter");
let clipboardElements = [".clipboard-text", ".clipboard-bookmark", ".clipboard-none", ".clipboard-img"];
let clipboardElements2 = [".setter-none", ".textarea", ".bookmark-setter", ".image-setter"];
let currentSelect = "";
let currentSelect2 = "";
let currentImg = null;

const currentWindow = remote.getCurrentWindow();

if (process.platform === "darwin" || process.platform === "win32") {
  types.push("bookmark");
  if (process.platform === "darwin") {
    types.push("findtext");
  }
  else {
    styleManager.updateStyle("button-hide", ".findtext { display: none !important; }");
  }
}
else {
  styleManager.updateStyle("button-hide", ".findtext { display: none !important; }");
  styleManager.updateStyle("button-hide-2", ".bookmark { display: none !important; }");
}

if (process.platform !== "darwin") {
  styleManager.updateStyle("title-hide", ".title-bar { display: none !important; }");
  if (process.platform === "win32") {
    new customTitlebar.Titlebar({
      backgroundColor: customTitlebar.Color.fromHex('#323232')
    });
  }
}

if (process.platform === "linux" || process.platform === "win32") {
  let hideScroll = [".clipboard-content", ".clipboard-setter"];
  let scrollStyle = "";
  for (let i = 0; i < hideScroll.length; i++) {
    scrollStyle += `${hideScroll[i]}::-webkit-scrollbar { display: none; }\n`;
  }
  styleManager.updateStyle("scroll-hide", scrollStyle);
}

const timeout = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const savePref = function() {
  ipcRenderer.send("save-pref", manager.prefs);
};

const updateSize = function(_, ht) {
  let height = ht;
  let style = "";
  if (process.platform === "darwin") {
    height -= 23;
  }
  else if (process.platform === "win32") {
    height -= 30;
  }
  let height2 = height * 0.455;
  let height3 = height2 * 0.9;
  let height4 = height3 * 0.1;
  let height5 = height2 * 0.7;
  let margin = height * 0.03;
  let margin2 = height2 * 0.05;
  let margin3 = (height3 - height4 * types.length) / (types.length + 1);
  let height6 = height2 - height5 - 3 * margin2;
  let height7 = height6 * 0.6;
  let height8 = height5 / 2 - 20 - 20 - 10;
  let margin4 = height6 * 0.2;
  style += `.inspector { height: ${height2}px; margin-top: ${margin}px; margin-bottom: ${margin}px; }\n`;
  style += `.setter { height: ${height2}px; margin-top: ${margin}px; margin-bottom: ${margin}px; }\n`;
  style += `.options { height: ${height3}px; margin-top: ${margin2}px; margin-bottom: ${margin2}px; }\n`;
  style += `.clipboard-content { height: ${height3}px; margin-top: ${margin2}px; margin-bottom: ${margin2}px; }\n`;
  style += `.clipboard-setter { height: ${height5}px; margin-top: ${margin2}px; margin-bottom: ${margin2}px; }\n`;
  style += `.clipboard-buttons { height: ${height6}px; }\n`;
  style += `.clipboard-none { height: ${height3}px; }\n`;
  style += `.setter-none { height: ${height5}px; }\n`;
  style += `.button { height: ${height4}px; margin-top: ${margin3}px; }\n`;
  style += `.clipboard-text { height: ${height3 - 20}px; }\n`;
  style += `.textarea { height: ${height5 - 20}px; }\n`;
  style += `.clipboard-bookmark { height: ${height3}px; }\n`;
  style += `.title-setter { height: ${height8}px; }\n`;
  style += `.url-setter { height: ${height8}px; }\n`;
  style += `.clipboard-buttons button { height: ${height7}px; margin-top: ${margin4}px; margin-bottom: ${margin4}px; }\n`;
  styleManager.updateStyle("size-style", style);
};

const getSelectedStyle = function(str) {
  return `${str} { background-color: rgb(200, 200, 200) !important; color: rgb(100, 100, 100) !important; }`;
};

const getHideStyle = function(str) {
  return `${str} { display: none !important; }`;
};

const show = function(str) {
  let style = "";
  for (let i = 0; i < clipboardElements.length; i++) {
    if (clipboardElements[i] !== str) {
      style += getHideStyle(clipboardElements[i]) + "\n";
    }
  }
  styleManager.updateStyle("hide-style", style);
};

const showNone = function() {
  show(".clipboard-none");
};

const showText = function() {
  show(".clipboard-text");
};

const showBookmark = function() {
  show(".clipboard-bookmark");
};

const showImg = function() {
  show(".clipboard-img");
};

const show2 = function(str) {
  let style = "";
  for (let i = 0; i < clipboardElements2.length; i++) {
    if (clipboardElements2[i] !== str) {
      style += getHideStyle(clipboardElements2[i]) + "\n";
    }
  }
  styleManager.updateStyle("hide-style-2", style);
};

const showNone2 = function() {
  show2(".setter-none");
};

const showText2 = function() {
  show2(".textarea");
};

const showBookmark2 = function() {
  show2(".bookmark-setter");
};

const showImg2 = function() {
  show2(".image-setter");
};

const updateClipboard = function(str) {
  if (str == "text") {
    showText();
    clipboardText.innerText = clipboard.readText();
  }
  else if (str == "html") {
    showText();
    clipboardText.innerText = clipboard.readHTML();
  }
  else if (str == "rtf") {
    showText();
    clipboardText.innerText = clipboard.readRTF();
  }
  else if (str == "findtext") {
    showText();
    clipboardText.innerText = clipboard.readFindText();
  }
  else if (str == "bookmark") {
    showBookmark();
    let bookmark = clipboard.readBookmark();
    bookmarkTitle.innerText = bookmark.title;
    bookmarkUrl.innerText = bookmark.url;
  }
  else if (str == "image") {
    showImg();
    let buffer = clipboard.readImage().toPNG();
    if (buffer.length) {
      ipcRenderer.send('write-img', buffer);
      image.src = path.join(app.getPath("userData"), "image.png");
    }
    else {
      image.src = "";
    }
  }
};

const updateClipboard2 = function(str) {
  if (str == "text") {
    showText2();
    textarea.value = manager.getPref("text") || "";
  }
  else if (str == "html") {
    showText2();
    textarea.value = manager.getPref("html") || "";
  }
  else if (str == "rtf") {
    showText2();
    textarea.value = manager.getPref("rtf") || "";
  }
  else if (str == "findtext") {
    showText2();
    textarea.value = manager.getPref("findtext") || "";
  }
  else if (str == "bookmark") {
    showBookmark2();
    textarea2.value = manager.getPref("title") || "";
    textarea3.value = manager.getPref("url") || "";
  }
  else if (str == "image") {
    showImg2();
  }
};

showNone();
showNone2();

ipcRenderer.on('resize', (_, width, height) => {
  currentWidth = width;
  currentHeight = height;
  updateSize(currentWidth, currentHeight);
});

ipcRenderer.on('file-opened', (_, file) => {
  currentImg = nativeImage.createFromPath(file);
  image2.src = file;
  if (file) {
    document.querySelector(".setter .image").innerText = "Image*";
  }
});

document.querySelector(".inspector .options").addEventListener("click", event => {
  for (let i = 0; i < types.length; i++) {
    if (event.target.classList.contains(types[i])) {
      styleManager.updateStyle("selected-button", getSelectedStyle(`.inspector .${types[i]}`));
      updateClipboard(types[i]);
      currentSelect = types[i];
      return;
    }
    currentSelect = "";
    styleManager.removeStyle("selected-button");
    showNone();
  }
});

document.querySelector(".setter .options").addEventListener("click", event => {
  for (let i = 0; i < types.length; i++) {
    if (event.target.classList.contains(types[i])) {
      styleManager.updateStyle("selected-button-2", getSelectedStyle(`.setter .${types[i]}`));
      updateClipboard2(types[i]);
      currentSelect2 = types[i];
      return;
    }
    currentSelect2 = "";
    styleManager.removeStyle("selected-button-2");
    showNone2();
  }
});

document.querySelector(".copy").addEventListener("click", _ => {
  let obj = {};
  if (manager.getPref("text")) {
    obj.text = manager.getPref("text");
  }
  if (manager.getPref("html")) {
    obj.html = manager.getPref("html");
  }
  if (manager.getPref("rtf")) {
    obj.rtf = manager.getPref("rtf");
  }
  if (manager.getPref("findtext")) {
    clipboard.writeFindText(manager.getPref("findtext"));
  }
  if (manager.getPref("title") || manager.getPref("url")) {
    clipboard.writeBookmark(manager.getPref("title"), manager.getPref("url"));
    obj.bookmark = manager.getPref("title");
    obj.text = manager.getPref("url");
  }
  if (currentImg) {
    obj.image = currentImg;
  }
  clipboard.write(obj);
});

document.querySelector(".clear").addEventListener("click", _ => {
  clipboard.clear();
});

textarea.addEventListener("input", _ => {
  if (currentSelect2 == "text" || currentSelect2 == "html" || currentSelect2 == "rtf" || currentSelect2 == "findtext") {
    manager.setPref(currentSelect2, textarea.value);
    savePref();
    let text = document.querySelector(`.setter .${currentSelect2}`).innerText;
    if (textarea.value && text.slice(text.length - 1) !== "*") {
      document.querySelector(`.setter .${currentSelect2}`).innerText = text + "*";
    }
    else if (!textarea.value) {
      if (text.slice(text.length - 1) === "*") {
        document.querySelector(`.setter .${currentSelect2}`).innerText = text.slice(0, text.length - 1);
      }
    }
  }
});

textarea2.addEventListener("input", _ => {
  manager.setPref("title", textarea2.value);
  savePref();
  let text = document.querySelector(".setter .bookmark").innerText;
  if ((textarea2.value || textarea3.value) && text.slice(text.length - 1) !== "*") {
    document.querySelector(".setter .bookmark").innerText = text + "*";
  }
  else if (!textarea2.value && !textarea3.value) {
    if (text.slice(text.length - 1) === "*") {
      document.querySelector(".setter .bookmark").innerText = text.slice(0, text.length - 1);
    }
  }
});

textarea3.addEventListener("input", _ => {
  manager.setPref("url", textarea3.value);
  savePref();
  let text = document.querySelector(".setter .bookmark").innerText;
  if ((textarea2.value || textarea3.value) && text.slice(text.length - 1) !== "*") {
    document.querySelector(".setter .bookmark").innerText = text + "*";
  }
  else if (!textarea2.value && !textarea3.value) {
    if (text.slice(text.length - 1) === "*") {
      document.querySelector(".setter .bookmark").innerText = text.slice(0, text.length - 1);
    }
  }
});

document.querySelector(".choose-image").addEventListener("click", _ => {
  mainProcess.getFileFromUser(currentWindow);
});

document.querySelector(".clear-image").addEventListener("click", _ => {
  currentImg = null;
  image2.src = "";
  document.querySelector(".setter .image").innerText = "Image";
});

const update = async function() {
  while (true) {
    await timeout(1000);
    if (currentSelect) {
      updateClipboard(currentSelect);
    }
  }
};

const update2 = function() {
  let allText = ["text", "html", "rtf", "findtext"];
  for (let i = 0; i < 4; i++) {
    if (manager.getPref(allText[i])) {
      document.querySelector(`.setter .${allText[i]}`).innerText = document.querySelector(`.setter .${allText[i]}`).innerText + "*";
    }
  }
  if (manager.getPref("title") || manager.getPref("url")) {
    document.querySelector(".setter .bookmark").innerText = "Bookmark*";
  }
};

update();
update2();