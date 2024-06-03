class ChunkTypeData {
    readonly imgData: number[][]
    readonly weight:number

    constructor(array:number[][], number:number) {
        this.imgData = array;
        this.weight = number;
    }
    getSide(side: number): string {
        let tempData: number[] = [];
        switch (side) {
            case 0:
                return JSON.stringify(this.imgData[0]);
            case 2:
                return JSON.stringify(this.imgData[this.imgData.length - 1]);
            case 1:
            case 3:
                for (let i = 0; i < this.imgData.length; i++) {
                    tempData.push(this.imgData[i][side === 1 ? this.imgData[i].length - 1 : 0]);
                }
                return JSON.stringify(tempData);
            default:
                return "";
        }
    }
    colisionWillHappen(player:Player, direction:number):Boolean {
        switch (direction) {
            case 0:
                if (this.imgData[player.inChunkPosition.y - 1][player.inChunkPosition.x] === 15) {
                    return true;
                } else {
                    return false
                }
                break;
            case 1:
                if (this.imgData[player.inChunkPosition.y][player.inChunkPosition.x + 1] === 15) {
                    return true;
                } else {
                    return false
                }
                break;
            case 2:
                if (this.imgData[player.inChunkPosition.y + 1][player.inChunkPosition.x] === 15) {
                    return true;
                } else {
                    return false
                }
                break;
            case 3:
                if (this.imgData[player.inChunkPosition.x - 1][player.inChunkPosition.x] === 15) {
                    return true;
                } else {
                    return false
                }
                    break;
            default:
                return false;
                break;
        }
    }
}

const loadTileSet = (chunksetImg: Image, chunkset: ChunkTypeData[], weight:number) => {
    let imageData: number[][] = [[]];
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
                    chunkset.push(new ChunkTypeData(imageData, weight))
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
                    chunkset.push(new ChunkTypeData(imageData, weight))
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
    chunkset.push(new ChunkTypeData(imageData, weight))
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
            chunkset.push(new ChunkTypeData(JSON.parse(JSON.stringify(chunkImg)), chunkset[i].weight));
        }
    }
    let orderedChunkSet: ChunkTypeData[] = [];
    chunkset.forEach((element: ChunkTypeData) => {
    if (!orderedChunkSet.some(orderedElement => 
        element.imgData.every((row, i) => JSON.stringify(row) === JSON.stringify(orderedElement.imgData[i]))
    )) {
        orderedChunkSet.push(element);
    }
});
    chunkset = orderedChunkSet;
    return chunkset
}
tilemap
let testingTileSet: ChunkTypeData[] = [];
loadTileSet(assets.image`chunkset-main`, testingTileSet, 10)
loadTileSet(assets.image`chunkset-broken`, testingTileSet, 1)
testingTileSet = createTileRotations(testingTileSet)
