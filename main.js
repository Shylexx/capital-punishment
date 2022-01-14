

import {Player} from "./classes/playerC.js";
import { WalkerGen } from "./procedural/worldgenerator.js";
import {LevelGen} from "./procedural/levelgenerator.js";
import * as WepSys from "./classes/weaponC.js";
import * as WepPickup from "./classes/weaponPickups.js";

//import {Bullet} from "./classes/bulletC.js";
//import * as Enemy from "./classes/enemyC.js";
//import {WeaponPickup} from "./classes/weaponPickups.js";


let world = {
    health_txt: null,
    moveKeys: null,
    map: null,

    bgTileSet: null,
    tileset: null,
    wallTiles: null,


    levelAry: null,

    groundLayer: null,
    wallLayer: null,
    aboveLayer: null,

    enemyAry: [],

    player_spr: null,
    reticle_spr: null,

    COLUMNS: 50,
    ROWS: 50,
    FLOORPERCENT: 0.3,
    spawnPosX: null,
    spawnPosY: null,
    curWave: 0,

    pickupText: null,
    controlText: null,
    scoreText: null
}; // end of world

let scoring = {
    score: 0,
    highscore: null,
    scoreStorage: "CapPunScore",
    waveStorage: "CapPunWave",
    wave: 0,
    highWave: null,
};

let config = {
    type: Phaser.AUTO,
    width: 1280, // Canvas width in pixels
    height:960, // Canvas height in pixels
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            pixelArt: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        _parent: 'phaser-example',
        width: 1280,
        height: 960,
        zoom: 7,
    },
    pixelArt:true,
};

scoring.highscore = localStorage.getItem(scoring.scoreStorage) == null ? 0 :
localStorage.getItem(scoring.scoreStorage);

scoring.highWave = localStorage.getItem(scoring.waveStorage) == null ? 0 :
localStorage.getItem(scoring.waveStorage);


let WorldGenerator = new WalkerGen((world.ROWS/2),(world.COLUMNS/2));
let LevelGenerator = new LevelGen(this, world, WorldGenerator);


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

function addEnemy(enemy){
    world.enemyAry.push(enemy);
}


function preload() {

    //Load Tilesets
    this.load.image('walls', 'assets/walltiles.png');
    //this.load.image('bgtiles', 'assets/bgtiles.png');
    this.load.image('tiles', 'assets/tiles/colored_transparent.png');
    this.load.image('bgtiles', 'assets/tiles/colored.png');

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
    buildMap(this, world);
    //LevelGenerator.populateLevel(this, world);
    
    // add camera
    this.cameras.main.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);
    // set physics boundaries
    this.physics.world.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);


    //Create Player and Reticle Sprites
    world.player_spr = new Player(this, world.spawnPosX, world.spawnPosY, 'janitor');
    world.player_spr.setScale(0.5);
    world.player_spr.setDepth(3);
    world.player_spr.setBodySize(0.7, 0.7);


    world.reticle_spr =  this.physics.add.sprite(world.spawnPosX, world.spawnPosY, 'reticle');
    world.reticle_spr.setDepth(10);
    world.reticle_spr.setScale(0.5);



    //Add Default Weapon
    world.player_spr.weapon.offWeapon = new WepSys.Pistol(this, world.spawnPosX, world.spawnPosY);
    world.player_spr.weapon.curWeapon = world.player_spr.weapon.offWeapon;
    world.player_spr.weapon.offWeapon.setInInv();
    world.player_spr.weapon.curWeapon.setDepth(6);
    world.player_spr.weapon.curWeapon.weaponVars.curWeapon = true;

    //var testGun = new WepSys.Rifle(this, world.spawnPosX + 50, world.spawnPosY);

    var testDrop = new WepPickup.RiflePickup(this, world.spawnPosX + 50, world.spawnPosY, world);

    var testDrop2 = new WepPickup.RiflePickup(this, world.spawnPosX + 20, world.spawnPosY, world);

    //Adding Collider for Checking walls
    this.physics.add.collider(world.player_spr, world.wallLayer);
    this.physics.add.collider(world.player_spr, world.groundLayer);

    //Creating Camera and having it follow the player
    //this.cameras.main.startFollow(world.player_spr, true, 0.1, 0.1);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.zoom = 7;



    //Create UI Element for Weapon Pickups
    world.pickupText = this.add.text(world.player_spr.x - world.player_spr.displayWidth/2, world.player_spr.y-15, "Pickup Text", {
        fontFamily: 'KenneyPixel',
        fontSize: '40px',
    });
    world.pickupText.setDepth(3).setScale(0.15).setVisible(false);

    //Create UI Text for Controls
    world.controlText = this.add.text(this.cameras.main.midPoint.x + (this.cameras.main.displayWidth / 4),this.cameras.main.midPoint.y + (this.cameras.main.displayHeight / 4), "Controls:  \nWASD To Move\n Space to Pick Up Weapon\n Q to swap weapons\n Left Mouse to Fire", {
        fontFamily: 'KenneyPixel',
        fontSize: '40px',
    });
    world.controlText.setDepth(3).setScale(0.15).setVisible(true);

    //Create Text For Score Display
    world.scoreText = this.add.text(this.cameras.main.midPoint.x - (this.cameras.main.displayWidth / 2.2),this.cameras.main.midPoint.y - (this.cameras.main.displayHeight / 2.2), "Score Text", {
        fontFamily: 'KenneyPixel',
        fontSize: '40px',
    });
    world.scoreText.setDepth(3).setScale(0.15).setVisible(true);


    //E key down for picking up weapons
    this.input.keyboard.on('keydown-E', function (event) {

        event.stopPropagation();

        scoring.score++;
        SaveStats();
        /* if(world.player_spr.overlapping != false){
            world.player_spr.pickupWeapon(world);
        } */

    });

    //E key down for picking up weapons
    this.input.keyboard.on('keydown-F', function (event) {

        event.stopPropagation();

        scoring.wave++;
        SaveStats();
        /* if(world.player_spr.overlapping != false){
            world.player_spr.pickupWeapon(world);
        } */

    });

    //Space bar down for picking up weapons
    this.input.keyboard.on('keydown-SPACE', function (event) {

        event.stopPropagation();

        if(world.player_spr.overlapping != false){
            world.player_spr.pickupWeapon(world);
        }

    });

    //Q Key down for swapping weapons
    this.input.keyboard.on('keydown-Q', function (event) {

        event.stopPropagation();

        world.player_spr.swapWeapons();
    });



    // Locks pointer on mousedown
    //Fires Weapon with Mousedown
    this.input.on('pointerdown', () => {
        if(game.input.mouse.locked != true){
            game.input.mouse.requestPointerLock();
        }
        
        world.player_spr.fireWeapon(this, world);
        
        

    });

    //Stops firing on mouseup
    this.input.on('pointerup',  () => {
        world.player_spr.stopFiring();
        

    });

    // Exit pointer lock when G or escape (by default) is pressed.
    this.input.keyboard.on('keydown-G', function () {
        if (game.input.mouse.locked)
            game.input.mouse.releasePointerLock();
    }, 0, this);

    // Move reticle upon locked pointer move Event
    this.input.on('pointermove', function (pointer) {
      if (this.input.mouse.locked)
      {
          // Move reticle with mouse
          world.reticle_spr.x = world.reticle_spr.x + pointer.movementX/3;
          world.reticle_spr.y = world.reticle_spr.y + pointer.movementY/3;
          
      }
      
    }, this);





} // create()


function buildMap(scene, world) {
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
        data: WorldGenerator.genData.l1backg_ary , tileWidth: 16, tileHeight: 16
    });

    //Add TileSets
    world.wallTiles = world.map.addTilesetImage('walls','walls', 32, 32, 1, 4);
    world.bgTileSet = world.map.addTilesetImage('bgtiles', 'bgtiles', 16, 16, 0, 1);
    world.tileset = world.map.addTilesetImage('tiles', 'tiles', 16, 16, 0, 1);

    // set up the tilemap layers
    world.groundLayer = world.map.createLayer(0, world.bgTileSet, 0, 0);
    world.wallLayer = world.map.createBlankLayer('wallLayer', world.tileset, 0, 0);

    for(let x = 0; x < WorldGenerator.roomWidth; x++){
        for( let y = 0; y < WorldGenerator.roomHeight; y++){
            if(WorldGenerator.genData.l1walker_ary[x][y] == 1){
                world.groundLayer.putTileAt(0, x, y);
                world.wallLayer.putTileAt(833, x, y);
            } else if (WorldGenerator.genData.l1walker_ary[x][y]== 2){
                world.groundLayer.putTileAt(0, x, y);
                world.wallLayer.putTileAt(833, x, y);
            } else if (WorldGenerator.genData.l1walker_ary[x][y]== 3){
                world.groundLayer.putTileAt(0, x, y);
                world.wallLayer.putTileAt(833, x, y);
            } else if(WorldGenerator.genData.l1walker_ary[x][y]== 4){
                world.groundLayer.putTileAt(0, x, y);
                world.wallLayer.putTileAt(833, x, y);
            }
            

        }
    }

        world.wallLayer.setDepth(2);




    //enable collision handling in blockLayer
    world.wallLayer.setCollision([833], true);



} //end of buildMap()

function CheckEnemyHP(){
    for(let enemy in world.enemyAry){
        if(world.enemyAry[enemy].hp < 1){
            world.enemyAry[enemy].setActive(false).setVisible(false).destroy();
            world.enemyAry.splice(enemy, 1);
            scoring.score++;
        }

    }
}

function CheckEnemiesLeft(){
    if(world.enemyAry.length < 1){
        scoring.wave++;
        world.curWave++;
        LevelGenerator.spawnWave();
        
    }
}

function CheckHighScores(){
    if(scoring.wave > scoring.highWave){
        scoring.highWave = scoring.wave;
    }
    if(scoring.score > scoring.highscore){
        scoring.highscore = scoring.score;
    }
}

function SaveStats(){
    //Init Score Saving
    scoring.highscore = Math.max(scoring.score, scoring.highscore);
    localStorage.setItem(scoring.scoreStorage, scoring.highscore);

    scoring.highWave = Math.max(scoring.wave, scoring.highWave);
    localStorage.setItem(scoring.waveStorage, scoring.highWave);
}

function update() {

    //Update UI
    console.log(this.cameras.main.midPoint);
    if(world.player_spr.overlapping != false){
        world.pickupText.setText("SPACE for " + world.player_spr.overlapping.weaponStored.weaponVars.name).setVisible(true).setX(world.player_spr.x - world.player_spr.displayWidth/2).setY(world.player_spr.y-15);
    }else{
        world.pickupText.setVisible(false);
    }

    world.controlText.setX(this.cameras.main.midPoint.x + (this.cameras.main.displayWidth / 4)).setY(this.cameras.main.midPoint.y + (this.cameras.main.displayHeight / 4));

    world.scoreText.setText("Score: "+ scoring.score+ "\nHigh Score: "+ scoring.highscore+"\nCurrent Wave: "+world.curWave+ "\n Highest Wave: "+ scoring.highWave).setX(this.cameras.main.midPoint.x - (this.cameras.main.displayWidth / 2.2)).setY(this.cameras.main.midPoint.y - (this.cameras.main.displayHeight / 2.2));   

    world.player_spr.updatePlayer(world);

    //checkBulletCollision();

    CheckEnemyHP();


    // reset the player motion
    //world.player_spr.setVelocity(0);

    constrainReticle(this, world.reticle_spr); 

    //make reticle move with player
    if(world.player_spr.body.blocked.none) {
        world.reticle_spr.setVelocityX(world.player_spr.body.velocity.x);
        world.reticle_spr.setVelocityY(world.player_spr.body.velocity.y);
    }


    //Update Current Weapon
    world.player_spr.weapon.curWeapon.updateMe(this,world);

    //Update non current weapon location
    if(world.player_spr.weapon.nonCurWeapon != null){
        world.player_spr.weapon.nonCurWeapon.x = world.player_spr.x - 2;
        world.player_spr.weapon.nonCurWeapon.y = world.player_spr.y;
    }


    updateCamera(this);

    //Update Enemies
    // for(i = 0; i < enemyAry.length; i++){
    //     enemyAry[i].updateEnemy(world);
    // }
    
    
} // end of update()

let game = new Phaser.Game(config);
