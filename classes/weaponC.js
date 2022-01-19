import * as WepPickup from "./weaponPickups.js";

export class Weapon extends Phaser.Physics.Arcade.Sprite{
    weaponVars = {
        weaponType: null,
        curWeapon: null,
        inInv: null,
        name: null,
        fireMode: null,
        shotCost: null, //Ammo consumed per shot
        fireRate: 200, //How quickly the weapon is ready to fire again after firing
        lastFired: 0, //When the last shot was fired
    }
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }



    fire(scene, world) {
    }

    updateMe(scene, world){
        
        //Update Current Weapon
        if(this.weaponVars.curWeapon == true){

            //Rotate Weapon Around Sprite
            this.setRotation(Phaser.Math.Angle.Between(world.player_spr.x, world.player_spr.y, world.reticle_spr.x, world.reticle_spr.y));
            if(world.player_spr.facing == "left"){
                this.flipY = true;
            } else{
                this.flipY = false;
            }
            Phaser.Math.RotateTo(this, world.player_spr.x, world.player_spr.y+3, Phaser.Math.Angle.Between(world.player_spr.x, world.player_spr.y, world.reticle_spr.x, world.reticle_spr.y), 6);
        

            //Make Auto Weapons Fire without having to click again. Firerate is based on Per weapon firerate, and then offset by the players fire rate (Higher player fire rate = Faster Firing)
            if(world.player_spr.weapon.firing && scene.time.now > this.weaponVars.lastFired + this.weaponVars.fireRate - world.player_spr.stats.weaponFireRate){
                this.fire(scene, world);
                this.weaponVars.lastFired = scene.time.now;
            }
      
        }

        
    }

    setDropped(){
        this.weaponVars.inInv = false;
    }

    setInInv(){
        this.weaponVars.inInv = true;
    }

    getInInv(){
        return(this.weaponVars.inInv);
    }

    HitEnemy(bullet, enemy){
        
    }

}

export class Pistol extends Weapon{
    constructor(scene, x, y){
        super(scene, x, y, 'pistol');
        this.weaponVars.weaponType = "off";
        this.weaponVars.name = "Pistol";
        this.weaponVars.fireMode = "single";
        this.weaponVars.fireRate = 300;
        scene.add.existing(this);
        this.setScale(0.3);

    }
    //Semi Auto Firing
    fire(scene, world) {

        //If delay has passed, allow firing again
    if (scene.time.now > this.weaponVars.lastFired + this.weaponVars.fireRate - world.player_spr.stats.weaponFireRate){

        //Get first unused bullet from the bulletgroup
        var bullet = world.player_spr.weapon.bulletGroup.get()
        if(bullet){
            bullet.fire(this, world);
            world.shootGun.play({volume:0.3});


            //Bullet Collide with Walls
            scene.physics.add.collider(bullet, world.wallLayer, bullet.bulletHitWall, null, bullet);

            //Bullet Collide with Enemies
            for(let i = 0; i < world.enemyAry.length; i++){
            scene.physics.add.overlap(bullet, world.enemyAry[i], function() { 
                world.enemyAry[i].HurtEnemy();
                bullet.bulletHitEnemy();
            });
            
            }

            for(let i = 0; i < world.enemyAry.length; i++){
            scene.physics.add.overlap(bullet, world.enemyAry[i], bullet.bulletHitEnemy, null, bullet);
            }

            scene.cameras.main.shake(this.weaponVars.fireRate/2, 0.0001, true);
        }
        this.weaponVars.lastFired = scene.time.now;
    }   

    }

    //Spawn a pickup of this weapon
    createPickup(world){
        this.scene.add.existing(new WepPickup.PistolPickup(this.scene, world.player_spr.x, world.player_spr.y, world));
        this.setVisible(false).setActive(false).destroy();
    }


}

export class Rifle extends Weapon{
    constructor(scene, x, y){
        super(scene, x, y, 'rifle');
        this.weaponVars.weaponType = "main";
        this.weaponVars.name = "Rifle";
        this.weaponVars.fireMode = "auto";
        this.weaponVars.fireRate = 200;
        scene.add.existing(this);
        this.setScale(0.6, 0.35);
    }
    //Fire Weapon
    fire(scene, world) {

        //If delay has passed, allow firing again
        if (scene.time.now > this.weaponVars.lastFired + this.weaponVars.fireRate - world.player_spr.stats.weaponFireRate){
    
            //Get first unused bullet from bullet group
            var bullet = world.player_spr.weapon.bulletGroup.get()
            if(bullet){
                bullet.fire(this, world);
                world.shootGun.play({volume:0.3});
    
    
                //Bullet Collide with Walls
                scene.physics.add.collider(bullet, world.wallLayer, bullet.bulletHitWall, null, bullet);
    
                //Bullet Collide with Enemies
                for(let i = 0; i < world.enemyAry.length; i++){
                scene.physics.add.overlap(bullet, world.enemyAry[i], function() { 
                    if(world.enemyAry.length > 0){
                    world.enemyAry[i].HurtEnemy();
                    bullet.bulletHitEnemy();
                    }
                });
                }
    
                scene.cameras.main.shake(this.weaponVars.fireRate/2, 0.0001, true);
            }
            this.weaponVars.lastFired = scene.time.now;
        }   
    
        }

        //Create a pickup of the current weapon
    createPickup(world){
        this.scene.add.existing(new WepPickup.RiflePickup(this.scene, world.player_spr.x, world.player_spr.y, world));
        this.setVisible(false).setActive(false).destroy();
    }
}