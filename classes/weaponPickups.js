import * as WepSys from "./weaponC.js";
export class WeaponPickup extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, weaponTemplate, world, texture){
        super(scene, x, y, texture);
        this.weaponStored = weaponTemplate;

        this.rotation = Math.floor(Math.random() * 360);

        scene.physics.add.existing(this);

        this.setBounce(0);

        scene.physics.add.overlap(this, world.player_spr, this.overlapPlayer, null, this);

        scene.add.existing(this);



    }

    overlapPlayer(player){
         if (player.overlapping == null){
        player.overlapping = this;
        console.log("Overlapped Pickup: " +this.weaponStored.weaponVars.name);
        } 
        console.log("Overlapped");
    }

    //Only Run if This is currently overlapped pickup
    checkEndOverlap(player){
        if(!this.scene.physics.overlap(this, player)){
            player.clearOverlap();
            console.log("Pickup Overlap Ended");
        }
    }

}