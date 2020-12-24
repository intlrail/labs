// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/urR596FsU68

// module aliases
const Engine = Matter.Engine;
// Render = Matter.Render,
const World = Matter.World;
const Bodies = Matter.Bodies;

let engine;
let world;
let boxes = [];

let ground;

function setup() {
  createCanvas(1000, 1000);
  engine = Engine.create();
  world = engine.world;
  //Engine.run(engine);
  let options = {
    isStatic: true
  }
  ground = Bodies.rectangle(500, height, width, 100, options);

  World.add(world, ground);
}

// function keyPressed() {
//   if (key == ' ') {
//   }
// }

function mousePressed() {
  boxes.push(new Box(mouseX, mouseY, random(10, 40), random(100, 200)));
}

function draw() {
  background(0);
  Engine.update(engine);
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].show();
  }
  noStroke(255);
  fill(200);
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, width, 100);

}