var Monitor = require('page-monitor');
var url = 'http://www.douban.com';
var monitor = new Monitor(url);
monitor.capture(function(code){
        console.log(monitor.log); // from phantom
        console.log('done, exit [' + code + ']');
});
monitor.diff(1408947323420, 1408947556898, function(code){
    console.log(monitor.log.info); // diff result
    console.log('[DONE] exit [' + code + ']');
});