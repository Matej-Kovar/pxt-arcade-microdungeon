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
    let tileRecordingStart: Position;
    let recordingTile: boolean = false;
    while (tileSet.getPixel(pixelPosition.x, pixelPosition.y) != 2) {
        if (!recordingTile) {
            if (tileSet.getPixel(pixelPosition.x, pixelPosition.y) === 3) {
                recordingTile = true;
                tileRecordingStart.x = pixelPosition.x;
                tileRecordingStart.y = pixelPosition.y;
                console.log("start of tile found");
                console.log(pixelPosition)
                
            }
        }
        else {
            if (tileSet.getPixel(pixelPosition.x, pixelPosition.y) === 3) {
                recordingTile = false;
                console.log("end of tile found at:");
                console.log(pixelPosition)
                pixelPosition.y = tileRecordingStart.y
                console.log("new coord: ");
                console.log(pixelPosition)
                
            }
            else if (tileSet.getPixel(pixelPosition.x, pixelPosition.y) === 4) {
                console.log("orange found at:");
                console.log(pixelPosition)
                pixelPosition.x = tileRecordingStart.x
                pixelPosition.y++;
                console.log("new coord: ");
                console.log(pixelPosition)
            }
        }
        pixelPosition.x++
        if (pixelPosition.x > tileSet.width) {
            pixelPosition.x = 0
            pixelPosition.y++;
        }
    }    
    
}
loadTileSet(assets.tile`hallway-tileSet`);