
const casper = require('casper').create({
    // 浏览器窗口大小
    viewportSize: {
        width: 1920,
        height: 4080
    },
    onResourceReceived: function(casper, data) {
        var status = data['status'].toString()
    	if(status.match(/[4|5]\d{2}/)) {
    		console.log('请求地址：' + data['url'])
    		console.log('状态码' + data['status'])
            console.log('--------------------------------------')
    	}    	
    }
})
casper.start('http://www.163.com/', function() {
    console.log(123)
});

casper.run();
