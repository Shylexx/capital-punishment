export class Player extends Phaser.Physics.Arcade.Sprite {
    stats = {
        //Basic Stats
        maxHP: 10,
        curHP: 10,
        moveSpeed: 100,

        weaponDmg: 10,
        weaponFireRate: 0,
        weaponShotSpeed: 1,
    }

    weapon = {
        //Set Up weapon properties
        curWeapon: null,
        nonCurWeapon: null,
        mainWeapon: null,
        offWeapon: null,
        mainAmmo: null,
        offAmmo: null,
        firing: null,
    }

    items = {
        itemInv: [],
    }

    constructor(scene, xPos, yPos, texture) {
        super(scene, xPos, yPos, texture);
        this.score = 0;
        this.cursorPos = null;
        this.facing = null;
        this.idle = true;

        


    
        // had to do this to create a physics body
        scene.physics.add.existing(this);
        //set up the physics properties
        this.setCollideWorldBounds(true);

        //Add the Animations to the scene
        scene.anims.createFromAseprite('janitor');

        // Add this to the scene to make it visible/active etc
        scene.add.existing(this);


    } // end of constructor()

    updatePlayer(world){
        //Flip Player Sprite based on reticle
        if(world.reticle_spr.x < this.x){
            this.flipX = true;
            this.facing = "left";
        }else{
            this.flipX = false;
            this.facing = "right";
        }

        // Check the keys and update movement if required
        this.play('idle2', true);
        
        if (world.moveKeys.A.isDown) {
            this.moveLeft();
        }  else if (world.moveKeys.D.isDown) {
            this.moveRight();
        }  else {
            this.setVelocityX(0);
        
        }
        if (world.moveKeys.W.isDown) {
            this.moveUp();
        }  else if (world.moveKeys.S.isDown) {
            this.moveDown();
        } else  {
            this.setVelocityY(0);
            
        }

    
    }

    
    
    //movement methods
    moveLeft() {
        //this.anims.play('walkLeft',true);
        this.setVelocityX(-150);
        //this.x -= 1;
    } // end of moveLeft()

    moveRight() {
        //this.anims.play('walkRight',true);
        this.setVelocityX(150);
        //this.x += 1;
    } // end of moveRight()

    moveUp() {
       // this.anims.play('walkUp',true);
        this.setVelocityY(-150);
        //this.y -= 1;
    } // end of moveUp()
    moveDown() {
        //this.anims.play('walkDown', true);
        this.setVelocityY(150);
        //this.y += 1;
    } // end of moveDown()

    standStill() {
       // this.setFrame(0);
        this.setVelocity(0, 0)

    } //end of standStill()

    pickupWeapon(newWep){
        if (newWep.weaponVars.weaponType == "main"){
            if(this.weapon.curWeapon == this.weapon.mainWeapon){
                this.weapon.curWeapon = newWep;
            }
            this.weapon.mainWeapon.setDropped();
            this.weapon.mainWeapon = newWep;
            this.weapon.mainWeapon.setInInv();
            
        } else {
            if(this.weapon.curWeapon == this.weapon.offWeapon){
                this.weapon.curWeapon = newWep;
            } else{
                this.weapon.nonCurWeapon = newWep;
            }
            this.weapon.offWeapon.setDropped();
            this.weapon.offWeapon = newWep;
            this.weapon.offWeapon.setInInv();
            if(this.weapon.curWeapon == this.weapon.offWeapon){
                this.weapon.curWeapon = newWep;
            }
        }
        
        
    }

    fireWeapon(scene, world){
        if (this.weapon.curWeapon.weaponVars.fireMode == "auto"){
            this.weapon.firing = true;
        } else{
            this.weapon.curWeapon.fire(scene, world);
        }
        
    } //end of fireWeapon()

    stopFiring(){
        this.weapon.firing = false;
    }

    getFiring(){
        return this.weapon.firing;
    }

    swapWeapons(){
        if(this.weapon.nonCurWeapon.name != "empty"){
            this.weapon.firing = false;
            var tempWeapon = this.weapon.curWeapon;
            this.weapon.curWeapon.weaponVars.curWeapon = false;
            this.weapon.curWeapon = this.weapon.nonCurWeapon;
            this.weapon.nonCurWeapon = tempWeapon;
            this.weapon.curWeapon.setDepth(6);
            this.weapon.curWeapon.rotation = 0;
            this.weapon.curWeapon.weaponVars.curWeapon = true;
            this.weapon.nonCurWeapon.setDepth(2);
            this.weapon.nonCurWeapon.rotation = -90;
            
        }
    }

} // end of Player class
