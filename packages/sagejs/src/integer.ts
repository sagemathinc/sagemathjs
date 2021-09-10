/*
Import as follows using a very recent version of node.js (at least 16.6?):

You must call init once before using functions, or nothing will work.
*/

import { importWasm, stringToU8 } from "./interface";

interface Memory {
  buffer: Int8Array;
}

let wasm: any = undefined;
export async function init(): Promise<void> {
  if (wasm != null) {
    return;
  }
  wasm = await importWasm("integer");
  // Initialize GMP custom allocator:
  (wasm.initCustomAllocator as CallableFunction)();
}

class IntegerClass {
  i: number;

  constructor(n: number | string | null, i?: number) {
    if (n === null && i !== undefined) {
      this.i = i;
      return;
    }
    if (typeof n == "number") {
      this.i = (wasm.createIntegerInt as CallableFunction)(n);
      return;
    }
    this.i = (wasm.createIntegerStr as CallableFunction)(
      stringToU8(`${n}`, (wasm.memory as Memory).buffer)
    );
  }

  print() {
    (wasm.printInteger as CallableFunction)(this.i);
  }

  nextPrime() {
    return new IntegerClass(null, (wasm.nextPrime as CallableFunction)(this.i));
  }

  isPseudoPrime() {
    return (wasm.wrappedIsPseudoPrime as CallableFunction)(this.i);
  }

  toString() {
    this.print();
    return ""; // since we don't have sending strings yet!
  }
}

export function isPseudoPrime(n: number | string): 0 | 1 | 2 {
  if (typeof n == "string") {
    return (wasm.isPseudoPrime as CallableFunction)(
      stringToU8(`${n}`, (wasm.memory as Memory).buffer)
    );
  } else {
    return (wasm.isPseudoPrimeInt as CallableFunction)(n);
  }
}

export const Integer = (x) => new IntegerClass(x);