(function(namespace) {
	var DEFAULT_CLOUD_COLOUR = "#BBB"; // Lighter grey for better visibility on dark bg
	var CLOUD_SCROLL_FACTOR = 0.3; 

	function generateBits(width, height) {
		var bits = [], x, y;
		for (y = height - 10; y <= height; y += 8) { // Ground bits near the bottom
			for (x = 0 + rand(0, 100); x <= width; x += rand(100, 200)) {
				bits.push({
					x: x, 
					y: y, 
					width: rand(2, 4)
				});
			}
		}
		return bits;
	}

	function generateClouds(width, canvasHeight) {
		var clouds = [];
		var cloudCount = Math.floor(width / 250); 

		for (var i = 0; i < cloudCount; i++) {
			var cloudX = rand(0, width * 1.5); 
			var cloudY = rand(40, canvasHeight / 2 - 60); // Adjusted Y to give more space from top
			
			var segments = [];
			var numSegments = Math.floor(rand(2, 5)); // 2 to 4 segments for a bit more substance
			var currentX = 0; // Relative X for segments within a cloud

			for (var j = 0; j < numSegments; j++) {
				var segmentWidth = rand(15, 40); // Slightly smaller segments for pixel feel
				var segmentHeight = rand(10, 20);
				var segmentOffsetY = rand(-5, 5); // Vertical stagger

				segments.push({ 
					dx: currentX + rand(-3,3), // Horizontal stagger
					dy: segmentOffsetY, 
					w: segmentWidth, 
					h: segmentHeight 
				});
				currentX += segmentWidth * rand(0.7, 0.9); // Overlap segments
			}
			// Store the total width for wrapping logic, can be approximate
			var approxCloudWidth = currentX; 
			clouds.push({ x: cloudX, y: cloudY, segments: segments, width: approxCloudWidth });
		}
		return clouds;
	}

	function Background(options) {
		this.width = options.width;
		this.height = options.height; 
		this.groundColour = options.colour; // Store ground line color separately
		this.cloudColour = DEFAULT_CLOUD_COLOUR; // Default cloud color
		this.bits = generateBits(this.width, this.height);
		this.clouds = generateClouds(this.width, this.height);
	}

	Background.prototype = Object.create(GameObject.prototype);
	Background.prototype.constructor = Background;

	Background.prototype.updateColours = function(newGroundColour, newCloudColour) {
		this.groundColour = newGroundColour;
		this.cloudColour = newCloudColour || DEFAULT_CLOUD_COLOUR; // Fallback if no new cloud color
	};

	Background.prototype.draw = function(context, offset) {
		// Draw Ground Line
		context.fillStyle = this.groundColour;
		context.fillRect(0, this.height - 20, this.width, 1); 

		// Draw Ground Bits
		for (var i = this.bits.length - 1; i >= 0; i--) {
			context.fillRect(this.width - ((this.bits[i].x + offset) % this.width), this.bits[i].y, this.bits[i].width, 1);
		}

		// Draw Clouds
		var cloudOffset = offset * CLOUD_SCROLL_FACTOR;
		context.fillStyle = this.cloudColour; // Use dynamic cloud color
		for (var i = 0; i < this.clouds.length; i++) {
			var cloud = this.clouds[i];
			var effectiveCloudX = (cloud.x - cloudOffset);
			// More robust wrapping: if cloud is off screen left, move it to the right
			if (effectiveCloudX < -cloud.width) { // cloud.width is approx total width
				cloud.x += (this.width + cloud.width + rand(50,150)); // Add some randomness to reappear position
				effectiveCloudX = (cloud.x - cloudOffset); // Recalculate
			}
			
			for(var j=0; j < cloud.segments.length; j++) {
				var segment = cloud.segments[j];
				context.fillRect(
					effectiveCloudX + segment.dx, 
					cloud.y + segment.dy, 
					segment.w, 
					segment.h
				);
			}
		}
	};

	namespace.Background = Background;
})(window);
