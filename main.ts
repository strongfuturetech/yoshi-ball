namespace SpriteKind {
    export const Pickup = SpriteKind.create()
    export const Debug = SpriteKind.create()
    export const Tool = SpriteKind.create()
    export const Follower = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pickup, function (sprite, otherSprite) {
    otherSprite.setKind(SpriteKind.Follower)
    // Turn this on if losing the connection is more common.
    otherSprite.setFlag(SpriteFlag.Ghost, false)
    otherSprite.ay = 100
    following.push(otherSprite)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (following.length > 0) {
        pick = following.pop()
        pick.unfollow()
        ballToShoot = darts.create(pick.image, SpriteKind.Pickup)
        // we're gonna need to know which way Yoshi is facing so we can put it on the right side.
        ballToShoot.setPosition(yoshi.x + 25, yoshi.y)
        // Maybe we'll introduce a more interesting despawn anim later
        pick.scale += -0.75
        sprites.destroy(pick, effects.confetti, 500)
    }
})
// I do want to borrow that "attempt jump" code
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
controller.B.onEvent(ControllerButtonEvent.Repeated, function () {
    ballToShoot.pow += 10
    pause(100)
})
function spawnBasketballs () {
    for (let ballSpot of tiles.getTilesByType(sprites.jewels.jewel2)) {
        ball = sprites.create(assets.image`basketball`, SpriteKind.Pickup)
        tiles.placeOnTile(ball, ballSpot)
        tiles.setTileAt(ballSpot, assets.tile`baseTransparency16`)
    }
}
controller.B.onEvent(ControllerButtonEvent.Released, function () {
    ballToShoot.throwDart()
})
let leaderToCheck: Sprite = null
let followerToCheck: Sprite = null
let ball: Sprite = null
let distFromLeader = 0
let distanceFromPlayer = 0
let ballToShoot: Dart = null
let pick: Sprite = null
let following: Sprite[] = []
let yoshi: Sprite = null
scene.setBackgroundImage(assets.image`gameBG`)
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
                followerToCheck.follow(leaderToCheck, 100)
            } else {
                followerToCheck.unfollow()
            }
        }
    }
})
