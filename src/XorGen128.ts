export class XorGen128 {
  private x = 0;
  private y = 0;
  private z = 0;
  private w = 0;

  constructor(seed?: any) {
    let strSeed = "";
    if (seed == (seed | 0)) {
      this.x = seed;
    } else {
      strSeed += seed;
    }

    for (let i = 0, l = strSeed.length + 64; i < l; i++) {
      this.x ^= strSeed.charCodeAt(i) | 0;
      this.next();
    }
  }

  public next() {
    const t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    return (this.w ^= (this.w >>> 19) ^ t ^ (t >>> 8));
  }

  public prng() {
    return (this.next() >>> 0) / 0x100000000;
  }
}
