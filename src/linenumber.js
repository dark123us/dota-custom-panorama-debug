const lineNumber = (currentLine) => {
    var e = new Error();
    //console.log('currentLine ', currentLine);
    const data = () => {};
    var SHIFT = 0;
    data.ln = (e, asobject) => {
        asobject = asobject || false;
        var e = e || new Error();
        // https://stackoverflow.com/questions/2343343/how-can-i-determine-the-current-line-number-in-javascript

        if (!e.stack) try {
            // IE requires the Error to actually be throw or else the Error's 'stack'
            // property is undefined.
            throw e;
        } catch (e) {
            if (!e.stack) {
                return 0; // IE < 10, likely
            }
        }
        var stack = e.stack.toString().split(/\r\n|\n/);
        //console.log(stack)
        // We want our caller's frame. It's index into |stack| depends on the
        // browser and browser version, so we need to search for the second frame:
        var frameRE = /:(\d+):(?:\d+)[^\d]*$/;
        do {
            //stack.forEach(s => console.log(s));
            var frame = stack.shift();
        } while (!frameRE.exec(frame) && stack.length);
        //console.log(stack[0]);
        //stack.forEach(s => console.log(s));
        const frameRE2 = /at (.*) \(webpack-internal:\/\/\/(.*):(\d+):(?:\d+)[^\d]*$/
        const data = frameRE2.exec(stack.shift())
            //console.log(data);
        if (asobject)
            return { method: data[1], file: data[2], line: data[3] - SHIFT };
        return "[" + (data[1] == 'eval' ? "" : "(" + data[1] + ")") + data[2] + ":" + (+data[3] - SHIFT) + "]";
    }
    data.trace = () => {
            const e = new Error();
        }
        // console.log('currentLine ', currentLine);
    if (currentLine !== undefined && currentLine != null) {
        let ln = data.ln(e, true).line;
        // console.log(ln);
        SHIFT = ln - currentLine;
        // console.log('SHIFT ', SHIFT);
    }
    return data;
}

// at getDataParticles (webpack-internal:///./scripts/dataparticle.js:14:13)
// at eval (webpack-internal:///./scripts/index.js:40:86)
// at Module../scripts/index.js (panorama\scripts\index.js:1755:1)
// at __webpack_require__ (panorama\scripts\index.js:1822:42)
// at panorama\scripts\index.js:1886:37
// at panorama\scripts\index.js:1888:12
// at (\w*) \(webpack-internal:\/\/\/\.\/(.*)

export { lineNumber }