controller.up.repeatInterval = 75;
controller.down.repeatInterval = 75;
controller.left.repeatInterval = 75;
controller.right.repeatInterval = 75;
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    TestingPlayer.Position.y--;
    renderFrame(ChunkGrid)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    TestingPlayer.Position.y++;
    renderFrame(ChunkGrid)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    TestingPlayer.Position.x--;
    renderFrame(ChunkGrid)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    TestingPlayer.Position.x++;
    renderFrame(ChunkGrid)
})
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    TestingPlayer.Position.y--;
    renderFrame(ChunkGrid)
})
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    TestingPlayer.Position.y++;
    renderFrame(ChunkGrid)
})
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    TestingPlayer.Position.x--;
    renderFrame(ChunkGrid)
})
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    TestingPlayer.Position.x++;
    renderFrame(ChunkGrid)
})
