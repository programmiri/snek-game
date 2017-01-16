function start() {

/***************************
 * Setting the state
 **************************/

  const canvas = document.getElementById('js-snake-canvas');
  const scoreDisplay = document.getElementsByClassName('js-score')[0];
  const gameOverDisplay = document.getElementsByClassName('game-over')[0];
  const ctx = canvas.getContext('2d');

  let gameIsOver = false;
  let score = 0;
  let keypressed = null;
  let gameLoopCounter = 0;


  let tiles = [];

  let snek = {
    velocity: { x: 0, y: 0 },
    tiles: [] , // that's the tile for the start of
    color: '#364421'
  };

  let snack = {
    tile: null,
    color: 'grey'
  };

/***************************************
 * Function for and with tiles
 ***************************************/

  function buildTile(x, y) { // grid x y, not pixel!
    return {
      width: 12.5,
      height: 12.5,
      x: x,
      y: y,
      snake: null,
      food: null,
      // body: null
    };
  }

  // find the tile with GRID x + y
  function findTile(x,y) {
    return tiles.find(function(tile){
      return tile.x == x && tile.y == y;
    });
  }

  function getRandomTile() {
    let randomTilePosition = Math.floor(tiles.length * Math.random());
    let randomTile = findTile(tiles[randomTilePosition].x, tiles[randomTilePosition].y);
    if (randomTile.snake || randomTile.food) {
      getRandomTile();
    }
    return randomTile;
  }

  function setSnekOnTile(tile, doesSnekGrow) {
    if (!doesSnekGrow) unsetSneksTail(snek.tiles);
    snek.tiles.unshift(tile);
    tile.snake = true;
  }

  function unsetSneksTail(snekArray) {
    snekArray[snekArray.length-1].snake = false;
    snekArray.pop();
  }

  function setFoodOnTile(snack, tile) {
    let oldTile = snack.tile;
    if (oldTile) oldTile.food = false;
    snack.tile = tile;
    tile.food = true;
  }

// fill the tiles array (width+height 10 x 50 = 500 500 canvas)
  function setTiles(tiles) {
    for(let x = 0; x < 28; x++) {
      for(let y = 0; y < 28; y++) {
        let tile = buildTile(x, y);
        tiles.push(tile); // filling the array
      }
    }
  }

  function renderTiles(tiles, ctx) {
    tiles.forEach(function(tile) {
      if (tile.snake) {
        ctx.strokeStyle = snek.color;
        ctx.fillStyle = snek.color;
        ctx.fillRect(tile.x * tile.width, tile.y * tile.height, tile.width, tile.height);
      } else if (tile.food) {
        ctx.strokeStyle = '#c9daaf';
        ctx.fillStyle = snack.color;
        ctx.fillRect((tile.x * tile.width)+2, (tile.y * tile.height)+2, tile.width-4, tile.height-4);
      } else {
        ctx.strokeStyle = '#c9daaf';
      }
      ctx.strokeRect(tile.x * tile.width, tile.y * tile.height, tile.width, tile.height);
    });
  }

  /*************************
   * Control the Game
   *************************/

  //define what's "keypressed" for control

  document.addEventListener('keydown', function(e) {
    if (!e.metaKey && !e.shiftKey) e.preventDefault();
    keypressed = e.which;
  });
  document.addEventListener('keyup', function(e) {
    if (!e.metaKey && !e.shiftKey) e.preventDefault();
    keypressed = null;
  });

  function waitForSpace(keypressed) {
    if (keypressed == 32) {
      location.reload();
    }
  }

  function followKeyInputs(keypressed) {   // where to go when keypressed?
    let step = 1;
    if (gameIsOver) {
      snek.velocity.x = 0;
      snek.velocity.y = 0;
      return;
    }
    if (keypressed == 40) {// down
      snek.velocity.x = 0;
      snek.velocity.y = step;
      }
    if (keypressed == 39) { // right
      snek.velocity.x = step;
      snek.velocity.y = 0;
      }
    if (keypressed == 38) { // up
      snek.velocity.x = 0;
      snek.velocity.y = -step;
      }
    if (keypressed == 37) { //left
      snek.velocity.x = -step;
      snek.velocity.y = 0;
    }
  }

/************************************
 * End the Game
 ***********************************/

  function endTheGame() {
    gameOverDisplay.style.visibility = 'visible';
    waitForSpace(keypressed);
  }


/************************************
 * Updating
 ***********************************/

  function updatePosition(snekHead, tiles) {
    let currX = snekHead.x;
    let currY = snekHead.y;
    let newPosX = currX + snek.velocity.x;
    let newPosY = currY + snek.velocity.y;
    let newTile = findTile(newPosX, newPosY);
    if (!newTile || (newTile.snake && snek.tiles.length > 1)) {
      gameIsOver = true;
      return;
    }
    if (newTile.food) {
      setFoodOnTile(snack, getRandomTile());
      setSnekOnTile(newTile, true);
      score++;
      console.dir(currY + ' ' + newPosY + ' ' + currX + ' ' + newPosX);
      return;
    }
    if (currX != newPosX || currY != newPosY) {
      setSnekOnTile(newTile, false);
    }
  }

function updateScoreDisplay(score, scoreDisplay) {
  scoreDisplay.innerHTML = 'Score: ' + score;
}


/****************************
 * Let the Game begin
 ***************************/
// First Setup

  function firstSetup() {
    setTiles(tiles); // first setup
    setSnekOnTile(findTile(0,0), true);
    setFoodOnTile(snack, getRandomTile());
    updateScoreDisplay(0, scoreDisplay);
  }

firstSetup();

/*************************
 * GAME LOOP
 * tick tick tick
 * update - render - reset
 *************************/

  function tick() {
    gameLoopCounter++;
    if (gameLoopCounter % 5 == 0) { // pace
      ctx.clearRect(0,0,canvas.width,canvas.height);
      followKeyInputs(keypressed);
      updatePosition(snek.tiles[0], tiles);
      updateScoreDisplay(score, scoreDisplay);
      if (gameIsOver == true) endTheGame();
      renderTiles(tiles, ctx);
    }
    window.requestAnimationFrame(tick);
 }
 window.requestAnimationFrame(tick);
}
