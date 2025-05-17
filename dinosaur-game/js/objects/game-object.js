(function(namespace) {
	function collidesWith(first, second) {
		// Assuming first and second are {x, y, width, height}
		// where x,y is the top-left corner.
		return first.x < second.x + second.width &&   // first_left < second_right
		   first.x + first.width > second.x &&    // first_right > second_left
		   first.y < second.y + second.height &&  // first_top < second_bottom
		   first.y + first.height > second.y;     // first_bottom > second_top
	}

	function GameObject(options) {}

	GameObject.prototype.draw = function(context, offset) {
		throw new Error("Draw not yet implemented");
	};

	GameObject.prototype.colliders = function() { // Removed offset
		throw new Error("Colliders not yet implemented");
	};

	GameObject.prototype.drawColliders = function(context, offset) {
		var colliders = [];
		context.fillStyle = "rgba(255, 0, 0, 0.3)"; // Semi-transparent red for debugging
		try { 
			colliders = this.colliders(); // Get colliders in local/world space
			for (var i = 0; i < colliders.length; i++) {
				// Adjust x for drawing based on game offset
				context.fillRect(colliders[i].x - offset, colliders[i].y, colliders[i].width, colliders[i].height);
			}
		} catch(e) {}
	};
	
	GameObject.prototype.collidesWith = function(that, gameOffset) {
		// `this` is the dinosaur, `that` is the cactus.
		// Dinosaur colliders are already in its world space (this.x, this.currentY based)
		// Cactus colliders are also in its world space (cactus.x, cactus.y based)
		// The `gameOffset` is how much the world has scrolled.
		// We need to compare their absolute positions on the screen.
		// Dinosaur's screen X is fixed (this.x).
		// Cactus's screen X is (that.x - gameOffset).

		var dinoColliders = this.colliders(); // Returns [{x, y, width, height}] in dino's world coords
		var cactusColliders = that.colliders(); // Returns [{x, y, width, height}] in cactus's world coords

		for (var i = 0; i < dinoColliders.length; i++) {
			var dinoBox = {
				x: dinoColliders[i].x, // Dinosaur's X is static on screen
				y: dinoColliders[i].y,
				width: dinoColliders[i].width,
				height: dinoColliders[i].height
			};

			for (var j = 0; j < cactusColliders.length; j++) {
				var cactusBox = {
					x: cactusColliders[j].x - gameOffset, // Cactus X moves with offset
					y: cactusColliders[j].y,
					width: cactusColliders[j].width,
					height: cactusColliders[j].height
				};

				if (collidesWith(dinoBox, cactusBox)) {
					return true;
				}
			}
		}
		return false;
	};

	namespace.GameObject = GameObject;
})(window);
