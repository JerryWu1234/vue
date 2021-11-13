const Dependency = require('webpack/lib/Dependency');
const generator_1 = require("@babel/generator").default;
const parser_1 = require("@babel/parser");
const traverse_1 = require("@babel/traverse").default;
class MyDependency extends Dependency {
  // Use the constructor to save any information you need for later
  constructor(module) {
    super();
    this.module = module;
  }
}

MyDependency.Template = class MyDependencyTemplate {
  apply(dep, source) {

    let v = source._source._value.slice()
    const ast = parser_1.parse(v, {
      sourceType: 'module',
    })

    traverse_1(ast, {
      ObjectProperty(path) {
        let [p] = [path]
        let v = p.get('value').node
        if (v.type === 'StringLiteral' && v.value.indexOf('el-button')) {
          // i will change el-button into Button
        }
      }
    })
    const m = generator_1(ast).code
    
    source.replace(0, source.source().length-1, m)
  }
};

module.exports = class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPluginName', compilation => {
      compilation.dependencyTemplates.set(
        MyDependency,
        new MyDependency.Template()
      );
      compilation.hooks.buildModule.tap('MyPluginName', module => {
        module.addDependency(new MyDependency(module));
      });
    });
  }
};
