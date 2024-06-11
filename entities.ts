class Item {
    relativePosition: Position;
    type:number
    constructor(position: Position, itemType:number){
        this.relativePosition = position
        this.type = itemType
    }
    pickUp() {
        switch (this.type) {
            case 0:
                TestingPlayer.health = TestingPlayer.maxhealth
                break;
            case 1:
                TestingPlayer.maxhealth = TestingPlayer.maxhealth*1.2
            break;
            case 2:
                TestingPlayer.attack = TestingPlayer.attack*1.2
                break;
            case 3:
                TestingPlayer.defense = TestingPlayer.defense*1.2
                break;
            default:
                break;
        }
    }
}
class Creature {
    absolutePosition: Position
    relativePosition:Position
    sprite: Sprite
    maxhealth:number
    health: number
    attack: number
    defense: number
    constructor(positionAbs:Position, positionRel:Position, Sprite:Sprite, Maxhealth:number, health:number, attack:number, defense:number) {
        this.absolutePosition = positionAbs
        this.relativePosition = positionRel
        this.sprite = Sprite
        this.maxhealth = Maxhealth
        this.health = health
        this.attack = attack
        this.defense = defense
    }
}
enum ItemTypes {
    regen = 0,
    healthBoost = 1,
    damageBoost = 2,
    defenseBoost = 3
}