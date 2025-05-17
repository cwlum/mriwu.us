(function(namespace) {
	var DEFAULT_COLOUR = "#f0f0f0"; /* Light text for game elements */
	var BACKGROUND_COLOUR = "#232323"; /* Dark background for canvas */
	var INITIAL_OFFSET_SPEED = 0.3; 
	var MAX_OFFSET_SPEED = 0.8;
	var SPEED_INCREASE_RATE = 0.00005; // How much speed increases per unit of offset
	var MAX_TIME_TICK = 1000 / 60; // Target 60 FPS
	var SCREEN_BUFFER = 50;
	var GROUND_BUFFER = 10;
	var SPACE_BAR_CODE = 32;
	var MIN_CACTUS_DISTANCE = 350; 
	var MIN_BIRD_DISTANCE = 600; // Slightly increase initial bird distance
	// var OBSTACLE_MIN_GAP_FACTOR = 0.7; // Removing this for now, simplifying spacing
	var BIRD_SPAWN_SCORE_THRESHOLD = 500; // Set back to 500
	var EASTER_EGG_SCORE_THRESHOLD = 1000; 
	var EASTER_EGG_COLOUR = "#e87722"; // Theme orange for Easter egg

	var spaceJustPressed = false; 
	var spaceIsCurrentlyPressed = false; 

	function keydown(e) {
        if (e.keyCode === SPACE_BAR_CODE) {
			if (!spaceIsCurrentlyPressed) { 
				spaceJustPressed = true; // Mark that a new press has started
			}
			spaceIsCurrentlyPressed = true;
        }
    }

    function keyup(e) {
        if (e.keyCode === SPACE_BAR_CODE) {
			spaceIsCurrentlyPressed = false;
			if (gameInstance && gameInstance.player) { // Notify dino that key is released
				gameInstance.player.jumpReleased();
			}
        }
    }

	document.addEventListener('keydown', keydown, false);
	document.addEventListener('keyup', keyup, false);

	function Game(options) {
		this.canvas = options.el;
		this.context = this.canvas.getContext("2d");
		this.gameOverCallback = options.gameOverCallback || function() {};
		this.gameStartCallback = options.gameStartCallback || function() {};
		// Set canvas base dimensions - will be scaled by CSS
		this.canvas.width = 800;
		this.canvas.height = 300; // Increased height

		this.cacti = [];
		this.birds = []; 
		this.nextCactus = 0;
		this.nextBird = MIN_BIRD_DISTANCE * 1.5; 
		this.lastObstacleType = null; // 'cactus' or 'bird'
		this.offset = 0;
		this.currentSpeed = INITIAL_OFFSET_SPEED;
		this.lastTick = null;
		this.running = false;
		this.finished = false;
		this.easterEggActive = false;

		this.initObjects();
		this.draw();
		requestAnimationFrame(this.step.bind(this));
	}

	Game.prototype.initObjects = function() {
		this.player = new Dinosaur({
			left: 50, 
			bottom: this.canvas.height - GROUND_BUFFER, 
			colour: this.easterEggActive ? EASTER_EGG_COLOUR : DEFAULT_COLOUR
		});

		// Initialize background with default ground color
		this.background = new Background({
			width: this.canvas.width, 
			height: this.canvas.height,
			colour: DEFAULT_COLOUR 
		});
		// If easter egg is already active (e.g. on a quick restart after hitting threshold), update colors
		if (this.easterEggActive) {
			this.background.updateColours(EASTER_EGG_COLOUR, EASTER_EGG_COLOUR); // Gold ground, gold clouds
		}


		this.score = new ScoreBoard({
			left: this.canvas.width - 20, 
			bottom: 30, 
			colour: this.easterEggActive ? EASTER_EGG_COLOUR : DEFAULT_COLOUR
		});
	};

	Game.prototype.updateCacti = function() {
		while (this.offset > this.nextCactus) {
			var count = Math.floor(rand(1, 3.9)), // Number of cacti in a group
				// Adjusted scale for potentially taller cacti
				scale = rand(0.9, 1.7), 
				x = this.canvas.width + this.offset + SCREEN_BUFFER;

			while (count--) {
				this.cacti.push(new Cactus({
					left: x + (count * 20 * scale), 
					bottom: this.canvas.height - GROUND_BUFFER,
					scale: scale, 
					// Adjusted random sizes for taller parts
					leftSize: rand(0.7, 1.8), 
					rightSize: rand(0.7, 1.8), 
					centerSize: rand(0.7, 1.8),
					colour: DEFAULT_COLOUR
				}));
			}
			this.lastObstacleType = 'cactus';
			this.nextCactus = this.offset + rand(MIN_CACTUS_DISTANCE, this.canvas.width + this.offset * 0.1); // Make spawn distance increase slightly with offset
		}
	};

	Game.prototype.removeOldCacti = function() {
		var count = 0; // used to force cacti off the screen

		while (this.cacti.length > count && this.cacti[count].x < this.offset - SCREEN_BUFFER) { 
			count++; 
		}

		this.cacti.splice(0, count);
	};

	Game.prototype.updateBirds = function() {
		var currentScore = Math.floor(this.offset * 0.1);
		if (currentScore < BIRD_SPAWN_SCORE_THRESHOLD) {
			return; // Don't spawn birds until threshold is met
		}

		while (this.offset > this.nextBird) {
			this.birds.push(new Bird({
				left: this.canvas.width + this.offset + SCREEN_BUFFER,
				bottom: this.canvas.height - GROUND_BUFFER, 
				colour: DEFAULT_COLOUR
			}));
			this.lastObstacleType = 'bird';
			this.nextBird = this.offset + rand(MIN_BIRD_DISTANCE, this.canvas.width * 1.5 + this.offset * 0.1); // Make spawn distance increase slightly
		}
	};

	Game.prototype.removeOldBirds = function() {
		var count = 0;
		while (this.birds.length > count && this.birds[count].x < this.offset - SCREEN_BUFFER) {
			count++;
		}
		this.birds.splice(0, count);
	};

	Game.prototype.draw = function() {
		this.clear(); 

		this.background.draw(this.context, this.offset);

		for (var i = 0; i < this.cacti.length; i++) {
			this.cacti[i].draw(this.context, this.offset);
		}
		for (var i = 0; i < this.birds.length; i++) {
			this.birds[i].draw(this.context, this.offset);
		}

		this.player.draw(this.context, this.offset);
		this.score.draw(this.context, this.offset);
	};

	Game.prototype.checkCollision = function() { // Renamed from checkCactusHit
		for (var i = 0; i < this.cacti.length; i++) {
			if (this.player.collidesWith(this.cacti[i], this.offset)) {
				this.running = false;
				this.finished = true;
				this.player.wideEyed = true;
				this.gameOverCallback(Math.floor(this.offset * 0.1)); 
				return;
			}
		}
		for (var i = 0; i < this.birds.length; i++) {
			if (this.player.collidesWith(this.birds[i], this.offset)) {
				this.running = false;
				this.finished = true;
				this.player.wideEyed = true;
				this.gameOverCallback(Math.floor(this.offset * 0.1));
				return;
			}
		}
	};

	Game.prototype.clear = function() {
		this.context.fillStyle = BACKGROUND_COLOUR;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	};

	Game.prototype.step = function(timestamp) {
		if (this.running && this.lastTick) {
			var timeElapsed = Math.min((timestamp - this.lastTick), MAX_TIME_TICK);
			
			// Progressive speed
			if (this.currentSpeed < MAX_OFFSET_SPEED) {
				this.currentSpeed += SPEED_INCREASE_RATE * timeElapsed; // Increase speed based on time
				this.currentSpeed = Math.min(this.currentSpeed, MAX_OFFSET_SPEED); // Cap speed
			}
			this.offset += timeElapsed * this.currentSpeed;


			this.player.updatePhysics(timeElapsed, spaceIsCurrentlyPressed); 

			this.removeOldCacti();
			this.updateCacti();
			this.removeOldBirds();
			this.updateBirds();

			// Check for Easter egg activation
			var currentScore = Math.floor(this.offset * 0.1);
			if (!this.easterEggActive && currentScore >= EASTER_EGG_SCORE_THRESHOLD) {
				this.easterEggActive = true;
				this.player.colour = EASTER_EGG_COLOUR;
				this.background.updateColours(EASTER_EGG_COLOUR, EASTER_EGG_COLOUR); // Theme orange ground and clouds
				this.score.colour = EASTER_EGG_COLOUR;
			} else if (this.easterEggActive && currentScore < EASTER_EGG_SCORE_THRESHOLD) {
				// This case handles if score somehow drops below threshold, though not typical
				// Or when game restarts and score is 0.
				this.easterEggActive = false;
				this.player.colour = DEFAULT_COLOUR;
				this.background.updateColours(DEFAULT_COLOUR, DEFAULT_CLOUD_COLOUR); 
				this.score.colour = DEFAULT_COLOUR;
			}
			
			if (spaceJustPressed) {
				this.player.jumpPressed(); // Use new method
				spaceJustPressed = false; 
			}

			this.checkCollision(); 
			this.draw();
		} else if (spaceJustPressed && !this.running && this.finished) { // Restart game
			this.cacti = [];
			this.birds = []; 
			this.nextCactus = 0;
			this.nextBird = MIN_BIRD_DISTANCE * 1.5; 
			this.lastObstacleType = null;
			this.offset = 0;
			this.currentSpeed = INITIAL_OFFSET_SPEED; 
			this.running = true;
			this.finished = false;
			this.easterEggActive = false; // Reset Easter egg
			
			// Re-initialize objects to reset their colors
			this.initObjects(); 
			
			this.player.currentY = this.player.groundY; 
			this.player.velocityY = 0;
			this.player.jumpsRemaining = 2;
			this.player.isGrounded = true;
			this.player.wideEyed = false;
			
			this.gameStartCallback(); 

			spaceJustPressed = false; 
		} else if (spaceJustPressed && !this.running && !this.finished) { // Start game for the first time
			this.running = true;
			this.easterEggActive = false; // Ensure Easter egg is off at start
			this.initObjects(); // Ensure objects have default colors
			this.gameStartCallback(); 
			spaceJustPressed = false; 
		}

		if (!this.finished) {
			this.lastTick = timestamp; // Always update lastTick if game is not finished
			requestAnimationFrame(this.step.bind(this));
		} else if (this.finished && spaceJustPressed) { 
            // If game is finished and space is pressed again, re-initiate the loop for restart
            spaceJustPressed = false; // Consume
            this.lastTick = timestamp; // Reset tick for restart
            requestAnimationFrame(this.step.bind(this));
        }
	};

	Game.prototype.restart = function() {
		if (this.finished) {
			this.cacti = [];
			this.birds = []; 
			this.nextCactus = 0;
			this.nextBird = MIN_BIRD_DISTANCE * 1.5; 
			this.lastObstacleType = null;
			this.offset = 0;
			this.currentSpeed = INITIAL_OFFSET_SPEED;
			this.running = true; 
			this.finished = false;
			this.easterEggActive = false; // Reset Easter egg on restart
			
			// Re-initialize objects to reset their colors
			this.initObjects();
			
			this.player.currentY = this.player.groundY;
			this.player.velocityY = 0;
			this.player.jumpsRemaining = 2;
			this.player.isGrounded = true;
			this.player.wideEyed = false;
			
			this.gameStartCallback();
			
			// Reset lastTick and request a new animation frame to kickstart the game loop
			this.lastTick = performance.now(); // Use performance.now() for more accuracy if available
			requestAnimationFrame(this.step.bind(this));
		}
	};

	namespace.Game = Game;
})(window);
