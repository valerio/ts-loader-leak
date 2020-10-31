# Ts-loader leak example

This repo demonstrates a possible memory leak in `ts-loader`.

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
Memory should eventually be cleared, for example:
```
➜  ts-loader-leak git:(master) ✗ node index.js
webpack will not run, process should *not* run out of memory
after cleanup { heapMBs: 17 }
after cleanup { heapMBs: 21 }
after cleanup { heapMBs: 23 }
after cleanup { heapMBs: 25 }
after cleanup { heapMBs: 27 }
after cleanup { heapMBs: 28 }
after cleanup { heapMBs: 31 }
after cleanup { heapMBs: 22 }
after cleanup { heapMBs: 26 }
after cleanup { heapMBs: 30 }
```

### With a memory leak

To run with a memory leak, simply pass any argument via CLI:
```bash
node index.js 1
```

The script should quickly run out of memory (by default NodeJS heap peaks at ~1.7GB):
```
➜  ts-loader-leak git:(master) ✗ node index.js 1
webpack will run, process should run out of memory
after cleanup { heapMBs: 102 }
after cleanup { heapMBs: 418 }
after cleanup { heapMBs: 576 }
after cleanup { heapMBs: 692 }
after cleanup { heapMBs: 1352 }
after cleanup { heapMBs: 1717 }

<--- Last few GCs --->
ca[1687:0x102a79000]    35804 ms: Mark-sweep 2047.3 (2053.7) -> 2045.9 (2055.2) MB, 910.2 / 0.0 ms  (+ 206.7 ms in 43 steps since start of marking, biggest step 14.3 ms, walltime since start of marking 1136 ms) (average mu = 0.108, current mu = 0.017) alloc[1687:0x102a79000]    37286 ms: Mark-sweep 2047.1 (2055.2) -> 2046.0 (2053.4) MB, 1385.0 / 0.0 ms  (+ 86.1 ms in 17 steps since start of marking, biggest step 11.2 ms, walltime since start of marking 1482 ms) (average mu = 0.053, current mu = 0.007) alloc

<--- JS stacktrace --->
```


