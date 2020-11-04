module.exports = {
  devtool: "inline-source-map",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["thread-loader", "ts-loader"],
      },
    ],
  },
};
