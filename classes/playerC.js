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

    //Obsolete array of the player's current items
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

        this.setBodySize(16, 16);
        this.setScale(0.5);
        this.setDepth(3);
        this.setOffset(8, 10);

        this.playerHurt = scene.sound.add('playerhurt');


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
        
        //Movement
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
            if(world.moveKeys.E.isDown){
                this.pickupWeapon(world);
            }
        }

    
    }

    
    
    //movement methods
    moveLeft() {
        this.setVelocityX(-this.stats.moveSpeed);
    } // end of moveLeft()

    moveRight() {
        this.setVelocityX(this.stats.moveSpeed);
    } // end of moveRight()

    moveUp() {
        this.setVelocityY(-this.stats.moveSpeed);
    } // end of moveUp()
    moveDown() {
        this.setVelocityY(this.stats.moveSpeed);
    } // end of moveDown()

    standStill() {
        this.setVelocity(0, 0)

    } //end of standStill()

    //Pick up weapon from ground Pickup sprite
    pickupWeapon(world){

        var pickup = this.overlapping;

        if (pickup.weaponStored.weaponVars.weaponType == "main"){
            //Create Pickup Of Dropped Weapon
            if (this.weapon.mainWeapon != null){
                this.weapon.mainWeapon.createPickup(world);
            }

            
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
                this.weapon.mainWeapon.setActive(true).setVisible(true);
        
            
            

            //Destroy Pickup
            pickup.disableBody(true, true).destroy();

            
            
        } else if (pickup.weaponStored.weaponVars.weaponType == "off") {
            //Create Pickup Of Dropped Weapon
            if(this.weapon.offWeapon != null){
                this.weapon.offWeapon.createPickup(world);
            }

            
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
            this.weapon.offWeapon.setActive(true).setVisible(true);

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

    //Swap current to main or off weapon
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
    
    //Decrement the player's HP
    hurtPlayer(){
        this.stats.curHP--;
        this.playerHurt.play({volume:0.3});
    }

} // end of Player class
