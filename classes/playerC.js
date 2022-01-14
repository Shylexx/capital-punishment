import { WeaponPickup } from "./weaponPickups.js";
import { Bullet } from "./bulletC.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
    stats = {
        //Basic Stats
        curHP: 50,
        moveSpeed: 75,

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

        bulletGroup: null,
    }

    items = {
        itemInv: [],
    }

    constructor(scene, xPos, yPos, texture) {
        super(scene, xPos, yPos, texture);

        this.cursorPos = null;
        this.overlapping = false;
        this.facing = null;
        this.idle = true;

        //Create Bullet Group
        this.weapon.bulletGroup = scene.physics.add.group({classType: Bullet, runChildUpdate: false});
        this.weapon.bulletGroup.setX(xPos);
        this.weapon.bulletGroup.setY(yPos);

        
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
        if (this.body.velocity.x == 0 && this.body.velocity.y == 0){
        this.play('idle', true);
        } else {
            this.play('walk', true);
        }
        
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

        //If currently on a weapon pickup, check for when we leave the pickup
        if(this.overlapping != false){
            this.overlapping.checkEndOverlap(this);
        }

    
    }

    
    
    //movement methods
    moveLeft() {
        //this.anims.play('walkLeft',true)
        this.setVelocityX(-this.stats.moveSpeed);
        //this.x -= 1
    } // end of moveLeft()

    moveRight() {
        //this.anims.play('walkRight',true)
        this.setVelocityX(this.stats.moveSpeed);
        //this.x += 1
    } // end of moveRight()

    moveUp() {
       // this.anims.play('walkUp',true)
        this.setVelocityY(-this.stats.moveSpeed);
        //this.y -= 1
    } // end of moveUp()
    moveDown() {
        //this.anims.play('walkDown', true)
        this.setVelocityY(this.stats.moveSpeed);
        //this.y += 1
    } // end of moveDown()

    standStill() {
       // this.setFrame(0)
        this.setVelocity(0, 0)

    } //end of standStill()


    pickupWeapon(world){

        var pickup = this.overlapping;

        if (pickup.weaponStored.weaponVars.weaponType == "main"){
            //Create Pickup Of Dropped Weapon
            if (this.weapon.mainWeapon != null){
                this.weapon.mainWeapon.createPickup(world);
            }
            //this.scene.add.existing(new WeaponPickup(this.scene, this.x, this.y, this.weapon.mainWeapon, this));
            
            //Add Weapon to Player
           
                if(this.weapon.mainWeapon != null && this.weapon.curWeapon == this.weapon.mainWeapon){
                    this.weapon.curWeapon = pickup.weaponStored;
                    this.weapon.mainWeapon = this.weapon.curWeapon
                    this.weapon.curWeapon.setDepth(6);
                    this.weapon.curWeapon.weaponVars.curWeapon = true;
                } else{
                    this.weapon.nonCurWeapon = pickup.weaponStored;
                    this.weapon.mainWeapon = this.weapon.nonCurWeapon;
                    this.weapon.nonCurWeapon.setDepth(2);
                    this.weapon.nonCurWeapon.rotation = -90;
                }
                this.weapon.mainWeapon.enableBody(false,this.x,this.y.true,true).setActive(true).setVisible(true);
        
            
            

            //Destroy Pickup
            pickup.disableBody(true, true).destroy();

            
            
        } else if (pickup.weaponStored.weaponVars.weaponType == "off") {
            //Create Pickup Of Dropped Weapon
            if(this.weapon.offWeapon != null){
                this.weapon.offWeapon.createPickup(world);
            }
            //this.scene.add.existing(new WeaponPickup(this.scene, this.x, this.y, this.weapon.offWeapon));
            
            //Add Weapon to Player
            if(this.weapon.curWeapon == this.weapon.offWeapon){
                this.weapon.curWeapon = pickup.weaponStored;
                this.weapon.curWeapon.setDepth(6);
                this.weapon.curWeapon.weaponVars.curWeapon = true;
            } else {
                this.weapon.nonCurWeapon = pickup.weaponStored;
                this.weapon.curWeapon.setDepth(2);
                this.weapon.nonCurWeapon.rotation = -90;
            }
            this.weapon.offWeapon = pickup.weaponStored;
            this.weapon.offWeapon.enableBody(false,this.x,this.y, true, true).setActive(true).setVisible(true);

            //Destroy Pickup
            pickup.disableBody(true, true).destroy();
        }
        this.clearOverlap();
        
        
    }

    clearOverlap(){
        this.overlapping = false;
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
        if(this.weapon.nonCurWeapon != null){
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

    hurtPlayer(){
        this.stats.curHP--;
        console.log(this.stats.curHP);
    }

} // end of Player class
