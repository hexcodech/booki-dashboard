webpackJsonp([3],{

/***/ 934:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(6);

var _user = __webpack_require__(61);

var _systemStats = __webpack_require__(936);

var _Widget = __webpack_require__(339);

var _Widget2 = _interopRequireDefault(_Widget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserWidget = function (_React$Component) {
	_inherits(UserWidget, _React$Component);

	function UserWidget() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, UserWidget);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = UserWidget.__proto__ || Object.getPrototypeOf(UserWidget)).call.apply(_ref, [this].concat(args))), _this), _this.componentDidMount = function () {
			var _this$props = _this.props,
			    dispatch = _this$props.dispatch,
			    accessToken = _this$props.accessToken;


			dispatch((0, _user.fetchUsersIfNeeded)(accessToken));
		}, _this.handleRefreshClick = function (e) {
			e.preventDefault();

			var _this$props2 = _this.props,
			    dispatch = _this$props2.dispatch,
			    accessToken = _this$props2.accessToken;


			dispatch((0, _systemStats.invalidateUsers)());
			dispatch((0, _user.fetchUsersIfNeeded)(accessToken));
		}, _this.render = function () {
			var users = _this.props.users;


			var newUsers = users.filter(function (user) {
				return new Date(user.created).getTime() >= Date.now() - 1000 * 60 * 60 * 24 * 7;
			});

			return _react2.default.createElement(
				_Widget2.default,
				{ handleRefreshClick: _this.handleRefreshClick },
				_react2.default.createElement(
					"p",
					null,
					users.length,
					" Users registered"
				),
				_react2.default.createElement(
					"small",
					null,
					newUsers.length,
					" within the last week"
				)
			);
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	return UserWidget;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state) {
	return {
		accessToken: state.app.authentication.accessToken.token,
		users: state.app.users
	};
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(UserWidget);

/***/ }),

/***/ 936:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fetchSystemStatsIfNeeded = exports.invalidateSystemStats = undefined;

var _rest = __webpack_require__(35);

var invalidateSystemStats = exports.invalidateSystemStats = function invalidateSystemStats() {
	return {
		type: "INVALIDATE_SYSTEM_STATS"
	};
};

var requestSystemStats = function requestSystemStats(accessToken) {
	return {
		type: "REQUEST_SYSTEM_STATS",
		accessToken: accessToken
	};
};

var failSystemStatsRequest = function failSystemStatsRequest(error) {
	return {
		type: "FAIL_SYSTEM_STATS_REQUEST",
		error: error
	};
};

var receiveSystemStats = function receiveSystemStats(systemStats, receivedAt) {
	return {
		type: "RECEIVE_SYSTEM_STATS",
		systemStats: systemStats,
		receivedAt: receivedAt
	};
};

var fetchSystemStats = function fetchSystemStats(accessToken) {
	return function (dispatch) {
		dispatch(requestSystemStats(accessToken));

		return (0, _rest.fetchApi)("system/stats", "GET", {}, accessToken).then(function (stats) {
			dispatch(receiveSystemStats(stats, Date.now()));
		}).catch(function (error) {
			dispatch(failSystemStatsRequest(error));

			dispatch(push("/"));
		});
	};
};

var shouldFetchSystemStats = function shouldFetchSystemStats(state, accessToken) {
	var stats = state.app.dashboard.systemStats;

	if (stats.isFetching) {
		return false;
	} else if (stats.lastUpdated === 0) {
		return true;
	} else {
		return stats.didInvalidate;
	}
};

var fetchSystemStatsIfNeeded = exports.fetchSystemStatsIfNeeded = function fetchSystemStatsIfNeeded(accessToken) {
	return function (dispatch, getState) {
		if (shouldFetchSystemStats(getState(), accessToken)) {
			// Dispatch a thunk from thunk!
			return dispatch(fetchSystemStats(accessToken));
		} else {
			// Let the calling code know there's nothing to wait for.
			return Promise.resolve();
		}
	};
};

/***/ })

});