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
    }//end of constructor

    fire(shooter, world){
        this.setPosition(shooter.x, shooter.y-5); // Initial position
        this.setScale(0.7);
        this.setActive(true)
        this.setVisible(true);
        this.setRotation(Phaser.Math.Angle.Between(world.player_spr.x, world.player_spr.y, world.reticle_spr.x, world.reticle_spr.y));
        this.direction = Math.atan( (world.reticle_spr.x-this.x) / (world.reticle_spr.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to reticle
        if (world.reticle_spr.y >= this.y)
        {
            //this.xSpeed = this.speed*Math.sin(this.direction);
            //this.ySpeed = this.speed*Math.cos(this.direction);
            this.setVelocity((this.speed+world.player_spr.stats.weaponShotSpeed)*Math.sin(this.direction),(this.speed+world.player_spr.stats.weaponShotSpeed)*Math.cos(this.direction));
        }
        else
        {
            //this.xSpeed = -this.speed*Math.sin(this.direction);
            //this.ySpeed = -this.speed*Math.cos(this.direction);
            this.setVelocity((-this.speed-world.player_spr.stats.weaponShotSpeed)*Math.sin(this.direction),(-this.speed-world.player_spr.stats.weaponShotSpeed)*Math.cos(this.direction));
        }

        //this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    }//end of fire()

    update(time, delta){
        /* this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta; */
        //this.body.reset();
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }// end up updateBullet()

    bulletDie(){
        console.log("Bullet Died F1");
        //this.setActive(false);
        //this.setVisible(false);
    }
    bulletDie2(){
        console.log("Bullet Died F2");
        //this.setActive(false);
        //this.setVisible(false);
    }
    bulletDie3(){
        console.log("Bullet Died F3");
        /* this.setActive(false);
        this.setVisible(false); */
    }
}