class Entity {
    relativePosition: Position;
    imgData: Image;
    constructor(img: Image, position: Position) {
        this.relativePosition = position
        this.imgData = img
    }
}
