var fs = require("fs");
var debug = require("local-debug")('manifest');

module.exports = manifest;

function bin (doc, old, name) {
  if (!doc.bin) return;

  var newBin = {};
  var key;
  var value;
  var newValue;

  for (key in doc.bin) {
    value = doc.bin[key];
    newValue = value.replace(old, name);
    newBin[key.replace(old, name)] = newValue;

    if (value != newValue) {
      debug('Moving %s to %s', value, newValue);
      fs.renameSync(value, newValue);
    } else {
      debug("Not changed: %s", value);
    }
  }

  doc.bin = newBin;
}

function manifest (name, callback) {
  if (!name) callback();

  debug('Reading the manifest file in working directory');

  fs.readFile('./package.json', function (error, buffer) {
    var doc = JSON.parse(buffer.toString());
    var old = doc.name;
    doc.name = name;

    debug('Renamed package name from %s to %s', old, name);

    bin(doc, old, name);
    repo(doc, old, name);

    fs.writeFile('./package.json', JSON.stringify(doc, null,  '  '), function (error) {
      if (error) return console.error('Failed to write package.json');
      callback(old, name);
    });

  });
}

function repo (doc, old, name) {
  if (!doc.manifest || !doc.manifest.url) return;
  doc.repository.url = doc.repository.url.replace(old, name);
}

