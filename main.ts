scene.setBackgroundImage(assets.image`gameBG`)
let yoshi = sprites.create(assets.image`yoshi`, SpriteKind.Player)
controller.moveSprite(yoshi, 100, 0)
