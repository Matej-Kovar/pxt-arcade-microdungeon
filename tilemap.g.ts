// Auto-generated code. Do not edit.
namespace myImages {

    helpers._registerFactory("image", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "myTiles.transparency16":return img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`;
            case "myTiles.tile1":
            case "wall":return img`
a a a a a a a a a a a a . . . . 
a c c c c c c c c c c a . . . . 
a c c c c c c c c c c a . . . . 
a c c c c c c c c c c a . . . . 
a c c c c c c c c c c a . . . . 
a c c c c c c c c c c a . . . . 
a c c c c c c c c c c a . . . . 
a c c c c c c c c c c a . . . . 
a c c c c c c c c c c a . . . . 
a c c c c c c c c c c a . . . . 
a c c c c c c c c c c a . . . . 
a a a a a a a a a a a a . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`;
            case "myTiles.tile2":
            case "floor":return img`
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
b b b b b b b b b b b b . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`;
            case "myTiles.tile4":
            case "myTile0":return img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`;
            case "myTiles.tile3":
            case "player":return img`
f f f f f f f f f f f f . . . . 
f f f f f f f f f f f f . . . . 
f f f f f f f f f f f f . . . . 
f f f f f f f f f f f f . . . . 
f f f f f f f f f f f f . . . . 
f f f f f f f f f f f f . . . . 
f f f f f f 3 f f f f f . . . . 
f f f f f f f f f f f f . . . . 
f f f f f f f f f f f f . . . . 
f f f f f f f f f f f f . . . . 
f f f f f f f f f f f f . . . . 
f f f f f f f f f f f f . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`;
        }
        return null;
    })

    helpers._registerFactory("animation", function(name: string) {
        switch(helpers.stringTrim(name)) {

        }
        return null;
    })

    helpers._registerFactory("song", function(name: string) {
        switch(helpers.stringTrim(name)) {

        }
        return null;
    })

}
// Auto-generated code. Do not edit.

// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return myTiles.transparency16;
            case "wall":
            case "tile1":return myTiles.tile1;
            case "floor":
            case "tile2":return myTiles.tile2;
            case "myTile0":
            case "tile4":return myTiles.tile4;
            case "player":
            case "tile3":return myTiles.tile3;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
