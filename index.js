"use strict";
var PLUGIN_NAME = 'gulp-dtpl';
var gutil = require('gulp-util');
var through = require('through2');
const cheerio = require('cheerio');
module.exports = function(options) {
    return through.obj(function(file, env, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        var data=file.contents.toString();
        var out = '';
        var $ = cheerio.load(data,{decodeEntities: false});
        $('template').each(function(index, el) {
            let tpl = $(el).html().replace(/(\n|\r|\s)*(<([^\n\r]+)>)(\n|\r|\s)*/gi, '$2').replace(/("|')/ig, "\\" + "$1");
            out += 'var ' + $(el).attr('id') + '=\"' + tpl + '\";';
        });
        file.contents = new Buffer(out);
        file.path = file.path.replace(/((\S|\s)+)(\.tpl)$/, '$1.js');
        this.push(file);
        cb();
    });
}
