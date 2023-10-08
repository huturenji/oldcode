const HtmlWebpackPlugin = require("html-webpack-plugin");
class HtmlWebpackHandleCssInjectPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    try{
        const handleHtmlWebpackPluginAfterHtmlProcessing = (data, callback) => {
            const { filter } = this.options;
            if (!filter) {
              return;
            }
            data.html = data.html.replace(/<link .+?>(?=(?:<.+?>)*<\/head>)/g, (link) => {
              const filePath = link.match(/(href=")(.*)" /)[2];
              return filter(filePath, link) ? link : '';
            });
            callback && callback(null, data);
          };
      
          if (compiler.hooks) {
            // webpack 4 support
            compiler.hooks.compilation.tap('htmlWebpackPluginAfterHtmlProcessing', (compilation) => {
              HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync('htmlWebpackPluginAfterHtmlProcessing',handleHtmlWebpackPluginAfterHtmlProcessing);
            });
          } else {
            // Hook into the html-webpack-plugin processing
            compiler.plugin('compilation', (compilation) => {
              compilation.plugin('html-webpack-plugin-after-html-processing', handleHtmlWebpackPluginAfterHtmlProcessing);
            });
          }
    }catch(e){
        console.error(e)
    }
  }
}

module.exports = HtmlWebpackHandleCssInjectPlugin;