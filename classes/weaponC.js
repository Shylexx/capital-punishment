

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
        console.log("Fired");
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
            Phaser.Math.RotateTo(this, world.player_spr.x, world.player_spr.y+5, Phaser.Math.Angle.Between(world.player_spr.x, world.player_spr.y, world.reticle_spr.x, world.reticle_spr.y), 17);
            this.body.reset(this.x, this.y);
        

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

}

export class Pistol extends Weapon{
    constructor(scene, x, y){
        super(scene, x, y, 'pistol');
        this.weaponVars.weaponType = "off";
        this.weaponVars.name = "Pistol";
        this.weaponVars.fireMode = "single";
        this.weaponVars.fireRate = 300;
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setScale(0.6);

    }
    fire(scene, world) {

    if (scene.time.now > this.weaponVars.lastFired + this.weaponVars.fireRate - world.player_spr.stats.weaponFireRate){
        console.log("Fired Pistol");

        var bullet = world.bulletGroup.get()
        if(bullet){
            bullet.fire(this, world);
            bullet.setBodySize(0.5,0.5);

            //Bullet Collide with Walls
            scene.physics.add.collider(bullet, world.wallBorderLayer, bullet.bulletHitWall, null, bullet);
            scene.physics.add.collider(bullet, world.wallLayer, bullet.bulletHitWall, null, bullet);
            scene.physics.add.collider(bullet, world.wallTopLayer, bullet.bulletHitWall, null, bullet);
            scene.cameras.main.shake(this.weaponVars.fireRate/2, 0.001, true);
        }
        this.weaponVars.lastFired = scene.time.now;
    }   

    }
}

export class Rifle extends Weapon{
    constructor(scene, x, y){
        super(scene, x, y, 'rifle');
        this.weaponType = "main";
        this.weaponVars.name = "Rifle";
        this.weaponVars.fireMode = "auto";
        this.weaponVars.fireRate = 200;
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setScale(1.2, 0.7);
    }
    fire(scene, world){
        console.log("Fired Rifle")

        var bullet = world.bulletGroup.get().setActive(true).setVisible(true);
        if(bullet){
            bullet.fire(this, world);
            bullet.setBodySize(0.5, 0.5);
            bullet.body.bounce.set(1);
            
            //Bullet Collide with Walls
            scene.physics.add.collider(bullet, world.wallBorderLayer, bullet.bulletHitWall, null, bullet);
            scene.physics.add.collider(bullet, world.wallLayer, bullet.bulletHitWall, null, bullet);
            scene.physics.add.collider(bullet, world.wallTopLayer, bullet.bulletHitWall, null, bullet);

            scene.cameras.main.shake(this.weaponVars.fireRate/2, 0.001, true);
        }

    }
}