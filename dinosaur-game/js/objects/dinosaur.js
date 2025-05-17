(function(namespace) {
	var STEP_SPEED = 0.025;
	var GRAVITY = 0.9; 
	var SHORT_JUMP_IMPULSE = 10; // Base for short tap
	var FULL_JUMP_IMPULSE = 10;   
	var DOUBLE_JUMP_IMPULSE = 15; // Strong double jump
	var MAX_FALL_SPEED = 20; 
	var JUMP_HOLD_TIME_THRESHOLD = 200; 

	function Dinosaur(options) {
		this.x = options.left;
		this.groundY = options.bottom; 
		this.currentY = this.groundY;  
		this.colour = options.colour; 
		
		this.velocityY = 0;
		this.jumpsRemaining = 2;
		this.isGrounded = true;
		this.wideEyed = false; 
		this.jumpKeyPressedTime = 0; // Time when jump key was pressed
		this.jumpKeyReleased = true; // To ensure tap vs hold
	}

	Dinosaur.prototype = Object.create(GameObject.prototype);  
	Dinosaur.prototype.constructor = Dinosaur; 

	Dinosaur.prototype.jumpPressed = function() {
		this.jumpKeyPressedTime = performance.now();
		this.jumpKeyReleased = false;

		if (this.jumpsRemaining > 0) {
			if (this.isGrounded) { // First jump - initiate with short jump impulse
				this.velocityY = -SHORT_JUMP_IMPULSE; 
				this.isGrounded = false;
				this.jumpsRemaining--;
			} else if (this.jumpsRemaining === 1) { // Allow double jump if one jump is left
				this.velocityY = -DOUBLE_JUMP_IMPULSE;
				this.jumpsRemaining--;
			}
		}
	};

	Dinosaur.prototype.jumpReleased = function() {
		this.jumpKeyReleased = true;
		// If key released quickly after first jump, it remains a short jump.
		// If held, updatePhysics will boost it.
	};
	
	Dinosaur.prototype.updatePhysics = function(deltaTime, spaceIsCurrentlyPressed) {
		var timeFactor = deltaTime / (1000 / 60); 

		// Boost first jump if space is held
		if (!this.isGrounded && this.jumpsRemaining === 1 && spaceIsCurrentlyPressed && !this.jumpKeyReleased) {
			if (performance.now() - this.jumpKeyPressedTime <= JUMP_HOLD_TIME_THRESHOLD) {
				// Still within hold time for first jump, ensure it's at least full jump impulse
                 if (this.velocityY > -FULL_JUMP_IMPULSE) { // If current upward vel is less than full
                    this.velocityY = -FULL_JUMP_IMPULSE;
                 }
			}
		}


		if (!this.isGrounded) {
			this.velocityY += GRAVITY * timeFactor;
			if (this.velocityY > MAX_FALL_SPEED) { 
				this.velocityY = MAX_FALL_SPEED; // Cap fall speed
            }
		}
		
		this.currentY += this.velocityY * timeFactor;

		if (this.currentY >= this.groundY) {
			this.currentY = this.groundY;
			this.velocityY = 0;
			if (!this.isGrounded) { // Only reset if it was actually in the air
				this.isGrounded = true;
				this.jumpsRemaining = 2; 
			}
		}
	};

	Dinosaur.prototype.hasBackLegUp = function(offset) {
		return this.isGrounded && offset > 0 && Math.floor(offset * STEP_SPEED) % 2 === 0;
	};

	Dinosaur.prototype.hasFrontLegUp = function(offset) {
		return this.isGrounded && offset > 0 && Math.floor(offset * STEP_SPEED) % 2 === 1;
	};

	Dinosaur.prototype.draw = function(context, offset) {
		// updatePhysics is now called in game.js step
		var x = this.x;
		var y = this.currentY; // Use the physics-updated Y

		context.fillStyle = this.colour;
		
		// Tail
		context.fillRect(x, y - 36, 2, 16);
		context.fillRect(x + 2, y - 32, 2, 16);
		context.fillRect(x + 4, y - 30, 2, 16);
		context.fillRect(x + 6, y - 28, 2, 16);
		context.fillRect(x + 8, y - 28, 2, 18);
		context.fillRect(x + 10, y - 30, 2, 22);
		context.fillRect(x + 12, y - 32, 4, 26);
		context.fillRect(x + 16, y - 34, 4, 26);
		context.fillRect(x + 20, y - 36, 4, 30);
		context.fillRect(x + 24, y - 38, 2, 30);
		context.fillRect(x + 26, y - 38, 2, 28);
		context.fillRect(x + 28, y - 52, 2, 40);

		// Head and body
		if (this.wideEyed) { // Collision effect
			context.fillRect(x + 30, y - 54, 6, 2); // Eye
			context.fillRect(x + 32, y - 50, 2, 2); // Pupil
			context.fillRect(x + 30, y - 46, 2, 32); // Neck
			context.fillRect(x + 32, y - 46, 2, 30);
			context.fillRect(x + 34, y - 46, 2, 28);
		} else {
			context.fillRect(x + 30, y - 54, 2, 40); // Neck/Body
			context.fillRect(x + 32, y - 54, 2, 4);  // Eye
			context.fillRect(x + 32, y - 48, 2, 32); // Neck/Body
			context.fillRect(x + 34, y - 54, 2, 36); // Neck/Body
		}

		context.fillRect(x + 36, y - 54, 2, 34); // Head
		context.fillRect(x + 38, y - 54, 2, 20); // Snout
		context.fillRect(x + 40, y - 54, 12, 16); // Snout
		context.fillRect(x + 52, y - 52, 2, 14);  // Snout tip

		if (this.wideEyed) {
			context.fillRect(x + 38, y - 34, 8, 2); // Mouth open
		} else {
			context.fillRect(x + 40, y - 36, 8, 2); // Mouth closed
		}

		// Arm
		context.fillRect(x + 36, y - 26, 4, 2);
		context.fillRect(x + 40, y - 26, 2, 4);

		// Legs - adjust y based on stepping animation only if grounded
		var legY = y; 
		if (this.hasBackLegUp(offset)) {
			legY -= 4;
		}
		// Back leg
		context.fillRect(x + 12, legY, 4, 2);    // Foot
		context.fillRect(x + 12, legY - 6, 2, 8); // Leg
		context.fillRect(x + 14, legY - 6, 2, 3);
		context.fillRect(x + 16, legY - 8, 2, 3);

		legY = y; // Reset for front leg
		if (this.hasFrontLegUp(offset)) {
			legY -= 6;
		}
		// Front leg
		context.fillRect(x + 22, legY, 4, 2);    // Foot
		context.fillRect(x + 22, legY - 6, 2, 8); // Leg
	};

	Dinosaur.prototype.colliders = function() { // Removed offset, as colliders are in dino's local space
		// Collider positions are relative to the dinosaur's (this.x, this.currentY)
		// this.currentY is the bottom of the dinosaur.
		// For collision, we need the top-left corner (x, y) and width/height.
		// The dinosaur's drawing code uses y as the bottom reference for most parts.
		// Example: Tail `context.fillRect(x, y - 36, 2, 16);` means top is y-36, bottom is y-36+16 = y-20
		
		var dinoTopY = this.currentY - 54; // Approximate top of the head
		var dinoFrontX = this.x + 52;   // Approximate front of the snout
		var dinoBackX = this.x;         // Back of the tail
		var dinoHeight = 54;            // Approximate total height
		var dinoWidth = 52;             // Approximate total width

		// Simplified single bounding box for the dinosaur for now.
		// More accurate would be multiple boxes for head, body, tail.
		return [{ 
			x: this.x, 
			y: this.currentY - dinoHeight, // Top Y coordinate of the bounding box
			width: dinoWidth,
			height: dinoHeight
		}];
	};

	namespace.Dinosaur = Dinosaur;
})(window);
