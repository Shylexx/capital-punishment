import * as WepSys from "./weaponC.js";
export class WeaponPickup extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, world, texture){
        super(scene, x, y, texture);
        this.world = world;
        this.weaponStored = null;

        this.rotation = Math.floor(Math.random() * 360);

        scene.physics.add.existing(this);

        scene.physics.add.overlap(this, world.player_spr, this.overlapPlayer, null, this);

        scene.add.existing(this);



    }

    //Tell player sprite which pickup they are currently overlapping
    overlapPlayer(){
         if (this.world.player_spr.overlapping != this) {
        this.world.player_spr.overlapping = this;
        } 
    }

    //Only Run if This is currently overlapped pickup
    checkEndOverlap(player){
        if(!this.scene.physics.overlap(this, player)){
            player.clearOverlap();
        }
    }

}

//Pickup for Rifle Weapon
export class RiflePickup extends WeaponPickup {
    constructor(scene, x, y, world){
        super(scene, x, y, world, "rifle");
        this.weaponStored = new WepSys.Rifle(scene, x, y);
        this.weaponStored.setVisible(false);

        this.rotation = Math.floor(Math.random() * 360);

        scene.physics.add.existing(this);
        this.setScale(0.6, 0.35);


        scene.physics.add.overlap(this, world.player_spr, this.overlapPlayer, null, this);

        scene.add.existing(this);

        this.setScale(0.5);
    }
}

//Pickup for Pistol Weapon
export class PistolPickup extends WeaponPickup {
    constructor(scene, x, y, world){
        super(scene, x, y, world, "pistol");
        this.weaponStored = new WepSys.Pistol(scene, x, y);
        this.weaponStored.setVisible(false);

        this.rotation = Math.floor(Math.random() * 360);

        scene.physics.add.existing(this);


        scene.physics.add.overlap(this, world.player_spr, this.overlapPlayer, null, this);

        scene.add.existing(this);

        this.setScale(0.5);
    }
}
