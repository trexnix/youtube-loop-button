var YouTubeLoopButtonStorage = (function(s) {
  var Storage = function(key) {
    this.key = key;
    this.storage = JSON.parse(s.getItem(this.key) || '[]');
  }

  Storage.prototype.add = function(id) {
    if (this.has(id))
      return;
    this.storage.push(id);
    this.save();
  }

  Storage.prototype.remove = function(id) {
    var pos = this.storage.indexOf(id);
    if (pos === -1)
      return;
    this.storage.splice(pos, 1);
    this.save();
  }

  Storage.prototype.has = function(id) {
    return this.storage.indexOf(id) > -1;
  };

  Storage.prototype.save = function() {
    s.setItem(this.key, JSON.stringify(this.storage));
  }

  return Storage;
} (localStorage));
