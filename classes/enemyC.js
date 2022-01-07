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

    wander(){
        this.moving = true;
        
    }


}

export class Grunt extends Enemy {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
        this.wakeRadius = 100;
        this.speed = 10;
        this.lastMoved = null;
    }

    updateEnemy(scene, world){
        if(this.awake == false){
            this.checkWakeRadius(world);
        } else {

            //Basic chase, move in straight line toward enemy.
            var dirX = world.player_spr.x - this.x;
            var dirY = world.player_spr.y - this.y;

            this.setVelocityX(Math.sign(dirX) * this.speed);
            this.setVelocityY(Math.sign(dirY) * this.speed);
        }
    }
}

export class Shooter extends Enemy {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
        this.wakeRadius = 100;
        this.speed = 10;
        this.lastMoved = null;
        this.moveDelay = 100;
        this.moving = false;
    }

    shootAtPlayer(){
        this.moving = false;
        this.setVelocity(0,0);

    }

    updateEnemy(){
        if(this.awake == false){
            this.checkWakeRadius();
        }else if(this.awake && scene.time.now > this.lastMoved + this.moveDelay && this.moving == false){
            this.wander();
            this.shootAtPlayer();
            this.lastMoved = scene.time.now;
        }
    }
    
}

export class Charger extends Enemy {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
    }
}