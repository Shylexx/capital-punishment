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

    overlapPlayer(){
         if (this.world.player_spr.overlapping != this){
        this.world.player_spr.overlapping = this;
        console.log("Overlapped");
        console.log("Overlapped Pickup: " +this.weaponStored.weaponVars.name);
        } 
    }

    //Only Run if This is currently overlapped pickup
    checkEndOverlap(player){
        if(!this.scene.physics.overlap(this, player)){
            player.clearOverlap();
            console.log("Pickup Overlap Ended");
        }
    }

}

export class RiflePickup extends WeaponPickup {
    constructor(scene, x, y, world){
        super(scene, x, y, world, "rifle");
        this.weaponStored = new WepSys.Rifle(scene, x, y).disableBody(true, true);

        this.rotation = Math.floor(Math.random() * 360);

        scene.physics.add.existing(this);


        scene.physics.add.overlap(this, world.player_spr, this.overlapPlayer, null, this);

        scene.add.existing(this);
    }
}

export class PistolPickup extends WeaponPickup {
    constructor(scene, x, y, world){
        super(scene, x, y, world, "pistol");
        this.weaponStored = new WepSys.Pistol(scene, x, y).disableBody(true, true);

        this.rotation = Math.floor(Math.random() * 360);

        scene.physics.add.existing(this);


        scene.physics.add.overlap(this, world.player_spr, this.overlapPlayer, null, this);

        scene.add.existing(this);
    }
}