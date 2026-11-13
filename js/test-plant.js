
// import { Peashooter } from "./entities/Peashooter.js";

// const plant = new Peashooter(2, 3);

// console.log("Name:", plant.name);
// console.log("Health:", plant.health);
// console.log("Cost:", plant.cost);
// console.log("Position:", plant.getPosition());
// console.log("Damage:", plant.getAttackDamage());

// console.log("Attack after 1 second:", plant.update(1));
// console.log("Attack after another 1 second:", plant.update(1));



// js/test-plant.js

// import { Sunflower } from "./entities/Sunflower.js";

// const sunflower = new Sunflower(1, 2);

// console.log("Name:", sunflower.name);
// console.log("Health:", sunflower.health);
// console.log("Cost:", sunflower.cost);

// console.log("After 4 seconds:", sunflower.update(4));
// console.log("After another 3 seconds:", sunflower.update(3));
// console.log("After another 1 second:", sunflower.update(1));
// console.log("After another 16 seconds:", sunflower.update(16));


// js/test-plant.js

import { WallNut } from "./entities/WallNut.js";

const wallnut = new WallNut(2, 4);

console.log("Name:", wallnut.name);
console.log("Cost:", wallnut.cost);
console.log("Initial health:", wallnut.health);

wallnut.takeDamage(100);

console.log("After 100 damage:", wallnut.health);

wallnut.takeDamage(200);

console.log("After another 200 damage:", wallnut.health);

wallnut.takeDamage(300);

console.log("After final 300 damage:", wallnut.health);
console.log("Is alive:", wallnut.alive);

console.log("Defense:", wallnut.getDefenseStatus());
