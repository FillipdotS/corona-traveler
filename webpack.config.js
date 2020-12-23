module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    externals: function (context, request, callback) {
        if (/xlsx|canvg|pdfmake/.test(request)) {
            return callback(null, "commonjs " + request);
        }
        callback();
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
};