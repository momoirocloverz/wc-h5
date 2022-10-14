module.exports = {
  // 关闭eslint报错
  lintOnSave: false,
  productionSourceMap: false,
  outputDir: 'build',
  publicPath: './',
  css: {
    loaderOptions: {
      less: {
        sourceMap: true,
        lessOptions: {
          globalVars: {
            '@active_color': '#FF844E',
            '@title_color': '#333',
            '@content_color': '#4D4D4D',
            '@time_color': '#999',
            '@border_color': '#EDEFF2',
            '@price_color': '#F74444',
            '@newRatio': '1.4',
            '@lowRatio': '1.3',
          },
        },
      },
    },
  },
  devServer: {
    // https: true,
    overlay: {
      warnings: true,
      error: true,
    },
    proxy: {
      '/api': {
        // target: 'http://10.10.11.177',
        target: 'http://wencheng-xkm-apiweb.anchu.vip',
        // target: 'https://wencheng-xkm-apiweb.zjsszxc.com',
        // target:'http://pre-wencheng-gfb-apiweb.hzanchu.com',
        secure: false,
        changeOrigin: true,
      },
    },
  },
}
