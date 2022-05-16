(function(global){
    // import moment from 'moment';
    // import Logger from 'js-logger';
    const moment = global.moment
    const Logger = global.Logger
    const defaultLevel = Logger.DEBUG
    const MAINNAME = '__root__';

    const formatter = function (messages, context) {
        if (messages[0] === undefined) messages[0] = 'undefined'
        const l = messages[0].length;
        if (l < 80) messages[0] = messages[0] + ' '.repeat(80-l);
        messages.unshift(
            '['+moment().format('YYYY-MM-DD HH:mm:ss:SSS')+']' 
            + '[' + context.level.name + ']'
        );
    };

    Logger.useDefaults({ defaultLevel, formatter });

    const getLine = (params) => {
        const res ={method: '', file: '', line: 0, stack: ''}
        params = params || {shiftline: 0, passline: 0}
        params.shiftline = params.shiftline || 0;
        params.passline = params.passline || 0;
        const e = new Error();
        const stacklines = e.stack.toString().split(/\r\n|\n/)
        //res.stack = stacklines[0];
        const stack = stacklines.slice(params.passline)
        res.stack =  stack.reduce((prev, cur) => prev + '\n' + cur, res.stack);
        const frameRE = /at\s?(\S*)\s?\(?panorama\\(.*):(\d*):\d*\)?$/
        const parse = frameRE.exec(stack[0]);
        if (parse) {
            res.method = parse[1] || MAINNAME;
            res.file = parse[2];
            res.line = +parse[3] - params.shiftline
        }
        return res;
    }

    const Logging = (options) => {
        const property = {}
        options = options || {}
        options.shiftline = options.shiftline || 0 // коррекция, если дебаг не попадает в строку
        options.passline = options.passline || 6 // сколько строк пропустить в trace как служебные
        const consoleHandler = Logger.createDefaultHandler({defaultLevel, formatter})
        
        Logger.setHandler((messages, context) => {
            const msgs = Object.values(messages).map(
                m => (m instanceof Error)?'('+m.name+') ' + m.message: m)
            if (msgs.length == 0) msgs.push('')
            if (context.level.name == 'DEBUG'){
                const tmp  = getLine(options)
                const res = "[(" + tmp.method + ")" + tmp.file + ":" + (+tmp.line) + "]"
                msgs.push(res);
            }
            if (context.level.name == 'ERROR'){
                const tmp  = getLine(options);
                const res = "[(" + tmp.method + ")" + tmp.file + ":" + (+tmp.line) + "]"
                msgs.push(res)
                msgs.push(tmp.stack)
            }
            consoleHandler(msgs, context)
        })

        const data = () => {}
        data.getLogger = () => {
            return Logger;
        }
        
        return data;
    }
    
    if (typeof define === "function" && define.amd) {
        define(Logging);
    } else if (typeof module !== "undefined" && module.exports) {
        module.exports = Logging;
    } else {
        Logging._prevLogger = global.logging;
        Logging.noConflict = function () {
            global.logging = Logging._prevLogger;
            return Logging;
        };
        global.logging = Logging();
    }


})(this)
