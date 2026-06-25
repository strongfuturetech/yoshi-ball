namespace SpriteKind {
    export const Pickup = SpriteKind.create()
    export const Debug = SpriteKind.create()
    export const Tool = SpriteKind.create()
    export const Follower = SpriteKind.create()
    export const Hoop = SpriteKind.create()
}
function spawnHoops () {
    for (let hoopSpot of tiles.getTilesByType(sprites.jewels.jewel5)) {
        hoop = sprites.create(assets.image`hoop`, SpriteKind.Hoop)
        hoop.setScale(1.5, ScaleAnchor.Middle)
        tiles.placeOnTile(hoop, hoopSpot)
        tiles.setTileAt(hoopSpot, assets.tile`baseTransparency16`)
    }
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
        ballToShoot = darts.create(pick.image, SpriteKind.Projectile)
        ballToShoot.pow = 40
        ballToShoot.setBounceOnWall(true)
        // Maybe we'll introduce a more interesting despawn anim later
        pick.scale += -0.25
        sprites.destroy(pick, effects.warmRadial, 500)
        if (playerFacingLeft) {
            // we're gonna need to know which way Yoshi is facing so we can put it on the right side.
            ballToShoot.setPosition(yoshi.x - 20, yoshi.y - 10)
            ballToShoot.angle = 180
        } else {
            // we're gonna need to know which way Yoshi is facing so we can put it on the right side.
            ballToShoot.setPosition(yoshi.x + 20, yoshi.y - 10)
            ballToShoot.angle = 0
        }
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (yoshi.isHittingTile(CollisionDirection.Bottom)) {
        yoshi.vy = -125
    } else if (!(yoshi.isHittingTile(CollisionDirection.Bottom)) && canDblJump) {
        yoshi.vy = -95
        canDblJump = false
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Hoop, function (sprite, otherSprite) {
    yoshi.sayText(":D", 500, false)
    if (calcDistFromPlayer(otherSprite) >= 50) {
        info.changeScoreBy(3)
    } else if (calcDistFromPlayer(otherSprite) >= 25) {
        info.changeScoreBy(2)
    } else {
        info.changeScoreBy(1)
    }
    sprites.destroy(sprite, effects.warmRadial, 500)
    sprites.destroy(otherSprite, effects.confetti, 1000)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(playerFacingLeft)) {
        playerFacingLeft = true
        spriteFx.flipHorizontal(yoshi)
    }
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
    ballToShoot.pow += 20
    pause(100)
})
function spawnBasketballs () {
    for (let ballSpot of tiles.getTilesByType(sprites.jewels.jewel2)) {
        ball = sprites.create(assets.image`basketball`, SpriteKind.Pickup)
        // Vibrates on the floor...
        ball.setBounceOnWall(false)
        ball.ay = gravity / 4
        tiles.placeOnTile(ball, ballSpot)
        tiles.setTileAt(ballSpot, assets.tile`baseTransparency16`)
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (playerFacingLeft) {
        playerFacingLeft = false
        spriteFx.flipHorizontal(yoshi)
    }
})
controller.B.onEvent(ControllerButtonEvent.Released, function () {
    ballToShoot.throwDart()
    ballToShoot.ay = gravity
})
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    sprite.setKind(SpriteKind.Pickup)
})
let leaderToCheck: Sprite = null
let followerToCheck: Sprite = null
let ball: Sprite = null
let distFromLeader = 0
let distanceFromPlayer = 0
let ballToShoot: Dart = null
let pick: Sprite = null
let hoop: Sprite = null
let canDblJump = false
let playerFacingLeft = false
let following: Sprite[] = []
let yoshi: Sprite = null
let gravity = 0
scene.setBackgroundImage(assets.image`gameBG`)
tiles.setCurrentTilemap(tilemap`level1`)
gravity = 300
yoshi = sprites.create(assets.image`yoshi`, SpriteKind.Player)
yoshi.ay = gravity
controller.moveSprite(yoshi, 90, 0)
scene.cameraFollowSprite(yoshi)
spawnBasketballs()
spawnHoops()
following = []
let followDistance = 20
playerFacingLeft = true
canDblJump = false
info.setScore(0)
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
                followerToCheck.follow(leaderToCheck, 110)
            } else {
                followerToCheck.unfollow()
            }
        }
    }
})
// Player Animations
// Facing Direction
// Etc.
game.onUpdate(function () {
    let flippedPlayer = 0
    if (yoshi.isHittingTile(CollisionDirection.Bottom)) {
        canDblJump = true
    }
    if (playerFacingLeft && !(flippedPlayer)) {
    	
    }
})
// Help the basketballs nav the level
game.onUpdate(function () {
    for (let value of following) {
        // ball is on the ground
        // 
        // 
        // 
        // ball is stuck on the wall (and may move with the player?)
        if (value.isHittingTile(CollisionDirection.Bottom)) {
            value.vy = -45
        } else if (value.isHittingTile(CollisionDirection.Left)) {
            console.log("Wall to left of ball!")
        } else if (value.isHittingTile(CollisionDirection.Right)) {
            console.log("Wall to right of ball!")
        }
    }
})
