// const compiler = require('vue-template-compiler');
const compiler = require('vue-template-loader');
module.exports = function(content) {
  if(content.includes('<!DOCTYPE')) return content
  let html = content.replace(/^module\.exports\s\=\s/, '').replace(/\;$/, '')
  // let render = compiler.compileToFunctions(html).render
  let originContent = this.fs.readFileSync(this.resourcePath).toString()
  let _this = Object.assign({}, this, {
    callback: (arg1, code) => {
      let result = ''
      let fetchObj = new Function(code.replace(/module.exports[\s\S]*$/, 'return {render, staticRenderFns};\n'))()
      result += 'var html = ' + html + '\n'
      result += 'var render = ' + fetchObj.render.toString() + ';\n'
      // 每个 Vue 实例都有一个独立的 staticRenderFns，用来保存实例本身的静态 render
      result += 'var staticRenderFns = [' + fetchObj.staticRenderFns.join() + '];\n'
      result += 'module.exports = (' + 
        (function () {
          var options = {}
          options.render = render
          options.html = html
          options.staticRenderFns = staticRenderFns
          return options
        }).toString() + ')()';
      this.callback(null, result)
  }})
  compiler.call(_this, originContent)
};