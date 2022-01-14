import { EnemyBullet } from "./bulletC.js";
export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
        this.wakeRadius = null;
        this.speed = null;
        this.hp = 5;
        
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
        var dir = Math.floor(Math.random() * (5 - 0) ) + 0;
        if(dir == 0){
            this.setVelocity(60, 0);
        } else if (dir == 2){
            this.setVelocity(-60, 0);
        }else if (dir == 3){
            this.setVelocity(0, 60);
        }else if (dir == 4){
            this.setVelocity(0, -60);
        }


    }

    HitEnemy(){
        this.hp--;
    }

}

export class Grunt extends Enemy {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
        this.wakeRadius = 100;
        this.speed = 10;
        this.lastMoved = null;
        this.enemyBullets = scene.physics.add.group({classType: EnemyBullet, runChildUpdate: false});
        this.enemyBullets.setX(xPos);
        this.enemyBullets.setY(yPos);
        this.hp = 5;

    }

    updateEnemy(world){
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
        this.moveDelay = 500;
        this.moving = false;
        this.hp = 5;
    }

    shootAtPlayer(world){
        
        this.setVelocity(0,0);
        console.log("Fired Pistol");

        var bullet = this.enemyBullets.get()
        if(bullet){
            bullet.fire(this.x, this.y, world.player_spr.x, world.player_spr.y);

            //Bullet Collide with Walls
            scene.physics.add.collider(bullet, world.wallLayer, bullet.bulletHitWall, null, bullet);

        }
        this.moving = false;
        this.lastMoved = scene.time.now;
    }

    updateEnemy(world){
        if(this.awake == false){
            this.checkWakeRadius();
        }else if(this.awake && scene.time.now > this.lastMoved + this.moveDelay){
            if(this.moving){
                this.moving = false;
                this.setVelocity(0,0);
                this.lastMoved = scene.time.now;
            } else{
                this.wander();
                this.shootAtPlayer(world);
            }

        }
    }
    
}

export class Charger extends Enemy {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
    }
}