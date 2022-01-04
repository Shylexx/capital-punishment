import * as Pickups from "../classes/weaponPickups.js";

export class LevelGen {
    constructor(scene, world, WorldGenerator){
        this.WorldGenData = WorldGenerator;

    }

    populateLevel(scene, world, gameVars){
        this.addEnemies();
        this.addDetail();
        this.addLoot(scene, world, 2);
    }

    addEnemies(){
        console.log("Added Enemies to Level");
    }

    addLoot(){

    }

    addDetail(){
        console.log("Added Tile Details to Level");
    }

    makeEnemySpawns(){
        console.log("Spawned Enemies");
    }


    
        

}