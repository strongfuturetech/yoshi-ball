namespace SpriteKind {
    export const Pickup = SpriteKind.create()
    export const Debug = SpriteKind.create()
    export const Tool = SpriteKind.create()
    export const Follower = SpriteKind.create()
    export const Hoop = SpriteKind.create()
}
namespace StatusBarKind {
    export const Power = StatusBarKind.create()
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
        playerIsShooting = true
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
    if (calcDistFromPlayer(otherSprite) >= 75) {
        info.changeScoreBy(3)
    } else if (calcDistFromPlayer(otherSprite) >= 38) {
        info.changeScoreBy(2)
    } else {
        info.changeScoreBy(1)
    }
    sprites.destroy(sprite, effects.warmRadial, 500)
    sprites.destroy(otherSprite, effects.confetti, 1000)
    pause(1000)
    if (sprites.allOfKind(SpriteKind.Hoop).length == 0) {
        game.showLongText("Stage Complete!", DialogLayout.Center)
        currentMap += 1
        selectMap(currentMap)
    }
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
statusbars.onStatusReached(StatusBarKind.Health, statusbars.StatusComparison.EQ, statusbars.ComparisonType.Fixed, 100, function (status) {
    maxPowerReached = true
})
function calcSpriteDist (follower: Sprite, leader: Sprite) {
    distFromLeader = Math.sqrt((follower.x - leader.x) ** 2 + (follower.y - leader.y) ** 2)
    return distFromLeader
}
controller.B.onEvent(ControllerButtonEvent.Repeated, function () {
    if (playerIsShooting && !(maxPowerReached)) {
        ballToShoot.pow += 20
        statusbar.value += 10
        pause(100)
    }
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
    if (playerIsShooting) {
        ballToShoot.throwDart()
        ballToShoot.ay = gravity
        statusbar.value = 0
        playerIsShooting = false
        maxPowerReached = false
    }
})
function selectMap (map: number) {
    if (map > 1) {
        sprites.destroy(yoshi)
    }
    if (map == 1) {
        tiles.setCurrentTilemap(tilemap`level1`)
    } else if (map == 2) {
        tiles.setCurrentTilemap(tilemap`level2`)
    } else {
        console.log("Add remaining time to points")
        game.setGameOverEffect(true, effects.confetti)
        game.setGameOverScoringType(game.ScoringType.HighScore)
        game.setGameOverMessage(true, "Finished!")
        game.gameOver(true)
        return
    }
    createPlayer()
    spawnBasketballs()
    spawnHoops()
    following = []
    canDblJump = false
    maxPowerReached = false
}
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    sprite.setKind(SpriteKind.Pickup)
})
function createPlayer () {
    yoshi = sprites.create(assets.image`yoshi`, SpriteKind.Player)
    yoshi.ay = gravity
    controller.moveSprite(yoshi, 90, 0)
    scene.cameraFollowSprite(yoshi)
    playerFacingLeft = true
}
function createPowerBar () {
    statusbar = statusbars.create(40, 8, StatusBarKind.Power)
    statusbar.value = 0
    statusbar.setColor(9, 11, 3)
    statusbar.setBarBorder(2, 12)
    statusbar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
    statusbar.positionDirection(CollisionDirection.Bottom)
    statusbar.setOffsetPadding(0, 3)
}
let leaderToCheck: Sprite = null
let followerToCheck: Sprite = null
let ball: Sprite = null
let statusbar: StatusBarSprite = null
let distFromLeader = 0
let maxPowerReached = false
let distanceFromPlayer = 0
let canDblJump = false
let yoshi: Sprite = null
let playerFacingLeft = false
let ballToShoot: Dart = null
let pick: Sprite = null
let playerIsShooting = false
let following: Sprite[] = []
let hoop: Sprite = null
let currentMap = 0
let gravity = 0
scene.setBackgroundImage(assets.image`gameBG`)
gravity = 300
currentMap = 1
selectMap(currentMap)
let followDistance = 20
createPowerBar()
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
// Help the basketballs nav the level... kinda.
game.onUpdate(function () {
    for (let value of following) {
        if (value.isHittingTile(CollisionDirection.Bottom)) {
            value.vy = -45
        }
    }
})
