
var casper = require('casper').create({
    // 浏览器窗口大小
    viewportSize: {
        width: 1920,
        height: 4080
    }
});

casper.start('http://pvp.wanmei.com')
casper.then(function() {
    this.click('.m1 .solgan .applybtn')
    this.wait(3000, function() {
        this.captureSelector('./images/1.png', '.reservepart .reservebox')
    })
})
casper.run();
