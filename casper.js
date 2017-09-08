const system = require('system')
const casper = require('casper').create({
    // 浏览器窗口大小
    viewportSize: {
        width: 1920,
        height: 4080
    }
})
const url = decodeURIComponent(system.args[4])
const selector = system.args[5]
casper.start(url)
casper.then(function() {
    this.click('.m1 .solgan .applybtn')
    this.wait(3000, function() {
        this.captureSelector('./images/2.png', '.reservepart .reservebox')
    })
})

casper.run()
