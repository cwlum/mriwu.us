(function(namespace) {
    var WING_FLAP_SPEED = 0.15; 
    // Heights above the ground line. Dino height is ~54px. Max jump ~120px.
    // Ground is at canvas.height (300) - GROUND_BUFFER (10) = 290.
    // Bird needs to be clearable by a jump.
    // Lowest bird: groundY - birdHeight - dinoClearance.
    // Let's try heights like: just above single jump, and requiring double jump.
    // Bird visual height is ~18*1.5 = 27px.
    var BIRD_FLIGHT_LEVELS = [
        70,  // Low bird, requires a small jump or duck (if ducking implemented)
        130, // Mid bird, requires a good single jump or careful double jump
        180  // High bird, might require double jump or be above single jump peak
    ]; 
    var BIRD_SCALE = 1.5; 

    function Bird(options) {
        this.x = options.left;
        this.groundY = options.bottom; // This is ground level (e.g., 290)
        
        // Select a flight level (height above ground)
        var flightLevel = BIRD_FLIGHT_LEVELS[Math.floor(Math.random() * BIRD_FLIGHT_LEVELS.length)];
        
        // currentY is the *bottom* of the bird sprite for consistency with dino.
        // Bird visual height is approx 18*scale.
        // So, bird's bottom = groundY - flightLevel - (birdVisualHeight / 2) -> to center it roughly
        // Or, more simply, currentY is the y-coordinate of the bird's bottom edge.
        // If flightLevel is height above ground, then bird's bottom edge is groundY - flightLevel.
        this.currentY = this.groundY - flightLevel;

        this.colour = options.colour;
        this.wingPosition = 0; 
    }

    Bird.prototype = Object.create(GameObject.prototype);
    Bird.prototype.constructor = Bird;

    Bird.prototype.draw = function(context, offset) {
        var x = this.x - offset;
        var y = this.currentY; // Use currentY which is calculated from bottom

        // Determine wing state based on game offset for animation
        this.wingPosition = Math.floor(offset * WING_FLAP_SPEED) % 2;

        context.fillStyle = this.colour;
        var s = BIRD_SCALE; // shorthand for scale

        // Body
        context.fillRect(x + 5*s, y - 10*s, 10*s, 6*s); // Main body
        context.fillRect(x, y - 8*s, 5*s, 4*s);  // Tail

        // Head
        context.fillRect(x + 15*s, y - 12*s, 6*s, 4*s); // Head
        context.fillRect(x + 21*s, y - 11*s, 3*s, 2*s); // Beak

        // Wings
        if (this.wingPosition === 0) { // Wings up
            context.fillRect(x + 5*s, y - 15*s, 3*s, 5*s);  // Inner part of first wing
            context.fillRect(x + 8*s, y - 18*s, 7*s, 3*s);  // Outer part of first wing

            context.fillRect(x + 5*s, y - 5*s, 3*s, 5*s);   // Inner part of second wing (lower)
            context.fillRect(x + 8*s, y - 2*s, 7*s, 3*s);   // Outer part of second wing (lower)
        } else { // Wings down
            context.fillRect(x + 5*s, y - 15*s, 7*s, 3*s);  // Inner part of first wing
            context.fillRect(x + 2*s, y - 12*s, 3*s, 5*s);  // Outer part of first wing

            context.fillRect(x + 5*s, y - 5*s, 7*s, 3*s);   // Inner part of second wing (lower)
            context.fillRect(x + 2*s, y - 8*s, 3*s, 5*s);    // Outer part of second wing (lower)
        }
    };

    Bird.prototype.colliders = function() {
        var s = BIRD_SCALE;
        // y is the top of the bird in this calculation
        var birdTopY = this.currentY - 18*s; // Approximate top of wing/head
        var birdHeight = 18*s; // Approximate height
        var birdWidth = 24*s;  // Approximate width including beak and tail
        return [{
            x: this.x, // World X
            y: birdTopY, // World Y (top of bird)
            width: birdWidth,
            height: birdHeight
        }];
    };

    namespace.Bird = Bird;
})(window);
