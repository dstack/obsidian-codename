import { XorGen128 } from "./XorGen128";

const possibleChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export interface SetReturn {
  index: number;
  item: any;
}

export interface ChanceReturn {
  roll: number;
  success: boolean;
  passChance: number;
  failChance: number;
}

export class PRNG {
  private seed: any;
  private gen: XorGen128;

  constructor(seed?: any) {
    this.seed = seed || PRNG.randString(32);
    this.gen = new XorGen128(this.seed);
  }

  public static randString(len = 8): string {
    let str = "";
    for (let i = 0; i < len; i++) {
      str += possibleChars.charAt(
        Math.floor(Math.random() * possibleChars.length)
      );
    }
    return str;
  }

  public int(max = 1000): number {
    return Math.floor(this.gen.prng() * max);
  }

  public fromSet(set: any[]): SetReturn {
    const rindex = this.int(set.length);
    const res: SetReturn = {
      index: rindex,
      item: set[rindex],
    };
    return res;
  }

  public range(min = 0, max = 1000): number {
    return Math.floor(this.gen.prng() * (max - min + 1)) + min;
  }

  public chance(pctToPass = 50): ChanceReturn {
    const target = 100 - pctToPass;
    const passRoll = this.gen.prng() * 101; // high precision pass roll
    return {
      roll: passRoll,
      success: passRoll >= target,
      passChance: pctToPass,
      failChance: target,
    };
  }
}
