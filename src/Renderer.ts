import { IRecord, TPattern, TileType, ISize, TTileSet, TTilePattern, TPatternSet } from './Types.js';
import { isEqualRawSet, mergeRawData, rawDataToPattern, transposeRawData } from './Helpers.js';

interface IState {
   value: number;
   maxValue: number;
}

class Solver {
   private _combinationsData: TPatternSet[];

   constructor(rows: TPatternSet, rowsLength: number) {
      this._generateCombinationsData(rows, rowsLength);
   }

   private _computeBaseArrangement(pattern: TPattern, length: number): TTilePattern {
      const result = new Array(length).fill(TileType.EMPTY);

      pattern.map((repeats: number) => {
         const tailIndex = result.lastIndexOf(TileType.FILLED) + 1;
         const start = tailIndex + Number(!!tailIndex);
         if (start >= result.length) {
            return;
         }
         result.fill(TileType.FILLED, start, start + repeats);
      });

      return result;
   }

   private _computeCombinations(
      baseArrangement: TTilePattern,
      pattern: TPattern,
      length: number,
      includeBaseArrangement: boolean = false
   ): TTileSet {
      if (!pattern.length) {
         return [new Array(length).fill(TileType.EMPTY)];
      }

      const result = [];

      // xx.xxx....
      let lastCombination = baseArrangement.slice(0);
      // xx.xxx....
      //          ^
      let sliceEnd = lastCombination.length;

      if (includeBaseArrangement) {
         result.push(baseArrangement);
      }

      if (baseArrangement[baseArrangement.length - 1] === TileType.FILLED) {
         return result;
      }

      pattern.reverse().forEach((repeats, repIndex) => {
         // xx.xxx....
         //    ^
         const sliceStart = lastCombination.slice(0, sliceEnd).lastIndexOf(TileType.FILLED) - (repeats - 1);
         // xx.xxx....
         //    [     ]
         const sliceLength = sliceEnd - sliceStart;
         // xx.xxx....
         //   [xxx....]
         let slice = lastCombination.slice(0).splice(sliceStart, sliceLength);

         if (sliceLength - repeats === 0) {
            result.push(lastCombination.slice(0));
         } else {
            for (let i = 0; i < sliceLength - repeats; i++) {
               // [xxx....]
               //  ^ <-- ^
               // [.xxx...]
               slice.unshift(slice.pop());
               //    xx.xxx....
               // +
               //      [.xxx...]
               // =  xx..xxx...
               lastCombination.splice(sliceStart, slice.length, ...slice);
               result.push(lastCombination.slice(0));

               // xx..xxx...
               //   ^^
               if (sliceStart && lastCombination[sliceStart] === TileType.EMPTY && slice[0] === TileType.EMPTY) {
                  // [2, 3]
                  // [ ]
                  const patternLength = pattern.length - 1 - repIndex;
                  // [2, 3]
                  // [2]
                  const subPattern = pattern.slice(0, patternLength);
                  //  xx..xxx...
                  // [xx..]
                  const subPatternSlice = lastCombination.slice(
                     0,
                     lastCombination.lastIndexOf(TileType.FILLED) - repeats
                  );
                  const subBaseArrangement = this._computeBaseArrangement(subPattern, subPatternSlice.length);
                  // [xx..]
                  // [.xx.]
                  // [..xx]
                  const subCombinationSet = this._computeCombinations(subBaseArrangement, subPattern, subPatternSlice.length);
                  subCombinationSet.map((tilePattern) => {
                     // xx..xxx...
                     const subCombination = lastCombination.slice(0);
                     //     xx..xxx...
                     // +
                     //    [.xx.]
                     // =   .xx.xxx...
                     subCombination.splice(0, tilePattern.length, ...tilePattern)
                     result.push(subCombination);
                  });
               }
            }
            // ...
            // xx.....xxx
         }
         // xx.....xxx
         //       ^
         sliceEnd = sliceEnd - (repeats + 1);
      });

      if (!result.length) {
         return [new Array(length).fill(TileType.EMPTY)];
      }

      return result;
   }

   private _generateCombinationsData(rows: TPatternSet, rowsLength: number): void {
      const combinationsData: TPatternSet[] = new Array();
      rows.map((row) => {
         if (!row.length) {
            return;
         }
         const baseArrangement = this._computeBaseArrangement(row, rowsLength);
         combinationsData.push(this._computeCombinations(baseArrangement, row, rowsLength, true));
      });

      this._combinationsData = combinationsData;
   }

   getData() {
      return this._combinationsData;
   }
}

class RenderState {
   private _state: IState[];
   private _counterPointer: number;

   constructor(combinationsData: TPatternSet[]) {
      this._state = new Array(combinationsData.length);
      combinationsData.forEach((combinationSet, index) => {
         this._state[index] = {
            value: 0,
            maxValue: combinationSet.length - 1
         };
      });
      this._counterPointer = 0;
   }

   increment(): void {
      this._state.every((state, index) => {
         if (state.value < state.maxValue) {
            state.value += 1;

            if (state.value === state.maxValue && this._counterPointer !== index) {
               this._counterPointer = index;
            }

            return false;
         } else {
            this._counterPointer = index + 1;
            if (index !== this._counterPointer) {
               state.value = 0;
            }
         }

         return true;
      });
   }

   getState(): number[] {
      return this._state.map((stateData) => stateData.value);
   }
}

class Renderer {
   private _record: IRecord;
   private _state: RenderState;
   private _solver: Solver;

   constructor(data: IRecord) {
      this._record = data;
      this._solver = new Solver(this._record.data.rows, this._record.size.rows);
      this._state = new RenderState(this._solver.getData());
   }

   validateModel(): boolean {
      const model = this.getModel();
      const tModel = transposeRawData(model);
      const testPatternSet = rawDataToPattern(tModel);
      const colPatternSet = this._record.data.columns;

      return isEqualRawSet(testPatternSet, colPatternSet);
   }

   getModel(): TTileSet {
      return this._solver
         .getData()
         .map((combinationsSet, combinationIndex) => combinationsSet[this._state.getState()[combinationIndex]]);
   }

   nextStep() {
      this._state.increment();
   }

   getSize(): ISize {
      return {
         rows: this._record.size.rows,
         columns: this._record.size.columns
      };
   }
}

export default Renderer;

// private _mergeCombinations(combinations: TTileSet, baseArrangement: TTilePattern) {
//    return combinations.reduce((acc, combination) => {
//       return acc.map((val, ind) => {
//          return val && combination[ind];
//       });
//    }, baseArrangement.slice(0));
// }

// getRenderModel(): TTileSet {
//    const rows = this._record.size.rows;
//    const cols = this._record.size.columns;

//    const rowMat = new Array();
//    const colMat = new Array();

//    this._record.data.rows.map((row) => {
//       if (!row.length) {
//          return;
//       }

//       const baseArrangement = this._computeBaseArrangement(row, rows);
//       rowMat.push(this._mergeCombinations(this._computeCombinations(baseArrangement, row, rows), baseArrangement));
//    });

//    this._record.data.columns.map((column) => {
//       if (!column.length) {
//          return;
//       }

//       const baseArrangement = this._computeBaseArrangement(column, cols);
//       colMat.push(
//          this._mergeCombinations(this._computeCombinations(baseArrangement, column, cols), baseArrangement)
//       );
//    });

//    const result = mergeRawData(rowMat, transposeRawData(colMat));

//    return result;
// }
