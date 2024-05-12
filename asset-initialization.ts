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
    let imageData: Number[];
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
            if (tileSet.getPixel(pixelPosition.x, pixelPosition.y) === 3) {
                recordingTile = false;
                pixelPosition.y = tileRecordingStart.y;
                
            }
            else if (tileSet.getPixel(pixelPosition.x, pixelPosition.y) === 4) {
                pixelPosition.x = tileRecordingStart.x;
                pixelPosition.y++;
            }
            else if (tileSet.getPixel(pixelPosition.x, pixelPosition.y) === 1) {
                recordingTile = false;
                pixelPosition.y++;
                pixelPosition.x = -1;  
            }
        }
        pixelPosition.x++
        if (pixelPosition.x > tileSet.width) {
            pixelPosition.x = 0;
            pixelPosition.y++;
        }
    }    
    
}

