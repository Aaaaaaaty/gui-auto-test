const system = require('system')
const host  = 'http://10.2.45.110:3033'
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
const time = new Date().getTime()
casper.start(url)
casper.then(function() {
    // this.wait(3000, function() {
    	console.log('正在截图请稍后')
        this.captureSelector('./images/casper'+ id + time +'.png', selector)
    // })
})
casper.then(function() {
	casper.start(host + '/form.html', function() {
		this.fill('form#contact-form', {
		    'diff': './images/casper'+ id + time +'.png',
		    'point': './images/' + fileName,
            'id': id
		}, true)
	})
})
casper.run()


