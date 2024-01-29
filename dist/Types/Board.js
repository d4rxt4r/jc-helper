var TileType;
(function (TileType) {
    TileType[TileType["EMPTY"] = 0] = "EMPTY";
    TileType[TileType["FILLED"] = 1] = "FILLED";
})(TileType || (TileType = {}));
const PatterType = {
    [TileType[TileType.EMPTY]]: `${TileType.EMPTY}`,
    [TileType[TileType.FILLED]]: `${TileType.FILLED}`
};
export { TileType, PatterType };
