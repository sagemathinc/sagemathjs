import misc
import brython
import numbers
import pystone
import p1list
import nbody

from time import time
from bench import all

def run_all_benchmarks():
    t = time()
    all()
    print("="*20)
    print("Grand total time: ", int((time() - t) * 1000), "ms")


if __name__ == '__main__':
    run_all_benchmarks()