var exec = require('child_process').exec;
var debug = require('local-debug')('git');

module.exports = git;

function git (old, name, callback) {
  exec('git remote --verbose', function (error, output) {
    if (error) return callback();

    var match = output.match('(git\@[^ ]+)');

    if (!match) return callback();

    debug('Read existing remote as %s', match[1]);

    var url = match[1];
    var rpl = url.replace(old, name);

    debug('Replacing %s with %s', url, rpl);

    exec('git remote set-url origin ' + rpl, function (error, output) {
      if (error) return callback();
      callback(url, rpl);
    });
  });
}
