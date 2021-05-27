(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";
    CodeMirror.registerHelper("fold", "orgmode", function(cm, start) {
        // init
        const levelToMatch = headerLevel(start.line);

        // no folding needed
        if(levelToMatch === null) return;

        // find folding limits
        const lastLine = cm.lastLine();
        let end = start.line;
        while(end < lastLine){
            end += 1;
            let level = headerLevel(end);
            if(level && level <= levelToMatch) {
                end = end - 1;
                break;
            };
        }

        return {
            from: CodeMirror.Pos(start.line, cm.getLine(start.line).length),
            to: CodeMirror.Pos(end, cm.getLine(end).length)
        };

        function headerLevel(lineNo) {
            var line = cm.getLine(lineNo);
            var match = /^\*+/.exec(line);
            if(match && match.length === 1 && /header/.test(cm.getTokenTypeAt(CodeMirror.Pos(lineNo, 0)))){
                return match[0].length;
            }
            return null;
        }
    });
    CodeMirror.registerGlobalHelper("fold", "drawer", function(mode) {
        return mode.name === 'orgmode' ? true : false;
    }, function(cm, start) {
        const drawer = isBeginningOfADrawer(start.line);
        if(drawer === false) return;

        // find folding limits
        const lastLine = cm.lastLine();
        let end = start.line;
        while(end < lastLine){
            end += 1;
            if(isEndOfADrawer(end)){
                break;
            }
        }

        return {
            from: CodeMirror.Pos(start.line, cm.getLine(start.line).length),
            to: CodeMirror.Pos(end, cm.getLine(end).length)
        };

        function isBeginningOfADrawer(lineNo) {
            var line = cm.getLine(lineNo);
            var match = /^\:.*\:$/.exec(line);
            if(match && match.length === 1 && match[0] !== ':END:'){
                return true;
            }
            return false;
        }
        function isEndOfADrawer(lineNo){
            var line = cm.getLine(lineNo);
            return line.trim() === ':END:' ? true : false;
        }
    });
});
