/* global describe, it */
'use strict';

var fs = require('fs');
var should = require('should');

var gutil = require('gulp-util');
var w3cjs = require('../');

describe('gulp-w3cjs', function () {
	it('should pass valid files', function (done) {
		var a = 0;

		var fakeFile = new gutil.File({
			path: './test/html/valid.html',
			cwd: './test/',
			base: './test/html/',
			contents: fs.readFileSync('./test/html/valid.html')
		});

		var stream = w3cjs({showInfo: true});
		stream.on('data', function (newFile) {
			should.exist(newFile);
			newFile.w3cjs.success.should.equal(true);
			newFile.w3cjs.messages.filter(function(m) { return m.type!=="info"; }).length.should.equal(0);
			should.exist(newFile.path);
			should.exist(newFile.relative);
			should.exist(newFile.contents);
			newFile.path.should.equal('./test/html/valid.html');
			newFile.relative.should.equal('valid.html');
			++a;
		});

		stream.once('end', function () {
			a.should.equal(1);
			done();
		});

		stream.write(fakeFile);
		stream.end();
	});

	it('should fail invalid files', function (done) {
		var a = 0;

		var fakeFile = new gutil.File({
			path: './test/html/invalid.html',
			cwd: './test/',
			base: './test/html/',
			contents: fs.readFileSync('./test/html/invalid.html')
		});

		var stream = w3cjs();
		stream.on('data', function (newFile) {
			should.exist(newFile);
			newFile.w3cjs.success.should.equal(false);
			newFile.w3cjs.messages.filter(function(m) { return m.type!=="info"; }).length.should.equal(2);
			should.exist(newFile.path);
			should.exist(newFile.relative);
			should.exist(newFile.contents);
			newFile.path.should.equal('./test/html/invalid.html');
			newFile.relative.should.equal('invalid.html');
			++a;
		});

		stream.once('end', function () {
			a.should.equal(1);
			done();
		});

		stream.write(fakeFile);
		stream.end();
	});

	it('should be possible to set a new checkUrl', function () {
		w3cjs.setW3cCheckUrl('http://localhost');
	});
});
