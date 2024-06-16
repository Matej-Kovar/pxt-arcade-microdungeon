controller.up.repeatInterval = 75;
controller.down.repeatInterval = 75;
controller.left.repeatInterval = 75;
controller.right.repeatInterval = 75;
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayGrid[TestingPlayer.absolutePosition.y - startingPoint.y - 1][TestingPlayer.absolutePosition.x - startingPoint.x].sprite.kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-up`)
        TestingPlayer.absolutePosition.y--;
        renderFrame(ChunkGrid)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayGrid[TestingPlayer.absolutePosition.y - startingPoint.y + 1][TestingPlayer.absolutePosition.x - startingPoint.x].sprite.kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-down`)
        TestingPlayer.absolutePosition.y++;
        renderFrame(ChunkGrid)
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayGrid[TestingPlayer.absolutePosition.y - startingPoint.y ][TestingPlayer.absolutePosition.x - startingPoint.x - 1].sprite.kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-left`)
        TestingPlayer.absolutePosition.x--;
        renderFrame(ChunkGrid)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayGrid[TestingPlayer.absolutePosition.y - startingPoint.y ][TestingPlayer.absolutePosition.x - startingPoint.x + 1].sprite.kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-right`)
        TestingPlayer.absolutePosition.x++;
        renderFrame(ChunkGrid)
    }
})
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayGrid[TestingPlayer.absolutePosition.y - startingPoint.y - 1][TestingPlayer.absolutePosition.x - startingPoint.x].sprite.kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-up`)
        TestingPlayer.absolutePosition.y--;
        renderFrame(ChunkGrid)
    }
})
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayGrid[TestingPlayer.absolutePosition.y - startingPoint.y + 1][TestingPlayer.absolutePosition.x - startingPoint.x].sprite.kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-down`)
        TestingPlayer.absolutePosition.y++;
        renderFrame(ChunkGrid)
    }
})
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayGrid[TestingPlayer.absolutePosition.y - startingPoint.y][TestingPlayer.absolutePosition.x - startingPoint.x - 1].sprite.kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-left`)
        TestingPlayer.absolutePosition.x--;
        renderFrame(ChunkGrid)
    }
})

controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayGrid[TestingPlayer.absolutePosition.y - startingPoint.y][TestingPlayer.absolutePosition.x - startingPoint.x + 1].sprite.kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-right`)
        TestingPlayer.absolutePosition.x++;
        renderFrame(ChunkGrid)
    }
})
