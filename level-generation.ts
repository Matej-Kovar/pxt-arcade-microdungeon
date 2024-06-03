type Size = {
    width: number,
    height: number
}
type Player = {
    inChunkPosition: Position
    inWorldPosition: Position
}
type Position = {
    x: number
    y: number
}
enum Sides {
    top = 0,
    right = 1,
    bottom = 2,
    left = 3
}
class ChunkData {
    chunkHasBeenColapsed: boolean
    chunkTypeOptions: Array<ChunkTypeData>
    chunkPositon: Position
    ChunkIndex: number
    constructor(position: Position, index: number, chunkSet: ChunkTypeData[]) {
        this.chunkHasBeenColapsed = false;
        this.chunkTypeOptions = chunkSet;
        this.chunkPositon = position;
        this.ChunkIndex = index;
    }
}

const ChunkGrid: ChunkData[] = [];
const VoidTypeTile = new ChunkTypeData([
    [15,15,15,15,15],
    [15,15,15,15,15],
    [15,15,15,15,15],
    [15,15,15,15,15],
    [15,15,15,15,15]
], 1)
function splitmix32(a:number) {
    return function () {
        a |= 0;
        a = a + 0x9e3779b9 | 0;
        let t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
}
function modifyNeighbouringTile(chunkData: ChunkTypeData, checkSide: Sides, NeighbourTile: ChunkData) {
    if (!NeighbourTile.chunkHasBeenColapsed) {
        let opositeSide = checkSide >= 2 ? checkSide - 2 : checkSide + 2;
        NeighbourTile.chunkTypeOptions = NeighbourTile.chunkTypeOptions.filter(option => option.getSide(opositeSide) === chunkData.getSide(checkSide));
    }
}
function createEntrophyGrid(gridData: ChunkData[]): ChunkData {
    let minOptions: number = Infinity;
    let bestTile: ChunkData;
    gridData.forEach((chunk) => {
        if (!chunk.chunkHasBeenColapsed && chunk.chunkTypeOptions.length < minOptions) {
            minOptions = chunk.chunkTypeOptions.length
            bestTile = chunk
        }
    })
    return bestTile
}
function initializeChunkGrid(gridData: ChunkData[], chunkSet: ChunkTypeData[], dim: Size) {
    for (let i = 0; i < dim.width * dim.height; i++) {
        gridData[i] = new ChunkData({ y: Math.floor(i / dim.width), x: i % dim.width }, i, chunkSet);
    }
}
function resetChunkGrid(gridData: ChunkData[], chunkSet: ChunkTypeData[], dim: Size) {
    for (let i = 0; i < dim.width * dim.height; i++) {
         gridData[i].chunkHasBeenColapsed = false;
        gridData[i].chunkTypeOptions = chunkSet;
}
}
function weightedRandom(chunkTypeOptions:ChunkTypeData[], generatedNum:number) {
    let cumulativeWeights: number[] = [];
    for (let i = 0; i < chunkTypeOptions.length; i += 1) {
        cumulativeWeights[i] = chunkTypeOptions[i].weight + (cumulativeWeights[i - 1]||0);
    }
    let randomNumber = cumulativeWeights[cumulativeWeights.length - 1] * generatedNum;
    for (let index = 0; index < chunkTypeOptions.length; index ++) {
        if (cumulativeWeights[index] >= randomNumber) {
            randomNumber = index
            break
        }
    }
    return randomNumber
}
function generateDungeonLevelRooms(gridData: ChunkData[], dim: Size) {
    const random = splitmix32((globalSeed) >>> 0)
    for (let index: number = 0; index < gridData.length; index++) {
        let chosenTile = createEntrophyGrid(gridData);
        if (chosenTile.chunkTypeOptions.length === 0) {
            chosenTile.chunkTypeOptions = [VoidTypeTile];
        }
        else {
            chosenTile.chunkTypeOptions = [chosenTile.chunkTypeOptions[weightedRandom(chosenTile.chunkTypeOptions, random())]];
        }
        chosenTile.chunkHasBeenColapsed = true;
            let { x, y } = chosenTile.chunkPositon;
            let chosenIndex = chosenTile.ChunkIndex;
            if (y != 0) modifyNeighbouringTile(chosenTile.chunkTypeOptions[0], Sides.top, gridData[chosenIndex - dim.width]);
            if (y != dim.height - 1) modifyNeighbouringTile(chosenTile.chunkTypeOptions[0], Sides.bottom, gridData[chosenIndex + dim.width]);
            if (x != 0) modifyNeighbouringTile(chosenTile.chunkTypeOptions[0], Sides.left, gridData[chosenIndex - 1]);
            if (x != dim.width - 1) modifyNeighbouringTile(chosenTile.chunkTypeOptions[0], Sides.right, gridData[chosenIndex + 1]);
    }
}
const modifyDungeonBorder = (gridData: ChunkData[], voidType:ChunkTypeData ,dim:Size) => {
    for (let j = 0; j < dim.width; j++) {
        modifyNeighbouringTile(voidType, 2 , gridData[j])  
    }
    for (let j = 0; j < dim.width; j++) {
        modifyNeighbouringTile(voidType, 0 , gridData[gridData.length - j - 1])  
    }
    for (let j = 0; j < dim.height; j++) {
        modifyNeighbouringTile(voidType, 1 , gridData[(dim.width) * j])  
    }
    for (let j = 0; j < dim.height; j++) {
        modifyNeighbouringTile(voidType, 3 , gridData[(dim.width) * j + dim.width-1])  
    }
}