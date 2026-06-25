// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level1":
            case "level1":return tiles.createTilemap(hex`14000c00000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000101010101000000000000000000000000000001000000000000000003000000000000000001010100000000000000000000000000000101010100000000000002000000000000000001000000000000000001000000000000000000000000000000000000000001010000000000010000000000000000000000020101000000000001010100000000000000000000010101010100000101010101010101010101010101010101010101`, img`
. . . . . . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . . . . . 
. . . . . . . . . . 2 2 2 2 2 . . . . . 
. . . . . . . . . 2 . . . . . . . . . . 
. . . . . . . 2 2 2 . . . . . . . . . . 
. . . . 2 2 2 2 . . . . . . . . . . . . 
. . . 2 . . . . . . . . 2 . . . . . . . 
. . . . . . . . . . . . . 2 2 . . . . . 
2 . . . . . . . . . . . . 2 2 . . . . . 
. 2 2 . . . . . . . . . . 2 2 2 2 2 . . 
. . 2 2 2 2 2 2 2 2 2 2 2 2 . . . . 2 2 
`, [myTiles.transparency16,sprites.builtin.brick,sprites.jewels.jewel2,sprites.jewels.jewel5], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "baseTransparency16":
            case "transparency16":return transparency16;
            case "myTile5":
            case "tile1":return tile1;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
