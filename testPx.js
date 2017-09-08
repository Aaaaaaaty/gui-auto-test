const resemble = require('resemblejs')
const fs = require('fs')

resemble.outputSettings({
    errorColor: {
        red: 255,
        green: 0,
        blue: 0
    },
    errorType: 'movement',
    // transparency: 0.3,
    // largeImageThreshold: 1200,
    // useCrossOrigin: false
})
var diff = resemble('./images/pvp.jpg').compareTo('./images/1.png').ignoreColors().onComplete(function(data){
    console.log(data)
	fs.writeFileSync('./output.png', data.getBuffer());
})
diff.ignoreColors();