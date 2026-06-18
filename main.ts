namespace SpriteKind {
    export const Pickup = SpriteKind.create()
    export const Debug = SpriteKind.create()
    export const Tool = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pickup, function (sprite, otherSprite) {
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    if (following.length == 0) {
        console.logValue("Empty Following", following.length)
        otherSprite.follow(followerSprite, 40)
    } else {
        console.logValue("We Have Followers", following.length)
        otherSprite.follow(following[following.length], 40)
    }
    following.push(otherSprite)
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
let ball: Sprite = null
let distFromLeader = 0
let distanceFromPlayer = 0
let followerSprite: Sprite = null
let following: Sprite[] = []
let yoshi: Sprite = null
tiles.setCurrentTilemap(tilemap`level1`)
yoshi = sprites.create(assets.image`yoshi`, SpriteKind.Player)
yoshi.ay = 300
controller.moveSprite(yoshi, 70, 50)
scene.cameraFollowSprite(yoshi)
spawnBasketballs()
following = []
followerSprite = sprites.create(assets.image`followerHead`, SpriteKind.Tool)
followerSprite.z = 25
followerSprite.ay = 150
let followDistance = 20
// Chain Follow
game.onUpdate(function () {
    if (calcSpriteDist(followerSprite, yoshi) > followDistance) {
        followerSprite.follow(yoshi)
    } else {
        followerSprite.unfollow()
    }
})
