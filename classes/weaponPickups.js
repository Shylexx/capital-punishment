export class WeaponPickup extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, weaponTemplate, player_spr){
        super(scene, x, y, weaponTemplate.texture.key);
        this.weaponStored = weaponTemplate;

        this.rotation = Math.floor(Math.random() * 360);

        scene.physics.add.existing(this);

        scene.physics.add.overlap(this, player_spr, function () { overlapPlayer(player_spr) })

        scene.add.existing(this);



    }

    overlapPlayer(player){
        if (player.overlapping == false){
        player.overlapping = this;
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