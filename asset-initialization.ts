class TileTypeData {
    readonly imgPath: Image
    readonly compatibleSides: string[]
    readonly tileTypeName: string
    readonly tileTypeId: number
    readonly imgData: number[][]

constructor(imagePath: Image, sidesType: string[], name: string, id: number,array:number[][]) {
    this.imgPath = imagePath;
    this.compatibleSides = sidesType;
    this.tileTypeName = name;
    this.tileTypeId = id;
    this.imgData = array;
}
}

const loadTileSet = (tileSetImg: Image) => {
    let imageData: number[][] = [[]];
    let pixelPosition: Position = { x: 0, y: 0 };
    let tileRecordingStart: Position = { x: 0, y: 0 };
    let tileSet: TileTypeData[] = [];
    let recordingTile: boolean = false;
    while (tileSetImg.getPixel(pixelPosition.x, pixelPosition.y) != 2) {
        if (!recordingTile) {
            if (tileSetImg.getPixel(pixelPosition.x, pixelPosition.y) === 3) {
                recordingTile = true;
                tileRecordingStart.x = pixelPosition.x;
                tileRecordingStart.y = pixelPosition.y;
            }
        }
        else {
            switch (tileSetImg.getPixel(pixelPosition.x, pixelPosition.y)) {
                case 3:
                    recordingTile = false;
                    pixelPosition.y = tileRecordingStart.y;
                    tileSet.push(new TileTypeData(myTiles.tile1, [], "test", 0, imageData))
                    imageData = [[]]
                    break;
                case 4:
                    pixelPosition.x = tileRecordingStart.x;
                    pixelPosition.y++;
                    imageData.push([]);
                    break;
                case 1:
                    recordingTile = false;
                    pixelPosition.y++;
                    pixelPosition.x = -1;
                    tileSet.push(new TileTypeData(myTiles.tile1, [], "test", 0, imageData))
                    imageData = [[]]
                    break;
                default:
                    imageData[pixelPosition.y - tileRecordingStart.y][pixelPosition.x - (tileRecordingStart.x + 1)] = tileSetImg.getPixel(pixelPosition.x, pixelPosition.y)
                    break;
            }
        }
        pixelPosition.x++
        if (pixelPosition.x > tileSetImg.width) {
            pixelPosition.x = 0;
            pixelPosition.y++;
        }
    }
    tileSet.push(new TileTypeData(myTiles.tile1, [], "test", 0, imageData))
    return tileSet
    
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
const createTileRotations = (tileSet: TileTypeData[]) => {
    let originalTileNum = tileSet.length;
    let tileImg: number[][];
    for (let i = 0; i < originalTileNum; i++) {
        tileImg = JSON.parse(JSON.stringify(tileSet[i].imgData));
        for (let j = 0; j < 3; j++) {
            rotateMatrix(tileImg);
            tileSet.push(new TileTypeData(myTiles.tile1, [], "test", 0, JSON.parse(JSON.stringify(tileImg))));
        }
    }
    let orderedTileSet: TileTypeData[] = [];
tileSet.forEach((element: TileTypeData) => {
    if (!orderedTileSet.some(orderedElement => 
        element.imgData.every((row, i) => JSON.stringify(row) === JSON.stringify(orderedElement.imgData[i]))
    )) {
        orderedTileSet.push(element);
    }
});
    tileSet = orderedTileSet;
    return tileSet
}

let testingTileSet: TileTypeData[] = loadTileSet(assets.image`tileSet-hallway`)
testingTileSet = createTileRotations(testingTileSet)
console.log(testingTileSet.length)