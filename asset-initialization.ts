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
    

