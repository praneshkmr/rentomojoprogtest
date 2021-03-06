var pageGrabberUtil = require("../../app/utils/pageGrabberUtil");
var hyperlinkUtil = require("../../app/utils/hyperlinkUtil");
var csvExporterUtil = require("../../app/utils/csvExporterUtil");

var async = require('async');

function processPath(path, callback) {
  async.waterfall([
      async.apply(pageGrabberUtil.getRenderedHTML, path),
      hyperlinkUtil.findHyperlinks,
      hyperlinkUtil.getInternalLinks,
      hyperlinkUtil.getUniqueLinks
  ], function (err, result) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Got Following Unique paths",result);
      processPathQueue.push(result, function (err) {

      });
      csvExporterQueue.push(result, function (err) {

      });
    }
    callback(err,result);
  });
}

var processPathQueue = async.queue(function (path, callback) {
    processPath(path, callback);
}, 2);

var csvExporterQueue = async.queue(function (path, callback) {
    csvExporterUtil.appendLinkToCSVFile(path, callback);
}, 1);

processPathQueue.drain = function() {
    console.log('All Paths have been processed');
}

module.exports = function () {
  processPathQueue.push('/', function (err) {

  });
}
