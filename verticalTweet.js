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

var options = {};

function getVerticalTweet(src, options) {
    var tweet = "",
        defaultOptions = {
            row: 8,
            col: 15
        };

    tweet += getTopString(defaultOptions.row);

    src = src.split("（").join("︵");
    src = src.split("）").join("︶");

    // handle user options later.
    if (src.length <= defaultOptions.col * defaultOptions.row) {
        var columnArray = getColumnArray(src.split(""), defaultOptions);
        columnArray.reverse();

        for (var i = 0; i < defaultOptions.col; i++) {
            tweet += OUTER_BORDER_STRING;
            for (var j = 0; j < defaultOptions.row; j++) {
                tweet += columnArray[j][i] + (j + 1 == defaultOptions.row ? "" : INNER_BORDER_STRING);
            }
            tweet += (OUTER_BORDER_STRING + "\n");
        }

        tweet += getBottomString(defaultOptions.row);

        return tweet;
    } else {
        return "超出" + (src.length - defaultOptions.col * defaultOptions.row) + "个字数";
    }


}

function getColumnArray(arr, options) {
    var _array = [];

    while (arr.length) {
        _array.push(arr.splice(0, options.col));
    }

    while (_array.length < options.row) {
        _array.push([]);
    }

    _array.forEach(function(col) {
        while (col.length < options.col) {
            col.push(EMPTY_SPACE);
        }
    });

    return _array;
}

function getTopString(row) {
    var str = LEFT_TOP_CORNER_STRING;
    for (var i = 1; i < row; i++) {
        str += TOP_BORDER_CONNECT_STRING;
    }
    str += RIGHT_TOP_CORNER_STRING;
    str += "\n";
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

fs.writeFile("tweet.txt", getVerticalTweet("刚刚起床的时候看到时间线上有人这么发微博，觉得挺好玩就写了生成这个排版的小程序哈哈哈。不过现在只能支持中文的排版，因为英文会乱掉，不好看（而且只能在手机上看效果才好）。好了，我差不多要出去吃饭了。优不优化的以后再说，假期快乐！"), function(err) {
    if (!err)
        console.log("DONE");
});