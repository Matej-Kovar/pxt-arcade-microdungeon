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

function loadTileSet(tileSetImg: Image) {
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
                    imageData.splice(0, imageData.length);
                    imageData = [[]]
                    break;
                case 4:
                    console.log("orange detected at: ")
                    console.log(pixelPosition)
                    pixelPosition.x = tileRecordingStart.x;
                    pixelPosition.y++;
                    imageData.push([]);
                    break;
                case 1:
                    recordingTile = false;
                    pixelPosition.y++;
                    pixelPosition.x = -1;
                    tileSet.push(new TileTypeData(myTiles.tile1, [], "test", 0, imageData))
                    imageData.splice(0, imageData.length);
                    imageData = [[]]
                    break;
                default:
                    imageData[pixelPosition.y - tileRecordingStart.y][pixelPosition.x - (tileRecordingStart.x + 1)] = tileSetImg.getPixel(pixelPosition.x, pixelPosition.x)
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

let testingTileSet:TileTypeData[] = (loadTileSet(assets.image`tileSet-hallway`))
