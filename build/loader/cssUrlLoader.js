module.exports = function(css) {
  return css.replace(/url\(\//ig, 'url(./')
};