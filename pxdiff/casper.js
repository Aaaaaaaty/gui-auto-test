const system = require('system')
const { host } = require('./host.js')
const casper = require('casper').create({
    // 浏览器窗口大小
    viewportSize: {
        width: 1920,
        height: 4080
    }
})
console.log(1)
const fileName = decodeURIComponent(system.args[4])
const url = decodeURIComponent(system.args[5])
const selector = decodeURIComponent(system.args[6])
const id = decodeURIComponent(system.args[7])
let imgId = id + new Date().getTime()
casper.start(url)
casper.then(function() {
    this.wait(3000, function() {
    	console.log('正在截图请稍后')
        this.captureSelector('./images/casper'+ imgId +'.png', selector)
    })
})
casper.then(function() {
	casper.start(host + '/form.html', function() {
		this.fill('form#contact-form', {
		    'diff': './images/casper'+ imgId +'.png',
		    'point': './images/' + fileName,
            'id': id
		}, true)
	})
})
casper.run()


