const system = require('system')
const casper = require('casper').create({
    // 浏览器窗口大小
    viewportSize: {
        width: 1920,
        height: 4080
    }
})
const fileName = decodeURIComponent(system.args[4])
const url = decodeURIComponent(system.args[5])
const selector = decodeURIComponent(system.args[6])
const id = decodeURIComponent(system.args[7])
casper.start(url)
casper.then(function() {
    this.wait(3000, function() {
    	console.log('正在截图请稍后')
        this.captureSelector('./images/captureTest3.png', selector)
    })
})
casper.then(function() {
	casper.start('http://10.2.45.110:3033/form.html', function() {
		this.fill('form#contact-form', {
		    'diff': './images/captureTest3.png',
		    'point': './images/' + fileName,
            'id': id
		}, true)
	})
})
casper.run()


