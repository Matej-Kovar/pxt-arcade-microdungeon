controller.up.repeatInterval = 75;
controller.down.repeatInterval = 75;
controller.left.repeatInterval = 75;
controller.right.repeatInterval = 75;
const isColision = (position: Position, Side: Number) => {
    switch (Side) {
        case 0:
            AttackEnemy({y: position.y - 1, x:position.x})
            return displayGrid[position.y - 1][position.x].sprite.kind() === SpriteKind.Wall || entityGrid[position.y - 1][position.x].sprite.kind() === SpriteKind.Enemy
            break;
        case 1:
            AttackEnemy({y: position.y, x:position.x + 1})
            return displayGrid[position.y ][position.x + 1].sprite.kind() === SpriteKind.Wall || entityGrid[position.y][position.x + 1].sprite.kind() === SpriteKind.Enemy
            break;
        case 2:
            AttackEnemy({y: position.y + 1, x:position.x})
             return displayGrid[position.y + 1][position.x].sprite.kind() === SpriteKind.Wall || entityGrid[position.y + 1][position.x].sprite.kind() === SpriteKind.Enemy
            break;
        case 3:
            AttackEnemy({y: position.y, x:position.x - 1})
            return displayGrid[position.y][position.x - 1].sprite.kind() === SpriteKind.Wall || entityGrid[position.y][position.x - 1].sprite.kind() === SpriteKind.Enemy
            break;
        default:
            return false
            break;
    }

}
const AttackEnemy = (Position:Position)=> {
    if (entityGrid[Position.y][Position.x].sprite.kind() === SpriteKind.Enemy) {
        const Enemy: Creature = Enemies.find((enemy: Creature) => enemy.absolutePosition.y - startingPoint.y === Position.y && enemy.absolutePosition.x - startingPoint.x === Position.x)
        music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
        if (Enemy !== undefined) {
            Enemy.health -= Attack(Enemy.defense, TestingPlayer.attack)
        }
        if (Enemy.health <= 0) {
            music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
        }
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if(!gameIsRunnning){
        gameIsRunnning = true
        menu.destroy()
        title1.destroy()
        title2.destroy()
        title3.destroy()
    }
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if(gameIsRunnning){
    if (!isColision(TestingPlayer.secondaryPosition, Sides.top)) {
        TestingPlayer.absolutePosition.y--;
    }
    TestingPlayerSprite.setImage(assets.image`player-up`)
    renderFrame(ChunkGrid)
}
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if(gameIsRunnning){
    if (!isColision(TestingPlayer.secondaryPosition, Sides.bottom)) {
        TestingPlayer.absolutePosition.y++;
    }
    TestingPlayerSprite.setImage(assets.image`player-down`)
    renderFrame(ChunkGrid)
}
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if(gameIsRunnning){
    if (!isColision(TestingPlayer.secondaryPosition, Sides.left)) {
        TestingPlayer.absolutePosition.x--;
    }
    TestingPlayerSprite.setImage(assets.image`player-left`)
    renderFrame(ChunkGrid)
}
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if(gameIsRunnning){
    if (!isColision(TestingPlayer.secondaryPosition, Sides.right)) {
        TestingPlayer.absolutePosition.x++;
    }
    TestingPlayerSprite.setImage(assets.image`player-right`)
    renderFrame(ChunkGrid)
}
})
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    if(gameIsRunnning){
    if (!isColision(TestingPlayer.secondaryPosition, Sides.top)) {
        TestingPlayer.absolutePosition.y--;
    }
    TestingPlayerSprite.setImage(assets.image`player-up`)
    renderFrame(ChunkGrid)
}
})
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    if(gameIsRunnning){
    if (!isColision(TestingPlayer.secondaryPosition, Sides.bottom)) {
        TestingPlayer.absolutePosition.y++;
    }
    TestingPlayerSprite.setImage(assets.image`player-down`)
    renderFrame(ChunkGrid)
}
})
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    if(gameIsRunnning){
    if (!isColision(TestingPlayer.secondaryPosition, Sides.left)) {
        TestingPlayer.absolutePosition.x--;
    }
    TestingPlayerSprite.setImage(assets.image`player-left`)
    renderFrame(ChunkGrid)
}
})

controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    if(gameIsRunnning){
    if (!isColision(TestingPlayer.secondaryPosition, Sides.right)) {
        TestingPlayer.absolutePosition.x++;
    }
    TestingPlayerSprite.setImage(assets.image`player-right`)
    renderFrame(ChunkGrid)
}
})
