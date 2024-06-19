type ChunkTypeData = {
    readonly imgData: number[][]
    readonly weight: number
    readonly chunkID: number
    readonly chunkType: number;
}
enum ChunkTypes {
    hallway = 0,
    room = 1,
    broken = 2,
    special = 3
}
const getSide = (side: number, imgData:number[][]): number[] => {
    let tempData: number[] = [];
    switch (side) {
        case 0:
            return imgData[0];
        case 2:
            return imgData[imgData.length - 1];
        case 1:
        case 3:
            for (let i = 0; i < imgData.length; i++) {
                tempData.push(imgData[i][side === 1 ? imgData[i].length - 1 : 0]);
            }
            return tempData;
        default:
            return [];
    }
}
const sameChunkType = (imgDataOrigin:number[][], imgDataCompare:number[][]): boolean => {
    let result:boolean = true
    for (let index = 0; index < 4; index++) {
        if (!getSide(index, imgDataOrigin).every((tile: number, i: number) => { return tile === getSide(index, imgDataCompare)[i] })) {
            result = false
            break
        }
    }
    return result
}
const loadTileSet = (chunksetImg: Image, chunkset: ChunkTypeData[], weightofTile:number, type:number) => {
    let imageData: number[][] = [[]];
    let ID:number = chunkset.length === 0 ? 0 : chunkset[chunkset.length-1].chunkID
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
                    ID++
                    chunkset.push({imgData: imageData, weight: weightofTile,chunkID: ID,chunkType: type })
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
                    ID++
                    chunkset.push({imgData: imageData, weight: weightofTile,chunkID: ID,chunkType: type })
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
    ID++
    chunkset.push({imgData: imageData, weight: weightofTile,chunkID: ID,chunkType: type })
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
            chunkset.push({ imgData: JSON.parse(JSON.stringify(chunkImg)),weight: chunkset[i].weight,chunkID: chunkset[i].chunkID,chunkType: chunkset[i].chunkType });
        }
    }
    let orderedChunkSet: ChunkTypeData[] = [];
    chunkset.forEach((element: ChunkTypeData) => {
    if (!orderedChunkSet.some(orderedElement => 
        sameChunkType(orderedElement.imgData, element.imgData) && orderedElement.chunkID === element.chunkID
    )) {
        orderedChunkSet.push(element);
    }
});
    chunkset = orderedChunkSet;
    return chunkset
}
