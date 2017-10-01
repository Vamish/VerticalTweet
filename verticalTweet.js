var fs = require("fs");

var LEFT_TOP_CORNER_STRING = "┏━",
    TOP_BORDER_CONNECT_STRING = "┯━",
    RIGHT_TOP_CORNER_STRING = "┓",
    LEFT_BOTTOM_CORNER_STRING = "┗━",
    BOTTOM_BORDER_CONNECT_STRING = "┷━",
    RIGHT_BOTTOM_CORNER_STRING = "┛",
    OUTER_BORDER_STRING = "┃",
    INNER_BORDER_STRING = "│",
    EMPTY_SPACE = "　";

function getVerticalTweet(src, options) {
    var tweet = "",
        defaultOptions = {
            row: 8,
            col: 15
        };

    if (options.row) {
        defaultOptions.row = options.row;
    }
    if (options.col) {
        defaultOptions.col = options.col;
    }

    tweet += getTopString(defaultOptions.row);

    src = turnToFullWidthCharacter(src);

    src = replaceCharacter(src);

    // handle user options later.
    if (src.length <= defaultOptions.col * defaultOptions.row) {
        var columnArray = getColumnArray(src, defaultOptions);
        columnArray.reverse();

        for (var i = 0; i < defaultOptions.col; i++) {
            tweet += OUTER_BORDER_STRING;
            for (var j = 0; j < defaultOptions.row; j++) {
                tweet += columnArray[j][i] + (j + 1 == defaultOptions.row ? "" : INNER_BORDER_STRING);
            }
            tweet += (OUTER_BORDER_STRING + "\r\n");
        }

        tweet += getBottomString(defaultOptions.row);

        return tweet;
    } else {
        return "超出" + (src.length - defaultOptions.col * defaultOptions.row) + "个字";
    }
}

function getColumnArray(str, options) {
    var _array = [];

    var lines = [];
    if (str.indexOf("\r\n") > -1) {
        lines = lines.concat(str.split("\r\n"));
    } else if (str.indexOf("\n") > -1) {
        lines = lines.concat(str.split("\n"));
    } else {
        lines.push(str);
    }

    lines.forEach(function(line) {
        var arr = line.split("");

        while (arr.length) {
            _array.push(arr.splice(0, options.col));
        }

    })

    while (_array.length < options.row) {
        _array.push([]);
    }

    _array.forEach(function(col) {
        while (col.length < options.col) {
            col.push(EMPTY_SPACE);
        }
    })
    return _array;
}

function getTopString(row) {
    var str = LEFT_TOP_CORNER_STRING;
    for (var i = 1; i < row; i++) {
        str += TOP_BORDER_CONNECT_STRING;
    }
    str += RIGHT_TOP_CORNER_STRING;
    str += "\r\n";
    return str;
}

function getBottomString(row) {
    var str = LEFT_BOTTOM_CORNER_STRING;
    for (var i = 1; i < row; i++) {
        str += BOTTOM_BORDER_CONNECT_STRING;
    }
    str += RIGHT_BOTTOM_CORNER_STRING;
    return str;
}

function replaceCharacter(str) {
    var _str = str;

    _str = _str.split("（").join("︵");
    _str = _str.split("）").join("︶");
    _str = _str.split("“").join("﹃");
    _str = _str.split("”").join("﹄");
    _str = _str.split("‘").join("﹁");
    _str = _str.split("’").join("﹂");
    _str = _str.split("《").join("︽");
    _str = _str.split("》").join("︾");

    return _str;
}

function turnToFullWidthCharacter(str) {
    var result = "";
    var charlist = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    charlist += "abcdefghijklmnopqrstuvwxyz";
    charlist += "0123456789";
    charlist += " `~!@#$%^&*()_+-={}|[]:\";'<>?,./";
    for (var i = 0; i < str.length; i++) {
        var c1 = str.charAt(i);
        var c2 = str.charCodeAt(i);
        if (charlist.indexOf(c1) > -1) {
            if (" " == c1) {
                result += "　";
            } else {
                result += String.fromCharCode(str.charCodeAt(i) + 65248);
            }
        } else {
            result += String.fromCharCode(str.charCodeAt(i));
        }
    }
    return result;
}

var in_str = fs.readFileSync("in.txt", "utf8");
console.log(in_str);
fs.writeFile("out.txt", getVerticalTweet(in_str, { row: 6, col: 15 }), function(err) {
    !err && console.log("DONE");
})