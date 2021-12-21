

import {Player} from "./classes/playerC.js";
import { WalkerGen } from "./procedural/worldgenerator.js";
import {Pistol, Rifle} from "./classes/weaponC.js";
import {Bullet} from "./classes/bulletC.js"


let world = {
    health_txt: null,
    moveKeys: null,
    map: null,

    keyD: null,

    bgTileSet: null,
    tileset: null,
    wallTiles: null,

    levelAry: null,
    groundLayer: null,
    wallLayer: null,
    wallBorderLayer: null,
    wallTopLayer: null,
    aboveLayer: null,

    player_spr: null,
    reticle_spr: null,
    bulletGroup: null,

    COLUMNS: 50,
    ROWS: 50,
    FLOORPERCENT: 0.3,
    spawnPosX: null,
    spawnPosY: null,
}; // end of world

let config = {
    type: Phaser.AUTO,
    width: 1280, // Canvas width in pixels
    height:960, // Canvas height in pixels
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            //fixedStep: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let WorldGenerator = new WalkerGen((world.ROWS/2),(world.COLUMNS/2));


// Ensures reticle does not move offscreen and further than max dist(radius) from player
function constrainReticle(scene, reticle)
{
    //Keep Reticle in viewport THIS WORKS :D
    if(reticle.x < scene.cameras.main.midPoint.x - (scene.cameras.main.displayWidth/2)){
        reticle.x = scene.cameras.main.midPoint.x - (scene.cameras.main.displayWidth/2);
    } else if (reticle.x > scene.cameras.main.midPoint.x + (scene.cameras.main.displayWidth/2)){
        reticle.x = scene.cameras.main.midPoint.x + (scene.cameras.main.displayWidth/2);
    }

    if(reticle.y < scene.cameras.main.midPoint.y - (scene.cameras.main.displayHeight/2)){
        reticle.y = scene.cameras.main.midPoint.y - (scene.cameras.main.displayHeight/2);
    } else if (reticle.y > scene.cameras.main.midPoint.y + (scene.cameras.main.displayHeight/2)){
        reticle.y = scene.cameras.main.midPoint.y + (scene.cameras.main.displayHeight/2);
    }

    //Ensures Reticle cannot leave world bounds
    if(reticle.x > world.map.widthInPixels){
        reticle.x = world.map.widthInPixels;
        
    } else if (reticle.x < 0){
        reticle.x = 0;
    }

    if(reticle.y > world.map.heightInPixels){
        reticle.y = world.map.heightInPixels;
    } else if (reticle.y < 0){
        reticle.y = 0;
    }
    
}

function updateCamera(scene){


    //Smooth Camera System

    //Camera is Placed using difference between locations of player and reticle
    let midPointX = (world.reticle_spr.x-world.player_spr.x) /2;
    let midPointY = (world.reticle_spr.y-world.player_spr.y) /2;

    //Clamp camera positions to maximum distance from player. Ensures Player does not leave central box of screen.
    midPointX = Math.max(-(scene.cameras.main.displayWidth/5), Math.min(midPointX, (scene.cameras.main.displayWidth/5)));
    midPointY = Math.max(-(scene.cameras.main.displayHeight/5), Math.min(midPointY, (scene.cameras.main.displayHeight/5)));


    //Offset camera from player by midpoint of reticle
    midPointX = midPointX + world.player_spr.x;
    midPointY = midPointY + world.player_spr.y;


     //Move Camera to goal (midpoint of player and reticle) over time. Smooth movement
    scene.cameras.main.centerOn(scene.cameras.main.midPoint.x + 0.1 * (midPointX-scene.cameras.main.midPoint.x), scene.cameras.main.midPoint.y + 0.1 * (midPointY-scene.cameras.main.midPoint.y));
    
}



function preload() {

    //Load Tilesets
    this.load.image('walls', 'assets/walltiles.png');
    this.load.image('bgtiles', 'assets/bgtiles.png');

    //Load Bullet Sprite
    this.load.aseprite({
        key: 'bullet',
        textureURL: 'assets/weapons/bullet.png',
        atlasURL: 'assets/weapons/bullet.json',
    });

    //Load Weapons
    this.load.aseprite({
        key: 'pistol',
        textureURL: 'assets/weapons/pistol.png',
        atlasURL: 'assets/weapons/pistol.json'
    });

    this.load.aseprite({
        key: 'rifle',
        textureURL: 'assets/weapons/rifle.png',
        atlasURL: 'assets/weapons/rifle.json'
    });

    this.load.aseprite({
        key: 'janitor',
        textureURL: 'assets/player/playerSprite.png',
        atlasURL: 'assets/player/playerSprite.json'
    });

    this.load.aseprite({
        key: 'reticle',
        textureURL: 'assets/player/reticle.png',
        atlasURL: 'assets/player/reticle.json'
    });

} //end of preload()

function create() {
    world.moveKeys = this.input.keyboard.addKeys('W,A,S,D');
    
    //Create World
    WorldGenerator.genWorld(world);
    WorldGenerator.makeSpawnPos(world);
    buildWorld(this, world);
    
    // add camera
    this.cameras.main.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);
    // set physics boundaries
    this.physics.world.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);


    //Create Player and Reticle Sprites
    world.player_spr = new Player(this, world.spawnPosX, world.spawnPosY, 'janitor');
    world.player_spr.setScale(1.2);
    world.player_spr.setDepth(3);
    world.player_spr.setBodySize(0.5, 0.5);


    world.reticle_spr =  this.physics.add.sprite(world.spawnPosX, world.spawnPosY, 'reticle');
    world.reticle_spr.setDepth(10);

    //Create Bullet Group
    world.bulletGroup = this.physics.add.group({classType: Bullet, runChildUpdate: true});
    world.bulletGroup.setX(world.spawnPosX);
    world.bulletGroup.setY(world.spawnPosY);

    //Add Default Weapon
    world.player_spr.weapon.offWeapon = new Pistol(this, world.spawnPosX, world.spawnPosY);
    world.player_spr.weapon.curWeapon = world.player_spr.weapon.offWeapon;
    world.player_spr.weapon.offWeapon.setInInv();
    world.player_spr.weapon.curWeapon.setDepth(6);
    world.player_spr.weapon.curWeapon.weaponVars.curWeapon = true;
    world.player_spr.weapon.mainWeapon = new Rifle(this, world.spawnPosX, world.spawnPosY);
    world.player_spr.weapon.mainWeapon.setInInv();
    world.player_spr.weapon.nonCurWeapon = world.player_spr.weapon.mainWeapon;


    window['gun'] = world.player_spr.weapon.offWeapon;

    var testGun = new Rifle(this, world.spawnPosX + 50, world.spawnPosY);

    //Adding Collider for Checking walls
    this.physics.add.collider(world.player_spr, world.wallLayer);
    this.physics.add.collider(world.player_spr, world.groundLayer);
    this.physics.add.collider(world.player_spr, world.wallBorderLayer);
    this.physics.add.collider(world.player_spr, world.wallTopLayer);
    

    //Creating Camera and having it follow the player
    //this.cameras.main.startFollow(world.player_spr, true, 0.1, 0.1);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.zoom = 3;


    //E key down for picking up weapons
    this.input.keyboard.on('keydown-E', function (event) {

        event.stopPropagation();

    });

    //Q Key down for swapping weapons
    this.input.keyboard.on('keydown-Q', function (event) {

        event.stopPropagation();

        world.player_spr.swapWeapons();
    });


    // Locks pointer on mousedown
    //Fires Weapon with Mousedown
    this.input.on('pointerdown', (pointer) => {
        if(game.input.mouse.locked != true){
            game.input.mouse.requestPointerLock();
        }
        
        world.player_spr.fireWeapon(this, world);
        
        

    });

    //Stops firing on mouseup
    this.input.on('pointerup',  (pointer) => {
        world.player_spr.stopFiring();
        

    });

    // Exit pointer lock when G or escape (by default) is pressed.
    this.input.keyboard.on('keydown-G', function (event) {
        if (game.input.mouse.locked)
            game.input.mouse.releasePointerLock();
    }, 0, this);

    // Move reticle upon locked pointer move Event
    this.input.on('pointermove', function (pointer) {
      if (this.input.mouse.locked)
      {
          // Move reticle with mouse
          world.reticle_spr.x = world.reticle_spr.x + pointer.movementX;
          world.reticle_spr.y = world.reticle_spr.y + pointer.movementY;
          
      }


      
    }, this);





} // create()


function buildWorld(scene, world) {
    /*
    * Layer Depth Reference
    * Ground Layer: Default
    * WallLayer: 6
    * WallBorderLayer: 5
    * AboveLayer: 10
    * PlayerSpr: 3
    * ReticleSpr: 10
    * 
    */
    // Initialise the tilemap
    world.map = scene.make.tilemap({
        data: WorldGenerator.genData.l1backg_ary , tileWidth: 32, tileHeight: 32
    });

    //Add TileSets
    world.wallTiles = world.map.addTilesetImage('walls','walls', 32, 32, 1, 4);
    world.bgTileSet = world.map.addTilesetImage('bgtiles', 'bgtiles', 32, 32, 1, 4);

    // set up the tilemap layers
    world.groundLayer = world.map.createLayer(0, world.bgTileSet, 0, 0);
    world.wallLayer = world.map.createBlankLayer('wallLayer', world.wallTiles, 0, 0);
    world.wallBorderLayer = world.map.createBlankLayer('wallBorderLayer', world.wallTiles, 0, 0);
    world.wallTopLayer = world.map.createBlankLayer('wallTopLayer', world.wallTiles, 0, 0);

    for(let x = 0; x < WorldGenerator.roomWidth; x++){
        for( let y = 0; y < WorldGenerator.roomHeight; y++){
            if(WorldGenerator.genData.l1walker_ary[x][y] == 1){
                world.wallLayer.putTileAt(1, x, y);
            } else if (WorldGenerator.genData.l1walker_ary[x][y]== 2){
                world.wallTopLayer.putTileAt(2, x, y);
            } else if (WorldGenerator.genData.l1walker_ary[x][y]== 3){
                world.wallBorderLayer.putTileAt(1, x, y);
            } else if(WorldGenerator.genData.l1walker_ary[x][y]== 4){
                world.wallBorderLayer.putTileAt(1, x, y);
            }
            

        }
    }

        world.wallLayer.setDepth(6);
        world.wallBorderLayer.setDepth(4);
        world.wallTopLayer.setDepth(3);



    //enable collision handling in blockLayer
    world.wallLayer.setCollision([0, 1, 2, 3, 4], true);
    world.wallBorderLayer.setCollision([0, 1, 2, 3, 4], true);
    world.wallTopLayer.setCollision([0, 1, 2, 3 ,4], true);


    


    // Add the health text - set it so it moves with the camera
    world.health_txt = scene.add.text(10, 10, 'Health goes here', {
        font: '34px Arial',
        fill: '#fff'
    }).setScrollFactor(0);
} //end of buildWorld()


function update(time) {
    world.player_spr.updatePlayer(world);
    // reset the player motion
    //world.player_spr.setVelocity(0);

    constrainReticle(this, world.reticle_spr); 

    //make reticle move with player
    world.reticle_spr.setVelocityX(world.player_spr.body.velocity.x);
    world.reticle_spr.setVelocityY(world.player_spr.body.velocity.y);


    //Update Current Weapon
    world.player_spr.weapon.curWeapon.updateMe(this,world);

    //Update non current weapon location
    //world.player_spr.weapon.nonCurWeapon.x = world.player_spr.x - 2;
    //world.player_spr.weapon.nonCurWeapon.y = world.player_spr.y;


    updateCamera(this);
    
    
} // end of update()


