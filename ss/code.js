speed(99.9);
penColor("#000000");
dot(50000);
makeBackground();
var probRegSpaceship = 75; //the probability that any given spaceship is a regular spaceship
var probUFO = 34; //the probability that any given spaceship is a ufo
var probNyanCat = 1; //the probability that any given spaceship is a nyan cat
drawPlanet(100,25,50,"earth");
drawPlanet(100,200,150,"neptune");
drawPlanet(150,50,300,"saturn");
drawPlanet(100,50,200,"jupiter");
//call all stars
makeAllStars();
drawPlanets(randomNumber(5,6));
function drawSmallPlanet() {
  penUp();
  moveTo(randomNumber(50, 300), randomNumber(50, 400));
  penRGB(randomNumber(20, 255), randomNumber(20, 255), randomNumber(20, 255),1);
  dot(randomNumber(20, 30));
  penUp();
  moveTo(500,500);
}
function drawPlanets(amount) {
for (var i = 0; i < amount; i++) {
    drawSmallPlanet();
  }
}
function drawPlanet(size,x,y,type) {
  penUp();
  moveTo(x,y);
  if(type=="earth"){
    var url="http://oreigdor.github.io/638831main_globe_east_2048.png";
  }else if(type==="neptune"){
    var url="http://oreigdor.github.io/Neptune_Full.png";
  } else if(type==="saturn"){
    var url="http://oreigdor.github.io/38_saturn_1600x900.png";
  } else if(type==="jupiter") {
    var url="http://oreigdor.github.io/330px-Jupiter_and_its_shrunken_Great_Red_Spot.png";
  }
  image(type, url);
  setPosition(type, x, y, size, size);
}


//create function to make all stars in the scene
function makeAllStars(){
  for (var i=0; i<100; i++) {
    penUp();
    penRGB(randomNumber(150,255), randomNumber(200,255), randomNumber(200,255));
    moveTo(randomNumber(0,320), randomNumber(0,450));
    penDown();
    dot(randomNumber(2,5));
  }
}
//call background
function makeBackground(){
  penDown();
  penRGB(0,0,0,1);
  dot(9000);
  
//call background light/color beams
makeAllColors();
  
}

//create function to draw all beams of light/color
function makeAllColors(){
  for (var i=0; i<100; i++){
    moveTo(randomNumber(0,320), randomNumber(0,500));
    turnTo(randomNumber(90,180));
    drawSpaceLights(randomNumber(100,400));
  }
}

//create beams of light/color to put in space scene - completely black background is too bland
function drawSpaceLights(size){
  penDown();
  penWidth(randomNumber(60,80));
  penRGB(40,25,77,0.1);
  moveForward(size);
  penUp();
}
//Make a spaceship
function drawSpaceship(){
  var typeDeterminer = randomNumber(0,100); //Set variable which will be used to determine which type of spaceship appears based on preset probabilities.
  if(typeDeterminer<probRegSpaceship){
    hideElement("spaceship");
    image("spaceship","http://oreigdor.github.io/regSS.png");
    hideElement("spaceship");
  } else if(typeDeterminer>probRegSpaceship&&typeDeterminer<(probRegSpaceship+probNyanCat)){
    hideElement("spaceship");
    image("spaceship","http://oreigdor.github.io/nyanCat.png");
    hideElement("spaceship");
  } else {
    hideElement("spaceship");
    image("spaceship","http://oreigdor.github.io/ufo.png");
    hideElement("spaceship");
  }
}
//make spaceships (supporting code so that there aren't function declarations within a loop)
var dss=function(){
  drawSpaceship();
  var size = randomNumber(25,75);
  var side = Math.round(randomNumber(0,1));
  var ypos = randomNumber(0,450);
  if(side===0){
    setPosition("spaceship",0,ypos,size,size);
    showElement("spaceship");
    for(var qw=0;qw<16;qw++){
      setPosition("spaceship",(qw*20),ypos,size,size);
    }
  } else {
    setPosition("spaceship",300,ypos,size,size);
    showElement("spaceship");
    for(var qqqqqwqqq=0;qqqqqwqqq<16;qqqqqwqqq++){
      setPosition("spaceship",320-(qqqqqwqqq*20),ypos,size,size);
    }
  }
  deleteElement("spaceship");
};
//Make Spaceships
for (var i = 0; i < 1000; i++) {
  setTimeout(dss,randomNumber(1000,10000));
}