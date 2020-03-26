const { elt } = require('./elt');

class StyleUtilize {
  constructor(parent) {
    this.parent = parent;
  }

  removeStyle(id) {
    if (this.parent.querySelector(`#${id}`)) {
      this.parent.querySelector(`#${id}`).remove();
    }
  }

  updateStyle(id, text, insert = false, selector = "") {
    this.removeStyle(id, this.parent);
    if (insert) {
      if (this.parent.querySelector(selector)) {
        this.parent.insertBefore(elt("style", {"id": `${id}`}), this.parent.querySelector(selector));
        this.parent.querySelector(`#${id}`).innerHTML = text;
        return;
      }
    }
    this.parent.appendChild(elt("style", {"id": `${id}`}));
    this.parent.querySelector(`#${id}`).innerHTML = text;
  }
}

module.exports.StyleUtilize = StyleUtilize;