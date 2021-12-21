export class Bullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'bullet');
        this.speed = 600;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setActive(true);
        this.setVisible(true);
        this.setScale(1, 1, true);
        this.type = "standard";
        this.bounces = 0;
    }//end of constructor

    fire(weapon, world){
        this.setPosition(weapon.x, weapon.y-5); // Initial position
        this.setScale(0.7);
        this.setActive(true)
        this.setVisible(true);
        this.setRotation(Phaser.Math.Angle.Between(world.player_spr.x, world.player_spr.y, world.reticle_spr.x, world.reticle_spr.y));
        this.direction = Math.atan( (world.reticle_spr.x-this.x) / (world.reticle_spr.y-this.y));

        // Calculate X and y velocity of bullet to moves it from weapon to reticle
        if (world.reticle_spr.y >= this.y)
        {
            this.setVelocity((this.speed+world.player_spr.stats.weaponShotSpeed)*Math.sin(this.direction),(this.speed+world.player_spr.stats.weaponShotSpeed)*Math.cos(this.direction));
        }
        else
        {
            this.setVelocity((-this.speed-world.player_spr.stats.weaponShotSpeed)*Math.sin(this.direction),(-this.speed-world.player_spr.stats.weaponShotSpeed)*Math.cos(this.direction));
        }

        this.born = 0; // Time since new bullet spawned
    }//end of fire()

    update(time, delta){

    }// end up updateBullet()

    bulletDie(){
        console.log("Bullet Died");
        this.setActive(false);
        this.setVisible(false);
        this.setVelocity(0,0);

    }

    bulletHitWall(){
        console.log("Bullet Hit Wall");
        this.bulletDie();
    }

    /* bounceBulletHitWall(){
        console.log("Bouncing Bullet hit wall");
        this.bounces++
        if(this.bounces > 3){
            this.bulletDie();
        }
    } */

}