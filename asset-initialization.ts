class TileTypeData {
    readonly imgPath: Image
    readonly compatibleSides: string[]
    readonly tileTypeName: string
    readonly tileTypeId: number

    constructor(imagePath: Image, sidesType: string[], name: string, id: number) {
        this.imgPath = imagePath;
        this.compatibleSides = sidesType;
        this.tileTypeName = name;
        this.tileTypeId = id;
    }
}

function loadTileSet(tileSet: Image) {
    let imageData: Number[][];
    let pixelPosition: Position = { x: 0, y: 0 };
    let tileRecordingStart: Position = { x: 0, y: 0 };
    let recordingTile: boolean = false;
    while (tileSet.getPixel(pixelPosition.x, pixelPosition.y) != 2) {
        if (!recordingTile) {
            if (tileSet.getPixel(pixelPosition.x, pixelPosition.y) === 3) {
                recordingTile = true;
                tileRecordingStart.x = pixelPosition.x;
                tileRecordingStart.y = pixelPosition.y;   
            }
        }
        else {
            switch (tileSet.getPixel(pixelPosition.x, pixelPosition.y)) {
                case 3:
                    recordingTile = false;
                    pixelPosition.y = tileRecordingStart.y;
                    break;
                case 4:
                    pixelPosition.x = tileRecordingStart.x;
                    pixelPosition.y++;;
                    break;
                case 1:
                    recordingTile = false;
                    pixelPosition.y++;
                    pixelPosition.x = -1;  
                    break;
                default:
                    imageData[pixelPosition.y-tileRecordingStart.y][pixelPosition.x-(tileRecordingStart.y+1)] = tileSet.getPixel(pixelPosition.x, pixelPosition.y)
                    console.log(imageData)
                    break;
            }
        }
        pixelPosition.x++
        if (pixelPosition.x > tileSet.width) {
            pixelPosition.x = 0;
            pixelPosition.y++;
        }
    }    
    
}
loadTileSet(assets.image`tileSet-hallway`)
