import * as EnemySys from "../classes/enemyC.js";

export class LevelGen {
    constructor(scene, world, WorldGenerator){
        this.WorldGenData = WorldGenerator;

    }

    populateLevel(scene, world){
        this.addEnemies(world);
        //this.addDetail();
    }

    spawnWave(world){
        console.log("Added Enemies to Level");
        for(let i = 0; i < (8 + world.curWave); i++){
            var toAdd = Math.floor(Math.random() * 2);
            if(toAdd == 0){
                addEnemy(new EnemySys.Grunt());
            }else if (toAdd == 1){
                addEnemy(new EnemySys.Shooter());
            }
        }
    }
    
  

    addDetail(){
        console.log("Added Tile Details to Level");
    }

    //Returns a random floor tile from the level
    //ASK ALMAS
    getRandomFloor(){
        
    }

    


    
        

}