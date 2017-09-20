const system = require('system')
const casper = require('casper').create({
    // 浏览器窗口大小
    viewportSize: {
        width: 1920,
        height: 4080
    }
})
const url = decodeURIComponent(system.args[4])
const selector = decodeURIComponent(system.args[5])
casper.start(url)
casper.then(function() {
    // this.click('.m1 .solgan')
    this.wait(3000, function() {
    	console.log('正在截图请稍后')
        this.captureSelector('./images/captureTest2.png', selector)
        casper.start('http://10.2.44.66:3033/form.html', function() {
		    this.fill('form#contact-form', {
		        'diff':    'I am watching you',
		        'point':    'So be careful.',
		    }, true)
		})
    })
})
casper.run()


