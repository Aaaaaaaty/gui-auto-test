const casper = require('casper').create({
    // 浏览器窗口大小
    viewportSize: {
        width: 1920,
        height: 4080
    },
    onResourceReceived: function(casper, data) {
    	// if(data['status']!== 200) {
    		// console.log('请求地址：' + data['url'])
    		// console.log('状态码' + data['status'])
    		console.log(JSON.stringify(data))
    	// }
    	
    }
})
casper.start('http://10.2.45.110:3000/html5player/', function() {
    // this.debugPage();
});

casper.run();

