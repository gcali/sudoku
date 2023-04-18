module.exports = {
    chainWebpack: (config) => {
    // Pug Loader
    config.module
        .rule('pug')
        .test(/\.pug$/)
        .use('pug-plain-loader')
        .loader('pug-plain-loader')
        .end();
    },
    pwa: {
        workboxOptions: {
            skipWaiting: true
        }
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                @import "@/style/variables.scss";
                @import "@/style/media.scss";
                `
            }
        }
    }
};
