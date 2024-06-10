class ChunkTypeData {
    readonly imgData: number[][]
    readonly weight: number
    readonly chunkID: number
    readonly chunkType: number;
    constructor(array: number[][], number: number, id:number, chunktype:number) {
        this.imgData = array;
        this.weight = number;
        this.chunkID = id;
        this.chunkType = chunktype
    }
    getSide(side: number): number[]{
        let tempData: number[] = [];
        switch (side) {
            case 0:
                return this.imgData[0];
            case 2:
                return this.imgData[this.imgData.length - 1];
            case 1:
            case 3:
                for (let i = 0; i < this.imgData.length; i++) {
                    tempData.push(this.imgData[i][side === 1 ? this.imgData[i].length - 1 : 0]);
                }
                return tempData;
            default:
                return [];
        }
    }
    sameChunkType(chunkType: ChunkTypeData): boolean {
        let result:boolean = true
        for (let index = 0; index < 4; index++) {
            if (!this.getSide(index).every((tile: number, i: number) => { return tile === chunkType.getSide(index)[i] })) {
                result = false
                break
            }
        }
        return result
    }
}
enum ChunkTypes {
    hallway = 0,
    room = 1,
    broken = 2,
    special = 3
}
const loadTileSet = (chunksetImg: Image, chunkset: ChunkTypeData[], weight:number, type:number) => {
    let imageData: number[][] = [[]];
    let chunkID:number = chunkset.length === 0 ? 0 : chunkset[chunkset.length-1].chunkID
    let pixelPosition: Position = { x: 0, y: 0 };
    let chunkRecordingStart: Position = { x: 0, y: 0 };
    let recordingTile: boolean = false;
    while (chunksetImg.getPixel(pixelPosition.x, pixelPosition.y) != 2) {
        if (!recordingTile) {
            if (chunksetImg.getPixel(pixelPosition.x, pixelPosition.y) === 3) {
                recordingTile = true;
                chunkRecordingStart.x = pixelPosition.x;
                chunkRecordingStart.y = pixelPosition.y;
            }
        }
        else {
            switch (chunksetImg.getPixel(pixelPosition.x, pixelPosition.y)) {
                case 3:
                    recordingTile = false;
                    pixelPosition.y = chunkRecordingStart.y;
                    chunkID++
                    chunkset.push(new ChunkTypeData(imageData, weight, chunkID, type))
                    imageData = [[]]
                    break;
                case 4:
                    pixelPosition.x = chunkRecordingStart.x;
                    pixelPosition.y++;
                    imageData.push([]);
                    break;
                case 1:
                    recordingTile = false;
                    pixelPosition.y++;
                    pixelPosition.x = -1;
                    chunkID++
                    chunkset.push(new ChunkTypeData(imageData, weight, chunkID, type))
                    imageData = [[]]
                    break;
                default:
                    imageData[pixelPosition.y - chunkRecordingStart.y][pixelPosition.x - (chunkRecordingStart.x + 1)] = chunksetImg.getPixel(pixelPosition.x, pixelPosition.y)
                    break;
            }
        }
        pixelPosition.x++
        if (pixelPosition.x > chunksetImg.width) {
            pixelPosition.x = 0;
            pixelPosition.y++;
        }
    }
    chunkID++
    chunkset.push(new ChunkTypeData(imageData, weight, chunkID,type))
}
const rotateMatrix = (matrix: number[][]) => {
    let width = matrix.length;
    for (let i = 0; i < width / 2; i++) {
        for (let j = i; j < width - i - 1; j++) {
            let tmp = matrix[i][j];
            matrix[i][j] = matrix[width - j - 1][i];
            matrix[width - j - 1][i] = matrix[width - i - 1][width - j - 1];
            matrix[width - i - 1][width - j - 1] = matrix[j][width - i - 1];
            matrix[j][width - i - 1] = tmp;
        }
    }
    return matrix;
}
const createTileRotations = (chunkset: ChunkTypeData[]) => {
    let originalTileNum = chunkset.length;
    let chunkImg: number[][];
    for (let i = 0; i < originalTileNum; i++) {
        chunkImg = JSON.parse(JSON.stringify(chunkset[i].imgData));
        for (let j = 0; j < 3; j++) {
            rotateMatrix(chunkImg);
            chunkset.push(new ChunkTypeData(JSON.parse(JSON.stringify(chunkImg)), chunkset[i].weight, chunkset[i].chunkID, chunkset[i].chunkType));
        }
    }
    let orderedChunkSet: ChunkTypeData[] = [];
    chunkset.forEach((element: ChunkTypeData) => {
    if (!orderedChunkSet.some(orderedElement => 
        orderedElement.sameChunkType(element) && orderedElement.chunkID === element.chunkID
    )) {
        orderedChunkSet.push(element);
    }
});
    chunkset = orderedChunkSet;
    return chunkset
}
tilemap
let testingTileSet: ChunkTypeData[] = [];
loadTileSet(assets.image`chunkset-room`, testingTileSet, 10, ChunkTypes.room)
loadTileSet(assets.image`chunkset-hallway`, testingTileSet, 10, ChunkTypes.hallway)
loadTileSet(assets.image`chunkset-broken`, testingTileSet, 1, ChunkTypes.broken)
testingTileSet = createTileRotations(testingTileSet)
const ExitPoint: ChunkTypeData[] = []
const EntryPoint: ChunkTypeData[] = []
loadTileSet(assets.image`exit-point-chunk`, ExitPoint, 1, ChunkTypes.special)
loadTileSet(assets.image`entry-point-chunk`, EntryPoint, 1, ChunkTypes.special)
