type TPatternSet = Array<TPattern>;
type TPattern = Array<number | null>;

interface ISize {
   rows: number;
   columns: number;
}

interface IRecord {
   size: ISize;
   data: {
      rows: TPatternSet;
      columns: TPatternSet;
   };
}

enum TileType {
   EMPTY,
   FILLED,
   CROSSED
}

const PatterType = {
   [TileType[TileType.EMPTY]]: `${TileType.EMPTY}`,
   [TileType[TileType.FILLED]]: `${TileType.FILLED}`,
   [TileType[TileType.CROSSED]]: `${TileType.CROSSED}`
};

export { IRecord, TPatternSet, TPattern, TileType, ISize };

type TTileSet = Array<TTilePattern>;
type TTilePattern = Array<TileType>;

export { PatterType, TTileSet, TTilePattern };

enum ModelType {
   MANUAL,
   AUTO
}

export { ModelType };
