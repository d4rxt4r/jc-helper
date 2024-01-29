import { TPatternSet, TileType, TTileSet } from './Types.js';

function getEmptyRawDataArray(rows: number, cols: number): TPatternSet {
   return new Array(cols).fill(new Array(rows).fill(TileType.EMPTY));
}

function transposeRawData(matrix: TPatternSet): TPatternSet {
   return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

function mergeRawData(mat1: TPatternSet, mat2: TPatternSet): TPatternSet {
   return mat1.map((r, i) => r.map((v, j) => Number(!!(v + mat2[i][j]))));
}

function rawDataToPattern(rawData: TTileSet): TPatternSet {
   let valueCounter = 0;
   return rawData.map((row) => {
      const result = [];
      for (let i = 0; i < row.length; i++) {
         if (row[i] === TileType.FILLED) {
            valueCounter += 1;
         }

         if ((i === row.length - 1 || row[i] === TileType.EMPTY) && valueCounter) {
            result.push(valueCounter);
            valueCounter = 0;
         }
      }

      return result;
   });
}

function isEqualRawSet(p1: TPatternSet, p2: TPatternSet): boolean {
   return p1.every((pattern, index) => {
      return pattern.join('-') === p2[index].join('-');
   });
}

const combinations = <T>(sets: T[][]): T[][] => {
   if (sets.length === 1) {
      return sets[0].map((el) => [el]);
   } else return sets[0].flatMap((val) => combinations(sets.slice(1)).map((c): T[] => [val].concat(c)));
};

export { getEmptyRawDataArray, transposeRawData, mergeRawData, rawDataToPattern, isEqualRawSet, combinations };
