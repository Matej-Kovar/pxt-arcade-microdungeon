type Size = {
    width: number,
    height: number
}
type Position = {
    x: number
    y: number
}
const absolutePosition = (chunkPositon: Position, tilePosition: Position, offset: Position): Position => {
    return { x: chunkPositon.x * ChunkSize.width + tilePosition.x + offset.x, y: chunkPositon.y * ChunkSize.height + tilePosition.y + offset.y }
}