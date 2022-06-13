/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/app/' : '/',
    chainWebpack: (config) => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap((options) => {
                options.compiler = require('vue-template-babel-compiler');
                return options;
            });

        const svgRule = config.module.rule('svg');

        svgRule.uses.clear();

        svgRule
            .oneOf('inline')
            .resourceQuery(/inline/)
            .use('vue-svg-loader')
            .loader('vue-svg-loader')
            .end()
            .end()
            .oneOf('external')
            .use('file-loader')
            .loader('file-loader');
    },
};
