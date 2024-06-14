enum TileStates {
    noSet = 0,
    openSet = 1,
    closedSet = 2
}
const DisplayGrid: TileData[][] = []
const TilesToDo: TileData[] = []
const TilesFinished: TileData[] = []
let PathToEnd:TileData[] = []
for (let i = 0; i < RenderDistance.height; i++) {
    DisplayGrid.push([])
    for (let j = 0; j < RenderDistance.width; j++) {
        DisplayGrid[i][j] = new TileData({ y: i, x: j }, sprites.create(assets.image`blank`, 0))
        DisplayGrid[i][j].sprite.setPosition((j * TileSize.width + 0.5 * TileSize.width), (i * TileSize.height + 0.5 * TileSize.height))
    }
}
const Start1: TileData = DisplayGrid[0][0]
const End2: TileData = DisplayGrid[RenderDistance.height - 1][RenderDistance.width-1]
const getNeighbors = (element: TileData) => {
    const Neighbors: TileData[] = []
    if (element.position.y != 0) Neighbors.push(DisplayGrid[element.position.y - 1][element.position.x]);
    if (element.position.y != RenderDistance.height - 1) Neighbors.push(DisplayGrid[element.position.y + 1][element.position.x]);
    if (element.position.x != 0) Neighbors.push(DisplayGrid[element.position.y][element.position.x - 1]);
    if (element.position.x != RenderDistance.width - 1) Neighbors.push(DisplayGrid[element.position.y][element.position.x + 1]);
    return Neighbors
}
const getDistanceToEnd = (thisTile: TileData, end:TileData) => {
    return Math.sqrt(((end.position.x - thisTile.position.x)**2) + ((end.position.y - thisTile.position.y)**2))
}
const findPath = (Start: TileData, End: TileData) => {
    TilesToDo.push(Start)
    Start.state = TileStates.noSet
    while (TilesToDo.length > 0) {
        PathToEnd = []
        let lowestFIndex = 0
        for (let i = 0; i < TilesToDo.length; i++) {
            if (TilesToDo[i].value < TilesToDo[lowestFIndex].value) {
                lowestFIndex = i
            }
        }
    
        const CurrentTile: TileData = TilesToDo[lowestFIndex];
        if (CurrentTile.position.x === End.position.x && CurrentTile.position.y === End.position.y) {
            console.log("Finished")
        }
        TilesToDo.splice(lowestFIndex, 1)
        TilesFinished.push(CurrentTile)
        CurrentTile.state = TileStates.closedSet
        const Neighbors = getNeighbors(CurrentTile)
        for (let i = 0; i < Neighbors.length; i++) {
            const CurrentNeigbor = Neighbors[i]
            let tempG = CurrentTile.costToTravel + 1
            if (CurrentNeigbor.state !== TileStates.closedSet && CurrentNeigbor.sprite.kind() !== SpriteKind.Projectile) {
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
                CurrentNeigbor.cameFrom = CurrentTile

            }
        }
        PathToEnd.push(CurrentTile)
        let pathStep = CurrentTile
        while (pathStep.cameFrom !== undefined) {
            PathToEnd.push(pathStep.cameFrom)
            pathStep = pathStep.cameFrom
        }
        for (let i = 0; i < TilesToDo.length; i++) {
            TilesToDo[i].sprite.setImage(assets.image`open`)
        }
        for (let i = 0; i < TilesFinished.length; i++) {
            TilesFinished[i].sprite.setImage(assets.image`closed`)
        }
        for (let i = 0; i < PathToEnd.length; i++) {
            PathToEnd[i].sprite.setImage(assets.image`path`)
        }
        basic.pause(10)
    }
}