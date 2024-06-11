controller.up.repeatInterval = 75;
controller.down.repeatInterval = 75;
controller.left.repeatInterval = 75;
controller.right.repeatInterval = 75;
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayGrid[TestingPlayer.relativePosition.y - 1][TestingPlayer.relativePosition.x].kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-up`)
        TestingPlayer.absolutePosition.y--;
        renderFrame(ChunkGrid)
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayGrid[TestingPlayer.relativePosition.y + 1][TestingPlayer.relativePosition.x].kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-down`)
        TestingPlayer.absolutePosition.y++;
        renderFrame(ChunkGrid)
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayGrid[TestingPlayer.relativePosition.y][TestingPlayer.relativePosition.x - 1].kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-left`)
        TestingPlayer.absolutePosition.x--;
        renderFrame(ChunkGrid)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (displayGrid[TestingPlayer.relativePosition.y][TestingPlayer.relativePosition.x + 1].kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-right`)
        TestingPlayer.absolutePosition.x++;
        renderFrame(ChunkGrid)
    }
})
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayGrid[TestingPlayer.relativePosition.y - 1][TestingPlayer.relativePosition.x].kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-up`)
        TestingPlayer.absolutePosition.y--;
        renderFrame(ChunkGrid)
    }
})
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayGrid[TestingPlayer.relativePosition.y + 1][TestingPlayer.relativePosition.x].kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-down`)
        TestingPlayer.absolutePosition.y++;
        renderFrame(ChunkGrid)
    }
})
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayGrid[TestingPlayer.relativePosition.y][TestingPlayer.relativePosition.x - 1].kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-left`)
        TestingPlayer.absolutePosition.x--;
        renderFrame(ChunkGrid)
    }
})

controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    if (displayGrid[TestingPlayer.relativePosition.y][TestingPlayer.relativePosition.x + 1].kind() !== SpriteKind.Wall) {
        TestingPlayer.sprite.setImage(assets.image`player-right`)
        TestingPlayer.absolutePosition.x++;
        renderFrame(ChunkGrid)
    }
})
