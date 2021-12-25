export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
        this.wakeRadius = null;
        
    }

    wakeUp(){
        this.awake = true;
    }

    sleep(){
        this.awake = false;
    }

    checkWakeRadius(world){
        var dist = Phaser.Math.Distance.Between(this.x, this.y, world.player_spr.x, world.player_spr.y);
        if(dist < this.wakeRadius){
            this.wakeUp();
        }
    }

}

export class Grunt extends Enemy {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
    }

    updateEnemy(scene, world){
        if(this.awake == false){
            this.checkWakeRadius(world);
        } else {
            
        }
    }
}

export class Shooter extends Enemy {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
    }
}

export class Charger extends Enemy {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
    }
}