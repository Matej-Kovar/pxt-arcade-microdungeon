enum TileStates {
    noSet = 0,
    openSet = 1,
    closedSet = 2
}
const getNeighbors = (position:Position, gridData:any[][]) => {
    const Neighbors: any[] = []
    if (position.y != 0) Neighbors.push(gridData[position.y - 1][position.x]);
    if (position.y != gridData.length - 1) Neighbors.push(gridData[position.y + 1][position.x]);
    if (position.x != 0) Neighbors.push(gridData[position.y][position.x - 1]);
    if (position.x != gridData[0].length - 1) Neighbors.push(gridData[position.y][position.x + 1]);
    return Neighbors
}
const getNeighborsDiagonal = (element: TileData, gridData:TileData[][]) => {
    const Neighbors: TileData[] = []
    if (element.position.x != RenderDistance.width - 1 && element.position.y != 0) Neighbors.push(gridData[element.position.y - 1][element.position.x + 1]);
    if (element.position.x != RenderDistance.width - 1 && element.position.y != RenderDistance.height - 1) Neighbors.push(gridData[element.position.y + 1][element.position.x + 1]);
    if (element.position.x != 0 && element.position.y != 0) Neighbors.push(gridData[element.position.y - 1][element.position.x - 1]);
    if (element.position.x != 0 && element.position.y != RenderDistance.height - 1) Neighbors.push(gridData[element.position.y + 1][element.position.x - 1]);
    return Neighbors
}
const getDistanceToEnd = (thisTile: any, end:any) => {
    return Math.sqrt((end.position.x - thisTile.position.x) ** 2) + Math.sqrt((end.position.y - thisTile.position.y) ** 2)
}
const findPath = (Start: TileData, End: TileData, grid: TileData[][]) => {
    for (let i = 0; i < RenderDistance.height; i++) {
        for (let j = 0; j < RenderDistance.width; j++) {
            grid[i][j].toEnd = getDistanceToEnd(grid[i][j], End)
            grid[i][j].cameFrom = undefined
            grid[i][j].costToTravel = Infinity
            grid[i][j].state = 0
            grid[i][j].value = 0
        }
    }
    Start.costToTravel = 0
    const TilesToDo: TileData[] = []
    const TilesFinished: TileData[] = []
    let PathToEnd:Position[] = []
    TilesToDo.push(Start)
    Start.state = TileStates.noSet
    while (TilesToDo.length > 0) {
        let lowestFIndex = 0
        for (let i = 0; i < TilesToDo.length; i++) {
            if (TilesToDo[i].value < TilesToDo[lowestFIndex].value) {
                lowestFIndex = i
            }
        }
    
        const CurrentTile: TileData = TilesToDo[lowestFIndex];
        TilesToDo.splice(lowestFIndex, 1)
        TilesFinished.push(CurrentTile)
        CurrentTile.state = TileStates.closedSet
        let  Neighbors = getNeighbors(CurrentTile.position, grid)
        Neighbors = Neighbors.concat(getNeighborsDiagonal(CurrentTile, grid))
        for (let i = 0; i < Neighbors.length; i++) {
            const CurrentNeigbor = Neighbors[i]
            let tempG = CurrentTile.costToTravel + 1
            if (CurrentNeigbor.state !== TileStates.closedSet && CurrentNeigbor.sprite.kind() !== SpriteKind.Wall) {
                if (CurrentNeigbor.state === TileStates.openSet) {
                    if (tempG < CurrentNeigbor.costToTravel) {
                        CurrentNeigbor.costToTravel = tempG
                    }
                } else {
                    CurrentNeigbor.costToTravel = tempG
                    TilesToDo.push(CurrentNeigbor)
                    CurrentNeigbor.state = TileStates.openSet
                }
                CurrentNeigbor.value = CurrentNeigbor.toEnd + CurrentNeigbor.costToTravel
                if (CurrentNeigbor.costToTravel === tempG) {
                    CurrentNeigbor.cameFrom = CurrentTile
                }

            }
        }
        if (CurrentTile.position.x === End.position.x && CurrentTile.position.y === End.position.y) {
            break
        }
    }
    let pathStep = End
    while (pathStep.cameFrom !== undefined) {
        PathToEnd.push({ x: pathStep.position.x + startingPoint.x, y: pathStep.position.y + startingPoint.y })
        pathStep = pathStep.cameFrom
    }
    return PathToEnd
}
const randomPath = (Start: ChunkData, End: ChunkData, grid: ChunkData[][]) => {
    for (let i = 0; i < LevelDimensions.height; i++) {
        for (let j = 0; j < LevelDimensions.width; j++) {
            grid[i][j].toEnd = getDistanceToEnd(grid[i][j], End)
            grid[i][j].state = TileStates.noSet
        }
    }
    const PathToEnd: ChunkData[] = []
    PathToEnd.push(Start)
    Start.state = TileStates.closedSet
    while (PathToEnd[PathToEnd.length - 1].position.x !== End.position.x || PathToEnd[PathToEnd.length - 1].position.y !== End.position.y) {
        const Neighbors = getNeighbors(PathToEnd[PathToEnd.length - 1].position, grid).filter(n => n.state !== TileStates.closedSet && n.toEnd <= PathToEnd[PathToEnd.length - 1].toEnd);
        const PathStep = Neighbors[Math.floor(Math.random() * Neighbors.length)];
        PathStep.state = TileStates.closedSet;
        PathToEnd.push(PathStep);
    }
    return PathToEnd
}