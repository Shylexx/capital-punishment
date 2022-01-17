export class Bullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'bullet');
        this.speed = 100;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setActive(true);
        this.setVisible(true);
        this.setScale(0.2, 0.2, true);
        this.type = "standard";
        this.bounced = false;
        scene.physics.add.existing(this);
    }//end of constructor

    fire(weapon, world){
        this.enableBody(true, weapon.x, weapon.y-5, true, true);
        this.body.setOffset(0, -10);
        this.setBodySize(16,12);
        this.setScale(0.4);
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

    bulletHitWall(){
        this.disableBody(true, true);
        this.bounced = false;
    }

    bulletHitEnemy(){
        this.disableBody(true,true);
    }


}

export class EnemyBullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'witchbolt');
        this.speed = 100;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setActive(true);
        this.setVisible(true);
        this.setScale(0.3, 0.3, true);
        scene.physics.add.existing(this);
    }//end of constructor

    fire(shooterX, shooterY, targetX, targetY){
        this.enableBody(true, shooterX, shooterY+5, true, true);
        this.setBodySize(12,10);
        this.setScale(0.4);
        this.setDepth(6);
        this.body.setOffset(4, 12);
        this.setRotation(Phaser.Math.Angle.Between(shooterX, shooterY, targetX, targetY));
        this.direction = Math.atan( (targetX-this.x) / (targetY-this.y));

        // Calculate X and y velocity of bullet to moves it from weapon to reticle
        if (targetY >= this.y)
        {
            this.setVelocity((this.speed)*Math.sin(this.direction),(this.speed)*Math.cos(this.direction));
        }
        else
        {
            this.setVelocity((-this.speed)*Math.sin(this.direction),(-this.speed)*Math.cos(this.direction));
        }

        this.born = 0; // Time since new bullet spawned
    }//end of fire()

    bulletHitWall(){
        this.disableBody(true, true);
    }

    bulletHitPlayer(){
        this.disableBody(true, true);
    }




}