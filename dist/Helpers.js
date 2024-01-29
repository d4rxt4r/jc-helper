import { TileType } from './Types.js';
function getEmptyRawDataArray(rows, cols) {
    return new Array(cols).fill(new Array(rows).fill(TileType.EMPTY));
}
function transposeRawData(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}
function mergeRawData(mat1, mat2) {
    return mat1.map((r, i) => r.map((v, j) => Number(!!(v + mat2[i][j]))));
}
function rawDataToPattern(rawData) {
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
function isEqualRawSet(p1, p2) {
    return p1.every((pattern, index) => {
        return pattern.join('-') === p2[index].join('-');
    });
}
const combinations = (sets) => {
    if (sets.length === 1) {
        return sets[0].map((el) => [el]);
    }
    else
        return sets[0].flatMap((val) => combinations(sets.slice(1)).map((c) => [val].concat(c)));
};
export { getEmptyRawDataArray, transposeRawData, mergeRawData, rawDataToPattern, isEqualRawSet, combinations };
