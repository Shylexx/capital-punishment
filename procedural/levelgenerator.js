export class LevelGen {
    constructor(scene){
        this.scene = scene;
    }

    populateLevel(scene, world, gameVars){
        this.addEnemies();
        this.addDetail();
        this.addLoot();
    }

    addEnemies(){
        console.log("Added Enemies to Level");
    }

    addLoot(){
        console.log("Added Weapon Pickups to Level");
    }

    addDetail(){
        console.log("Added Tile Details to Level");
    }

    makeEnemySpawns(){
        console.log("Spawned Enemies");
    }

}