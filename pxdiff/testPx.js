const resemble = require('resemblejs')
const fs = require('fs')

resemble.outputSettings({
    errorColor: {
        red: 255,
        green: 0,
        blue: 0
    },
    errorType: 'movement',
})
var diff = resemble('./images/captureTest2.png').compareTo('./images/captureTest1.png').ignoreColors().onComplete(function(data){
    console.log('对比结果：' + data)
	fs.writeFileSync('./images/output.png', data.getBuffer());
})
