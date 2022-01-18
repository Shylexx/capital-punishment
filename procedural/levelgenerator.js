import * as EnemySys from "../classes/enemyC.js";

export class LevelGen {
    constructor(scene, world, WorldGenerator){
        this.WorldGenData = WorldGenerator;
    }

    //Spawn New Enemies based on Current Wave
    spawnWave(scene, world){
        for(let i = 0; i < (8 + world.curWave); i++){
            var toAdd = Math.floor(Math.random() * 2);
            var spawnLoc = this.getRandomFloor(world);
            if(toAdd == 0){
                this.addEnemy(scene, world, new EnemySys.Grunt(scene, spawnLoc.spawnX*16, spawnLoc.spawnY*16, world));
            }else if (toAdd == 1){
                this.addEnemy(scene, world, new EnemySys.Shooter(scene, spawnLoc.spawnX*16, spawnLoc.spawnY*16, world));
            }
            
        }
    }

    //Returns a random floor tile from the world array
    //Incredibly inefficient, but thank god my phaser game is still fairly small
    getRandomFloor(world){
        var x;
        var y;
        while(true){
            x = Math.floor(Math.random() * (world.COLUMNS));
            y = Math.floor(Math.random() * (world.ROWS));
            if (world.wallAry[x][y] == 0){
                break;
            }
        }
        return {spawnX: x,
        spawnY: y};
    }

    //Adds new enemy to level array
    addEnemy(scene, world, enemy){
        world.enemyAry.push(enemy);
        scene.add.existing(enemy);
    }
    


    
        

}