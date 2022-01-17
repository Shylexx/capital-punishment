import { EnemyBullet } from "./bulletC.js";
export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, xPos, yPos, texture){
        super(scene, xPos, yPos, texture);
        this.awake = false;
        this.wakeRadius = 100;
        this.speed = 10;
        this.lastMoved = null;
        this.lastShot = null;
        this.shootDelay = 1500;
        this.moveDelay = 500;
        this.moving = false;
        this.hp = 5;
        scene.physics.add.existing(this);

        this.setScale(0.5);
        scene.add.existing(this);

        this.setBodySize(16, 16);
        this.setScale(0.5);
        this.setDepth(3);
        this.setOffset(8, 10);
        
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
            this.setVelocity(40, 0);
        } else if (dir == 2){
            this.setVelocity(-40, 0);
        }else if (dir == 3){
            this.setVelocity(0, 40);
        }else if (dir == 4){
            this.setVelocity(0, -40);
        }


    }

    HurtEnemy(){
        this.hp--;
        console.log(this.hp);
    }

}

export class Grunt extends Enemy {
    constructor(scene, xPos, yPos, world){
        super(scene, xPos, yPos, 'skeleton');
        this.awake = false;
        this.wakeRadius = 100;
        this.speed = 10;
        this.lastMoved = null;

        this.hp = 5;

        scene.physics.add.existing(this);
        this.setScale(0.6);
        //set up the physics properties

        scene.physics.add.overlap(this, world.player_spr, world.player_spr.hurtPlayer, null, world.player_spr)

        scene.anims.createFromAseprite('skeleton');
        this.setCollideWorldBounds(true);



        scene.add.existing(this);


        this.setBodySize(12, 16);
        this.setScale(0.5);
        this.setDepth(3);
        this.setOffset(12, 12);

    }

    updateEnemy(scene, world){
        if(this.awake == false){
            this.checkWakeRadius(world);
            this.moving = false;
        } else {
            this.moving = true;


            //Basic chase, move in straight line toward enemy.
            var dirX = world.player_spr.x - this.x;
            var dirY = world.player_spr.y - this.y;
            this.setVelocityX(Math.sign(dirX) * this.speed);
            this.setVelocityY(Math.sign(dirY) * this.speed);
            
        }
        if(this.moving){
            this.play('walkSkel', true);
        } else {
            this.play('idleSkel', true);
        }
    }
}

export class Shooter extends Enemy {
    constructor(scene, xPos, yPos, world){
        super(scene, xPos, yPos, 'witch');
        this.awake = false;
        this.wakeRadius = 100;
        this.speed = 10;
        this.lastMoved = null;
        this.lastShot = null;
        this.shootDelay = 1500;
        this.moveDelay = 500;
        this.moving = false;
        this.hp = 5;
        scene.physics.add.existing(this);

        scene.physics.add.overlap(this, world.player_spr, world.player_spr.hurtPlayer, null, world.player_spr)


        this.setScale(0.5);
        this.enemyBullets = scene.physics.add.group({classType: EnemyBullet, runChildUpdate: false});
        this.enemyBullets.setX(xPos);
        this.enemyBullets.setY(yPos);
        scene.anims.createFromAseprite('witch');
        scene.add.existing(this);

        this.setBodySize(12, 16);
        this.setScale(0.5);
        this.setDepth(3);
        this.setOffset(14, 20);
        
        
    }

    shootAtPlayer(scene, world){
        
        this.setVelocity(0,0);

        var bullet = this.enemyBullets.get()
        if(bullet){
            bullet.fire(this.x, this.y, world.player_spr.x, world.player_spr.y);

            //Bullet Collide with Player
            scene.physics.add.overlap(bullet, world.player_spr, world.player_spr.hurtPlayer, null, world.player_spr);
            scene.physics.add.overlap(bullet, world.player_spr, bullet.bulletHitPlayer, null, bullet);

        }
        this.moving = false;
    }

    updateEnemy(scene, world){
        if(this.moving){
            this.play('witchrun', true);
        } else {
            this.play('witchidle', true);
        }


        if(this.awake == false){
            this.checkWakeRadius(world);
        }else if(this.awake && (scene.time.now > this.lastShot + this.shootDelay)){
            this.shootAtPlayer(scene, world);
            //this.shootAtPlayer(scene, world);
            //this.shootAtPlayer(scene, world);
            this.lastShot = scene.time.now;
        }else if(this.awake && (scene.time.now > this.lastMoved + this.moveDelay)){
            //this.wander();
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