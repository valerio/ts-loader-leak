# Ts-loader leak example

This repo demonstrates a memory leak in `ts-loader` as of version 8.0.7.

## Why

When creating webpack compilers at runtime, their references are retained if they used the `ts-loader` loader.
This is likely because `ts-loader` keeps a global cache (array) of compilers, which never gets cleared and forces compilers to be retained.

## Running it

Make sure to install packages as normal with `yarn install`.


### Without a memory leak

Running the script normally should not leak memory (the compilers are created, but will not be called):
```bash
node index.js
```

The script will log used heap memory in MBs every time it removes references to the compilers.
Memory usage should go up but eventually cleared, for example:
```
➜  ts-loader-leak git:(main) ✗ node index.js
webpack will not run, process should *not* run out of memory
current heap usage { heapMBs: 13 }
current heap usage { heapMBs: 15 }
current heap usage { heapMBs: 16 }
current heap usage { heapMBs: 18 }
current heap usage { heapMBs: 19 }
current heap usage { heapMBs: 14 }
current heap usage { heapMBs: 16 }
current heap usage { heapMBs: 17 }
current heap usage { heapMBs: 19 }
current heap usage { heapMBs: 20 }
current heap usage { heapMBs: 14 }
```

### With a memory leak

To run with a memory leak, simply pass any argument via CLI:
```bash
node index.js 1
```

The script should quickly run out of memory (by default NodeJS heap peaks at ~2GB):
```
➜  ts-loader-leak git:(main) ✗ node index.js 1
webpack will run, process should run out of memory
current heap usage { heapMBs: 101 }
current heap usage { heapMBs: 151 }
current heap usage { heapMBs: 206 }
current heap usage { heapMBs: 262 }
// omitted for brevity
current heap usage { heapMBs: 1743 }
current heap usage { heapMBs: 1797 }
current heap usage { heapMBs: 1839 }
current heap usage { heapMBs: 1891 }
current heap usage { heapMBs: 1945 }
current heap usage { heapMBs: 2000 }
current heap usage { heapMBs: 2041 }

<--- Last few GCs --->

[2968:0x102a79000]    36031 ms: Mark-sweep 2044.4 (2052.9) -> 2043.5 (2057.4) MB, 1048.8 / 0.0 ms  (average mu = 0.139, current mu = 0.010) allocation failure scavenge might not succeed
[2968:0x102a79000]    37556 ms: Mark-sweep 2046.9 (2057.4) -> 2044.5 (2052.4) MB, 1501.7 / 0.0 ms  (+ 0.1 ms in 54 steps since start of marking, biggest step 0.0 ms, walltime since start of marking 1525 ms) (average mu = 0.070, current mu = 0.015) allocat
```


