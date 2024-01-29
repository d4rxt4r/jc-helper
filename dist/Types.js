var TileType;
(function (TileType) {
    TileType[TileType["EMPTY"] = 0] = "EMPTY";
    TileType[TileType["FILLED"] = 1] = "FILLED";
    TileType[TileType["CROSSED"] = 2] = "CROSSED";
})(TileType || (TileType = {}));
const PatterType = {
    [TileType[TileType.EMPTY]]: `${TileType.EMPTY}`,
    [TileType[TileType.FILLED]]: `${TileType.FILLED}`,
    [TileType[TileType.CROSSED]]: `${TileType.CROSSED}`
};
export { TileType };
export { PatterType };
var ModelType;
(function (ModelType) {
    ModelType[ModelType["MANUAL"] = 0] = "MANUAL";
    ModelType[ModelType["AUTO"] = 1] = "AUTO";
})(ModelType || (ModelType = {}));
export { ModelType };
