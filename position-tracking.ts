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
const absoluteToChunks = (absolutePosition:Position):Position => {
    return {x: Math.floor(absolutePosition.x/ChunkSize.width), y: Math.floor(absolutePosition.y/ChunkSize.height)}
}
const absoluteToTiles = (absolutePosition:Position):Position => {
    return {x: absolutePosition.x - Math.floor(absolutePosition.x/ChunkSize.width)*ChunkSize.width, y: absolutePosition.y - Math.floor(absolutePosition.y/ChunkSize.height)*ChunkSize.height}
}