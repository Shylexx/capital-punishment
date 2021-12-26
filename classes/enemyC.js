export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
        this.wakeRadius = null;
        this.speed = null;
        
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
        this.speed = 10;
    }

    updateEnemy(scene, world){
        if(this.awake == false){
            this.checkWakeRadius(world);
        } else {

            //Basic chase, move in straight line toward enemy.
            var dirX = world.player_spr.x - this.x;
            var dirY = world.player_spr.y = this.y;

            this.setVelocityX(Math.sign(dirX) * this.speed);
            this.setVelocityY(Math.sign(dirY) * this.speed);
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