namespace SpriteKind {
    export const Pickup = SpriteKind.create()
    export const Debug = SpriteKind.create()
    export const Tool = SpriteKind.create()
    export const Follower = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pickup, function (sprite, otherSprite) {
    otherSprite.setKind(SpriteKind.Follower)
    otherSprite.setFlag(SpriteFlag.Ghost, false)
    otherSprite.ay = 100
    following.push(otherSprite)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    yoshi.vy = -115
})
function calcDistFromPlayer (sprite: Sprite) {
    distanceFromPlayer = Math.sqrt((sprite.x - yoshi.x) ** 2 + (sprite.y - yoshi.y) ** 2)
    return distanceFromPlayer
}
function calcSpriteDist (follower: Sprite, leader: Sprite) {
    distFromLeader = Math.sqrt((follower.x - leader.x) ** 2 + (follower.y - leader.y) ** 2)
    return distFromLeader
}
function spawnBasketballs () {
    for (let ballSpot of tiles.getTilesByType(sprites.jewels.jewel2)) {
        ball = sprites.create(assets.image`basketball`, SpriteKind.Pickup)
        tiles.placeOnTile(ball, ballSpot)
        tiles.setTileAt(ballSpot, assets.tile`baseTransparency16`)
    }
}
let leaderToCheck: Sprite = null
let followerToCheck: Sprite = null
let ball: Sprite = null
let distFromLeader = 0
let distanceFromPlayer = 0
let following: Sprite[] = []
let yoshi: Sprite = null
tiles.setCurrentTilemap(tilemap`level1`)
yoshi = sprites.create(assets.image`yoshi`, SpriteKind.Player)
yoshi.ay = 300
controller.moveSprite(yoshi, 70, 0)
scene.cameraFollowSprite(yoshi)
spawnBasketballs()
following = []
let followDistance = 20
// Chain Follow
game.onUpdate(function () {
    if (following.length > 0) {
        for (let index = 0; index <= following.length - 1; index++) {
            followerToCheck = following[index]
            if (index - 1 == -1) {
                leaderToCheck = yoshi
            } else {
                leaderToCheck = following[index - 1]
            }
            if (calcSpriteDist(followerToCheck, leaderToCheck) > followDistance) {
                followerToCheck.follow(leaderToCheck, 75)
            } else {
                followerToCheck.unfollow()
            }
        }
    }
})
