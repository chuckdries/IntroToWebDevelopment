'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = (0, _express2.default)();
var dbPromise = _sqlite2.default.open('./test.db', { Promise: _bluebird2.default });

app.get('/', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
        var db, comments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return dbPromise;

                    case 3:
                        db = _context.sent;
                        _context.next = 6;
                        return db.all('SELECT \n        COMMENTS.id as id,\n            USERS.name AS author,\n            COMMENTS.message AS message \n        FROM COMMENTS \n        INNER JOIN USERS on USERS.id = COMMENTS.use');

                    case 6:
                        comments = _context.sent;

                        res.send(comments);
                        _context.next = 13;
                        break;

                    case 10:
                        _context.prev = 10;
                        _context.t0 = _context['catch'](0);

                        next(_context.t0);

                    case 13:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 10]]);
    }));

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}());

app.listen(8081);