const webpack = require("webpack");
const path = require("path");

function createCompiler(runCompiler) {
  const c = webpack({
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
    c.run();
  }

  return c;
}

function sleep(n) {
  return new Promise((r) => setTimeout(r, n));
}

function logMemory(message) {
  console.log(message, {
    heapMBs: Math.trunc(process.memoryUsage().heapUsed / 1024 / 1024),
  });
}

async function main() {
  const runCompiler = !!process.argv[2];
  if (runCompiler) {
    console.log("webpack will run, process should run out of memory");
  } else {
    console.log("webpack will not run, process should *not* run out of memory");
  }
  let compilers = [];

  while (true) {
    compilers.push(createCompiler(runCompiler));

    if (compilers.length > 10) {
      compilers = [];
      await sleep(1000);
      logMemory("after cleanup");
    }
  }
}

main();
