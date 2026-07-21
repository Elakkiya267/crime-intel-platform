'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (lowlight, defaultStyle) {
  return function SyntaxHighlighter(props) {
    var language = props.language;
    var children = props.children;
    var _props$style = props.style;
    var style = _props$style === undefined ? defaultStyle : _props$style;
    var _props$customStyle = props.customStyle;
    var customStyle = _props$customStyle === undefined ? {} : _props$customStyle;
    var _props$codeTagProps = props.codeTagProps;
    var codeTagProps = _props$codeTagProps === undefined ? {} : _props$codeTagProps;
    var _props$useInlineStyle = props.useInlineStyles;
    var useInlineStyles = _props$useInlineStyle === undefined ? true : _props$useInlineStyle;
    var _props$showLineNumber = props.showLineNumbers;
    var showLineNumbers = _props$showLineNumber === undefined ? false : _props$showLineNumber;
    var _props$startingLineNu = props.startingLineNumber;
    var startingLineNumber = _props$startingLineNu === undefined ? 1 : _props$startingLineNu;
    var lineNumberStyle = props.lineNumberStyle;

    var rest = _objectWithoutProperties(props, ['language', 'children', 'style', 'customStyle', 'codeTagProps', 'useInlineStyles', 'showLineNumbers', 'startingLineNumber', 'lineNumberStyle']);

    var codeTree = language ? lowlight.highlight(language, children) : lowlight.highlightAuto(children);
    var defaultPreStyle = style.hljs || { backgroundColor: '#fff' };
    var preProps = useInlineStyles ? Object.assign({}, rest, { style: Object.assign({}, defaultPreStyle, customStyle) }) : Object.assign({}, rest, { className: 'hljs' });
    var lineNumbers = showLineNumbers ? _react2.default.createElement(LineNumbers, {
      style: lineNumberStyle,
      startingLineNumber: startingLineNumber,
      codeString: children
    }) : null;
    return _react2.default.createElement(
      'pre',
      preProps,
      lineNumbers,
      _react2.default.createElement(
        'code',
        codeTagProps,
        codeTree.value.map(function (node, i) {
          return createElement({
            node: node,
            style: style,
            useInlineStyles: useInlineStyles,
            key: 'code-segement' + i
          });
        })
      )
    );
  };
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function createStyleObject(classNames, style) {
  return classNames.reduce(function (styleObject, className) {
    return _extends({}, styleObject, style[className]);
  }, {});
}

function createClassNameString(classNames) {
  return classNames.join(' ');
}

function createChildren(style, useInlineStyles) {
  var childrenCount = 0;
  return function (children) {
    childrenCount += 1;
    return children.map(function (child, i) {
      return createElement({
        node: child,
        style: style,
        useInlineStyles: useInlineStyles,
        key: 'code-segment-' + childrenCount + '-' + i
      });
    });
  };
}

function createElement(_ref) {
  var node = _ref.node;
  var style = _ref.style;
  var useInlineStyles = _ref.useInlineStyles;
  var key = _ref.key;
  var properties = node.properties;
  var type = node.type;
  var tagName = node.tagName;
  var value = node.value;

  if (type === 'text') {
    return value;
  } else if (tagName) {
    var TagName = tagName;
    var childrenCreator = createChildren(style, useInlineStyles);
    var props = useInlineStyles ? { style: createStyleObject(properties.className, style) } : { className: createClassNameString(properties.className) };
    var children = childrenCreator(node.children);
    return _react2.default.createElement(
      TagName,
      _extends({ key: key }, props),
      children
    );
  }
}

function getLineNumberString(lines, startingLineNumber) {
  return lines.reduce(function (lineCountString, _, i) {
    return lineCountString + (i + startingLineNumber + '\n');
  }, '');
}

function LineNumbers(_ref2) {
  var codeString = _ref2.codeString;
  var _ref2$style = _ref2.style;
  var style = _ref2$style === undefined ? { float: 'left', paddingRight: '10px' } : _ref2$style;
  var startingLineNumber = _ref2.startingLineNumber;

  return _react2.default.createElement(
    'code',
    { style: style },
    getLineNumberString(codeString.split('\n'), startingLineNumber)
  );
}