enum Sides {
    top = 0,
    right = 1,
    bottom = 2,
    left = 3
}
class ChunkData {
    chunkHasBeenColapsed: boolean
    chunkTypeOptions: Array<ChunkTypeData>
    position: Position
    toEnd: number = 0;
    state: number = 0;
    Entities:Entity[]
    constructor(position: Position, chunkSet: ChunkTypeData[], entities:Entity[]) {
        this.chunkHasBeenColapsed = false;
        this.chunkTypeOptions = chunkSet;
        this.position = position;
        this.Entities = entities;
    }
}
const ChunkGrid: ChunkData[][] = [];
const VoidTypeTile = new ChunkTypeData([
    [15,15,15,15,15],
    [15,15,15,15,15],
    [15,15,15,15,15],
    [15,15,15,15,15],
    [15,15,15,15,15]
], 1 , 0, ChunkTypes.room)
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
const modifyNeighbouringTile = (chunkData: ChunkTypeData, checkSide: Sides, NeighbourTile: ChunkData) => {
    if (!NeighbourTile.chunkHasBeenColapsed) {
        let opositeSide = checkSide >= 2 ? checkSide - 2 : checkSide + 2;
        NeighbourTile.chunkTypeOptions = NeighbourTile.chunkTypeOptions.filter(option => option.getSide(opositeSide).every((tile: number, index:number) => {return tile === chunkData.getSide(checkSide)[index]}));
    }
}
const modifyByTile = (checkSide: Sides, NeighbourTile: ChunkData) => {
    switch (checkSide) {
        case 0:
            NeighbourTile.chunkTypeOptions = NeighbourTile.chunkTypeOptions.filter(option => option.imgData[ChunkSize.height - 1][2] === 14)
            break;
        case 1:
            NeighbourTile.chunkTypeOptions = NeighbourTile.chunkTypeOptions.filter(option => option.imgData[2][0] === 14)
            break;
        case 2:
            NeighbourTile.chunkTypeOptions = NeighbourTile.chunkTypeOptions.filter(option => option.imgData[0][2] === 14)
            break;
        case 3:
            NeighbourTile.chunkTypeOptions = NeighbourTile.chunkTypeOptions.filter(option => option.imgData[2][ChunkSize.width - 1] === 14)
            break;
        default:
            break;
    }
}
const createEntrophyGrid = (gridData: ChunkData[][]): ChunkData => {
    let minOptions: number = Infinity;
    let bestTile: ChunkData;
    for (let i = 0; i < gridData.length; i++) {
        for (let j = 0; j < gridData[i].length; j++) {
            if (!gridData[i][j].chunkHasBeenColapsed && gridData[i][j].chunkTypeOptions.length < minOptions) {
                minOptions = gridData[i][j].chunkTypeOptions.length
                bestTile = gridData[i][j]
            }
        }
    }
    return bestTile
}
const initializeChunkGrid = (gridData: ChunkData[][], chunkSet: ChunkTypeData[], dim: Size) => {
    for (let i = 0; i < dim.height; i++) {
        gridData.push([])
        for (let j = 0; j < dim.width; j++) {
            gridData[i][j] = new ChunkData({ y: i, x: j }, chunkSet, []);
        }
    }
}
const resetChunkGrid = (gridData: ChunkData[][], chunkSet: ChunkTypeData[], dim: Size) => {
    for (let i = 0; i < dim.height; i++) {
        for (let j = 0; j < dim.width; j++) {
            gridData[i][j].chunkHasBeenColapsed = false;
            gridData[i][j].chunkTypeOptions = chunkSet;
            gridData[i][j].Entities = [];
        }
    }
}
const weightedRandom = (chunkTypeOptions:ChunkTypeData[], generatedNum:number) => {
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
const generatePath = (grid:ChunkData[][]) => {
    let path: ChunkData[] = randomPath(grid[EntryPointPosition.y][EntryPointPosition.x], grid[ExitPointPosition.y][ExitPointPosition.x], grid);
    for (let i = 1; i < path.length; i++) {
        if (path[i].position.x - path[i - 1].position.x === 1) {
            modifyByTile(Sides.right, path[i])
            modifyByTile(Sides.left, path[i - 1])
        }
        if (path[i].position.y - path[i - 1].position.y === 1) {
            modifyByTile(Sides.bottom, path[i])
            modifyByTile(Sides.top, path[i - 1])
        }
        if (path[i].position.x - path[i - 1].position.x === -1) {
            modifyByTile(Sides.left, path[i])
            modifyByTile(Sides.right, path[i - 1])
        }
        if (path[i].position.y - path[i - 1].position.y === -1) {
            modifyByTile(Sides.top, path[i])
            modifyByTile(Sides.bottom, path[i - 1])
        }
    }
}
const generateDungeonLevelRooms = (gridData: ChunkData[][], dim: Size) => {
    const random = splitmix32((globalSeed) >>> 0)
    for (let index: number = 0; index < LevelDimensions.height * LevelDimensions.width; index++) {
        let probability: number = 0.01;
        let chosenTile = createEntrophyGrid(gridData);
        if (chosenTile.chunkTypeOptions.length === 0) {
            chosenTile.chunkTypeOptions = [VoidTypeTile];
        }
        else {
            chosenTile.chunkTypeOptions = [chosenTile.chunkTypeOptions[weightedRandom(chosenTile.chunkTypeOptions, random())]];
        }
        chosenTile.chunkHasBeenColapsed = true;
        for (let i = 0; i < ChunkSize.height; i++) {
            for (let j = 0; j < ChunkSize.width; j++) {
                if (chosenTile.chunkTypeOptions[0].imgData[i][j] === 14 && random() <= probability && chosenTile.chunkTypeOptions[0].chunkType !== 0) {
                    if (random() > 0.5) {
                        chosenTile.Entities.push(new Entity({ x: j, y: i }, Math.pickRandom([0, 1, 2, 3])))
                        if (probability > 0) {
                            probability = probability - 0.005
                        }
                    } else {
                        Enemies.push(new Creature({x: j + chosenTile.position.x * ChunkSize.width, y: i + chosenTile.position.y * ChunkSize.height}, 6))
                    }
                }
            }
        }
        let { x, y } = chosenTile.position;
        if (y != 0) modifyNeighbouringTile(chosenTile.chunkTypeOptions[0], Sides.top, gridData[y - 1][x]);
        if (y != dim.height - 1) modifyNeighbouringTile(chosenTile.chunkTypeOptions[0], Sides.bottom, gridData[y + 1][x]);
        if (x != 0) modifyNeighbouringTile(chosenTile.chunkTypeOptions[0], Sides.left, gridData[y][x - 1]);
        if (x != dim.width - 1) modifyNeighbouringTile(chosenTile.chunkTypeOptions[0], Sides.right, gridData[y][x + 1]);
    }
    gridData[EntryPointPosition.y][EntryPointPosition.x].Entities.push(new Entity({ x: 2, y: 2 }, 13))
    gridData[ExitPointPosition.y][ExitPointPosition.x].Entities.push(new Entity({x:2, y:2}, 12))
}

const modifyDungeonBorder = (gridData: ChunkData[][], voidType:ChunkTypeData, dim:Size) => {
    for (let j = 0; j < dim.width; j++) {
        modifyNeighbouringTile(voidType, 2 , gridData[0][j])  
    }
    for (let j = 0; j < dim.width; j++) {
        modifyNeighbouringTile(voidType, 0 , gridData[LevelDimensions.height - 1][j])  
    }
    for (let j = 0; j < dim.height; j++) {
        modifyNeighbouringTile(voidType, 1 , gridData[j][0])  
    }
    for (let j = 0; j < dim.height; j++) {
        modifyNeighbouringTile(voidType, 3 , gridData[j][LevelDimensions.width - 1])  
    }
}
const exitAndEntry = () => {
    if (EntryPointPosition.x < LevelDimensions.width * 0.5) {
        ExitPointPosition.x = EntryPointPosition.x + LevelDimensions.width * 0.5 + Math.floor(Math.random() * Math.abs(LevelDimensions.width * 0.5 - EntryPointPosition.x))
    } else {
        ExitPointPosition.x = EntryPointPosition.x - LevelDimensions.width * 0.5 - Math.floor(Math.random() * Math.abs(LevelDimensions.width * 0.5 - EntryPointPosition.x))
    }
    if (EntryPointPosition.y < LevelDimensions.height * 0.5) {
        ExitPointPosition.y = EntryPointPosition.y + LevelDimensions.height * 0.5 + Math.floor(Math.random() * Math.abs(LevelDimensions.height * 0.5 - EntryPointPosition.y))
    } else {
        ExitPointPosition.y = EntryPointPosition.y - LevelDimensions.height * 0.5 - Math.floor(Math.random() * Math.abs(LevelDimensions.height * 0.5 - EntryPointPosition.y))
    }
}