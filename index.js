const webpack = require("webpack");
const path = require("path");

async function main() {
  const runCompiler = !!process.argv[2];
  if (runCompiler) {
    console.log("webpack will run, process should run out of memory");
  } else {
    console.log("webpack will not run, process should *not* run out of memory");
  }

  while (true) {
    let compiler = webpack({
      context: path.resolve("./src"),
      mode: "development",
      devtool: "inline-source-map",
      entry: "./app.ts",
      output: {
        filename: "bundle.js",
      },
      resolve: { extensions: [".ts", ".tsx", ".js"] },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: require.resolve("ts-loader"),
          },
        ],
      },
    });

    if (runCompiler) {
      await new Promise((r) => {
        compiler.run(r);
      });
      logMemory("current heap usage");
    } else {
      // wait 0.5s to avoid spamming log messages
      await new Promise((r) => setTimeout(r, 500));
      logMemory("current heap usage");
    }
  }
}

main();
