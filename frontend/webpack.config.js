const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('node:path');

module.exports = {
    devServer: {
        historyApiFallback: true,
        port: 5173,
        proxy: [
            {
                // дев: запросы к API уходят на backend (порт 5100)
                context: [ '/v1' ],
                target: 'http://127.0.0.1:5100'
            }
        ]
    },
    devtool: 'source-map',
    entry: './src/main.tsx',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                oneOf: [
                    {
                        // компонентные стили: css-modules, классы скоупятся автоматически
                        // (esModule: false — иначе дефолтный экспорт без .locals и styles приходит undefined)
                        test: /\.module\.css$/,
                        use: [
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    esModule: false,
                                    modules: {
                                        localIdentName: '[name]__[local]--[hash:base64:5]'
                                    }
                                }
                            }
                        ]
                    },
                    {
                        // глобальный styles.css — сброс и общие примитивы
                        use: [ 'style-loader', 'css-loader' ]
                    }
                ]
            }
        ]
    },
    output: {
        clean: true,
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'index.html' })
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    }
};
