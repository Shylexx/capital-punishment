import * as Pickups from "../classes/weaponPickups.js";

export class LevelGen {
    constructor(scene, world, WorldGenerator){
        this.WorldGenData = WorldGenerator;

    }

    populateLevel(scene, world, gameVars){
        this.addEnemies();
        //this.addDetail();
    }

    addEnemies(){
        console.log("Added Enemies to Level");
    }
  

    addDetail(){
        console.log("Added Tile Details to Level");
    }

    makeEnemySpawns(){
        console.log("Spawned Enemies");
    }


    
        

}