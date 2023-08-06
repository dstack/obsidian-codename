import { PRNG, SetReturn } from "./PRNG";

export class Wordlist {
  words: string[];
  private generator: PRNG;
  constructor(
    wordList: string[],
    seed?: string
  ) {
    seed = seed || PRNG.randString(16);
    this.generator = new PRNG(seed);
    this.words = wordList;
  }


  randomWord(set?: string[]):string {
    set = set || this.words;
    return this.generator.fromSet(set).item;
  }
  getAllBeginsWith(char: string): string[] {
    return this.words.filter(i => i.startsWith(char));
  }
  randomWordBeginsWith(char: string):string {
    let set = this.getAllBeginsWith(char);
    return this.randomWord(set);
  }
}
