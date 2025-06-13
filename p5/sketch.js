let wheels = [];
let connectors = []; // Array to hold all connector objects

// Enhanced color palettes inspired by Pacita Abad's "Wheels of Fortune"
// Each sub-array represents a palette for one wheel, mimicking the vibrant, layered colors.
// These are hand-picked approximations and should be fine-tuned.
const colorPalettes = [
  // Palette 1: Deep Blue/Purple with Yellow/Orange Accents (like top-left wheel)
  ['#45206A', '#FFD700', '#FF8C00', '#B0E0E6', '#8A2BE2'], // Base, Outer Dots, Inner Dots, Spokes, Center
  // Palette 2: Fiery Reds and Oranges with Green/Blue contrast
  ['#D90429', '#F4D35E', '#F7B267', '#0A796F', '#2E4057'],
  // Palette 3: Warm Earthy Tones with Bright Pinks/Greens
  ['#A34A2A', '#F2AF29', '#E0A890', '#3E8914', '#D4327C'],
  // Palette 4: Cool Blues and Greens with Yellow/Pink Pop
  ['#004C6D', '#7FC2BF', '#FFC94F', '#D83A56', '#5C88BF'],
  // Palette 5: Vibrant Pinks and Purples with Yellow/Green
  ['#C11F68', '#F9E795', '#F5EEF8', '#2ECC71', '#8E44AD'],
  // Palette 6: Deep Teal with Orange/Red
  ['#006D77', '#FF8C00', '#E29578', '#83C5BE', '#D64045'],
  // Add more palettes based on our visual analysis of the original artwork
];

const backgroundColor = '#2A363B'; // A dark, muted background similar to the original painting

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); // Set angle mode to radians for rotation calculations

  initializeArtwork();
}

function draw() {
  background(backgroundColor);

  // Display connectors first, so they are behind the wheels
  for (const conn of connectors) {
    conn.display();
  }

  // Display all the wheels
  for (const wheel of wheels) {
    wheel.display();
  }
}

// --- Initialization Function (from group code, developed with AI-CHATGPT assistance) ---
function initializeArtwork() {
  wheels = [];
  connectors = [];

  const numWheels = 25; // Adjusted number for a denser feel, similar to original
  const minRadius = width * 0.04;
  const maxRadius = width * 0.12;
  const maxAttempts = 5000;
  let currentAttempts = 0;

  // Generate wheels with optimized packing
  // This layout logic (allowing moderate overlap with overlapThreshold and ensuring nearby wheels for connection)
  // was developed with the assistance of an AI (ChatGPT).
  while (wheels.length < numWheels && currentAttempts < maxAttempts) {
    let candidateRadius = random(minRadius, maxRadius);
    let candidateX = random(candidateRadius, width - candidateRadius);
    let candidateY = random(candidateRadius, height - candidateRadius);

    let isOverlappingTooMuch = false; // Check for excessive overlap
    let hasNearbyWheel = false; // Check if it's close enough to existing wheels

    for (let other of wheels) {
      let d = dist(candidateX, candidateY, other.x, other.y);
      let combinedRadius = candidateRadius + other.radius;

      // Allow some overlap (e.g., up to 40% of the smaller radius)
      // Original artwork has significant overlaps, so we allow for it.
      const overlapThreshold = min(candidateRadius, other.radius) * 0.4; 
      if (d < combinedRadius - overlapThreshold) {
        isOverlappingTooMuch = true;
        break;
      }
      // Check if it's within a reasonable distance to connect
      if (d < combinedRadius * 1.5) { // Can be connected if within 1.5x combined radius
        hasNearbyWheel = true;
      }
    }

    // First wheel doesn't need neighbors
    if (wheels.length === 0) {
      hasNearbyWheel = true;
    }

    if (!isOverlappingTooMuch && hasNearbyWheel) { // Only add if not excessively overlapping AND has a potential neighbor
      let selectedPalette = random(colorPalettes);
      // To ensure diversity and avoid using the same palette consecutively
      if (wheels.length > 0 && selectedPalette === wheels[wheels.length - 1].colors) {
          selectedPalette = random(colorPalettes.filter(p => p !== selectedPalette));
      }
      wheels.push(new Wheel(candidateX, candidateY, candidateRadius, selectedPalette));
    }
    currentAttempts++;
  }

  if (currentAttempts >= maxAttempts) {
    console.log("Could not place all wheels within limits.");
  }

  // Generate connectors between nearby wheels
  // This logic for connecting nearby wheels and the Connector class structure
  // were developed with the assistance of an AI (ChatGPT), inspired by previous group iterations.
  for (let i = 0; i < wheels.length; i++) {
    for (let j = i + 1; j < wheels.length; j++) {
      let w1 = wheels[i];
      let w2 = wheels[j];
      let d = dist(w1.x, w1.y, w2.x, w2.y);
      // Connect wheels if they are within a certain range
      if (d < (w1.radius + w2.radius) * 1.3) { 
        connectors.push(new Connector(w1, w2, random(colorPalettes)[0])); 
      }
    }
  }
}

// --- Wheel Class (Core group code structure, with individual animation additions) ---
class Wheel {
  constructor(x, y, radius, palette) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colors = palette; // Now using a palette array
    this.stemAngle = random(TWO_PI); // For the single 'stem'

    // Individual Task - Time-Based Animation Properties:
    // These properties for continuous rotation and pulsating dots were developed with the assistance of an AI (ChatGPT).
    // This property will control the continuous rotation of the entire wheel.
    // It's initialized with a random angle for visual variety at start.
    this.currentRotation = random(TWO_PI); 
    // This property controls the speed of rotation. Each wheel has a slightly different speed.
    // // Refinement: Adjusted range for smoother, more varied rotation.
    this.rotationSpeed = random(0.003, 0.015); 

    // For outer dot pulsing animation using easing (as learned in Week 10)
    // Stores the original size of the outer dots for reference.
    this.initialOuterDotSize = this.radius * 0.08; 
    // The current size of the outer dots, which will be smoothly animated.
    this.currentOuterDotSize = this.initialOuterDotSize; 
    // The target size the dots are trying to reach. This will alternate to create the pulse.
    this.targetOuterDotSize = this.initialOuterDotSize; 
    // Minimum and maximum factors for the dot size during pulsation.
    // // Refinement: Slightly adjusted min/max factors for a more subtle pulse.
    this.pulseMinFactor = 0.85; 
    this.pulseMaxFactor = 1.15; 
    // The period (in frames) after which the target size for pulsation changes.
    // Randomized per wheel for asynchronous pulsing, simulating "Change Periodically" from class.
    // // This concept and its implementation (using frameCount % N) was covered in class (Week 10, Easing Part 2: Change Periodically).
    this.pulsePeriod = floor(random(80, 200)); 
    // The easing factor for lerp(), controls the smoothness of the size transition.
    // Directly from class examples (e.g., easing = 0.05 or 0.08).
    // // The `lerp()` function and its use for smooth transitions was a core concept from Week 10 on Easing.
    // // Refinement: Slightly increased easing factor for a slightly snappier, yet still smooth, response.
    this.easingFactor = 0.1; 
  }

  display() {
    push(); // Save current drawing style and transformations
    translate(this.x, this.y); // Move origin to the wheel's center

    // --- Time-Based Animation: Wheel Rotation ---
    // This continuous rotation animation was implemented with the assistance of an AI (ChatGPT).
    // Increment the rotation angle each frame. This is a continuous animation driven by time (frameCount).
    // // This concept of continuous change based on frameCount is fundamental to time-based animation in p5.js.
    this.currentRotation += this.rotationSpeed; 
    // Apply the rotation transformation to the wheel.
    // // The rotate() function applies a rotational transformation, as discussed in Week 10 Transformations.
    rotate(this.currentRotation); 

    // --- Time-Based Animation: Outer Dot Pulsation with Easing ---
    // This pulsating dot animation, applying easing, was implemented with the assistance of an AI (ChatGPT).
    // It uses frameCount as a timer to periodically change the target size,
    // and lerp() for smooth transitions, as taught in Easing Part 2.
    // // The `frameCount % this.pulsePeriod === 0` logic directly implements the "Change Periodically" concept.
    if (frameCount % this.pulsePeriod === 0) {
      // Toggle the target size between shrink and grow
      if (this.targetOuterDotSize === this.initialOuterDotSize * this.pulseMaxFactor) {
        this.targetOuterDotSize = this.initialOuterDotSize * this.pulseMinFactor; // Set target to shrink
      } else {
        this.targetOuterDotSize = this.initialOuterDotSize * this.pulseMaxFactor; // Set target to grow
      }
    }
    // Smoothly transition the current dot size towards the target size using linear interpolation (lerp()).
    // The 'easingFactor' controls the rate of approach, creating a decelerating effect.
    // // The `lerp()` function provides the smooth easing animation, a core concept from Week 10 on Easing.
    this.currentOuterDotSize = lerp(this.currentOuterDotSize, this.targetOuterDotSize, this.easingFactor);


    // Order of drawing layers (back to front)
    this.drawBaseCircle();
    // Pass the dynamically calculated 'currentOuterDotSize' to the drawing method.
    // The modification to drawOuterDots to accept a dynamic size was made with AI assistance (ChatGPT).
    this.drawOuterDots(this.currentOuterDotSize); 
    this.drawSpokes();
    this.drawInnerCircles();
    this.drawStem(); // This could represent a decorative element or a start of a connection

    pop(); // Restore previous drawing style and transformations
  }

  // --- Wheel Drawing Helper Methods (from group code) ---
  drawBaseCircle() {
    noStroke();
    fill(this.colors[0]); // Use the first color in the palette for the base
    circle(0, 0, this.radius * 2);
  }

  // drawOuterDots method modified to accept dynamic dotSize for animation
  drawOuterDots(dotSize) { 
    const dotCount = 40;
    const dotRadius = this.radius * 0.9;
    fill(this.colors[1]); // Second color for outer dots
    noStroke();
    for (let i = 0; i < dotCount; i++) {
      const angle = map(i, 0, dotCount, 0, TWO_PI);
      const dx = cos(angle) * dotRadius;
      const dy = sin(angle) * dotRadius;
      circle(dx, dy, dotSize); // Use the animated dot size passed as a parameter
    }
  }

  drawSpokes() {
    const spokeCount = 24;
    const innerRadius = this.radius * 0.55;
    const outerRadius = this.radius * 0.8;
    stroke(this.colors[3]); // Fourth color for spokes
    strokeWeight(this.radius * 0.03);
    for (let i = 0; i < spokeCount; i++) {
      const angle = map(i, 0, spokeCount, 0, TWO_PI);
      const x1 = cos(angle) * innerRadius;
      const y1 = sin(angle) * innerRadius;
      const x2 = cos(angle) * outerRadius;
      const y2 = sin(angle) * outerRadius;
      line(x1, y1, x2, y2);
    }
  }

  drawInnerCircles() {
    noStroke();
    fill(this.colors[2]); // Third color for the first inner circle
    circle(0, 0, this.radius * 0.6);

    fill(this.colors[3]); // Fourth color for inner dots
    const innerDotCount = 20;
    const innerDotRadius = this.radius * 0.4;
    const innerDotSize = this.radius * 0.06; // This internal dot size remains fixed for now
    for (let i = 0; i < innerDotCount; i++) {
      const angle = map(i, 0, innerDotCount, 0, TWO_PI);
      const dx = cos(angle) * innerDotRadius;
      const dy = sin(angle) * innerDotRadius;
      circle(dx, dy, innerDotSize); 
    }

    fill(this.colors[4]); // Fifth color for the second inner circle
    circle(0, 0, this.radius * 0.3);

    fill(this.colors[0]); // Reusing first color for the smallest center circle
    circle(0, 0, this.radius * 0.15);
  }

  drawStem() {
    stroke(this.colors[1]); // Use second color for the stem
    strokeWeight(this.radius * 0.04);
    noFill();
    const startX = cos(this.stemAngle) * (this.radius * 0.075);
    const startY = sin(this.stemAngle) * (this.radius * 0.075);
    const endX = cos(this.stemAngle) * (this.radius * 0.5);
    const endY = sin(this.stemAngle) * (this.radius * 0.5);
    const controlX = cos(this.stemAngle + 0.5) * (this.radius * 0.4);
    const controlY = sin(this.stemAngle + 0.5) * (this.radius * 0.4);
    beginShape();
    vertex(startX, startY);
    quadraticVertex(controlX, controlY, endX, endY);
    endShape();
    noStroke();
    fill(this.colors[1]);
    circle(endX, endY, this.radius * 0.08);
  }
}

// --- Connector Class (from group code, developed with AI assistance for its detail) ---
class Connector {
  constructor(wheel1, wheel2, connectColor) {
    this.w1 = wheel1;
    this.w2 = wheel2;
    this.color = connectColor;
    // Pre-calculate angle and positions for drawing
    this.angle = atan2(this.w2.y - this.w1.y, this.w2.x - this.w1.x);
    this.startPoint = createVector(
      this.w1.x + cos(this.angle) * this.w1.radius,
      this.w1.y + sin(this.angle) * this.w1.radius
    );
    this.endPoint = createVector(
      this.w2.x + cos(this.angle + PI) * this.w2.radius, // Angle + PI to get to the other side of w2
      this.w2.y + sin(this.angle + PI) * this.w2.radius
    );
  }

  display() {
    stroke(this.color);
    strokeWeight(5); // Thicker line for visibility
    noFill();

    // Draw the main connection line
    line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);

    // Add decorative elements for the chain-like effect (inspired by original)
    // The implementation of chain links and central decorative blob was developed with AI assistance (Gemini).
    let midX = (this.startPoint.x + this.endPoint.x) / 2;
    let midY = (this.startPoint.y + this.endPoint.y) / 2;
    let distBetweenWheels = dist(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);

    // Draw chain links along the line
    const linkSize = 10;
    const numLinks = floor(distBetweenWheels / (linkSize * 2)); 
    if (numLinks > 0) {
      for (let i = 0; i <= numLinks; i++) {
        let lerpAmount = map(i, 0, numLinks, 0, 1);
        let linkX = lerp(this.startPoint.x, this.endPoint.x, lerpAmount);
        let linkY = lerp(this.startPoint.y, this.endPoint.y, lerpAmount);

        fill(255, 200, 100); 
        stroke(this.color);
        strokeWeight(1);
        circle(linkX, linkY, linkSize);

        fill(0);
        noStroke();
        circle(linkX, linkY, linkSize * 0.4);
      }
    }

    // Draw decorative central blob 
    if (distBetweenWheels > 50) { 
        fill(255, 255, 255); 
        stroke(this.color); 
        strokeWeight(3);
        circle(midX, midY, 20); 

        fill(this.color); 
        noStroke();
        circle(midX, midY, 10); 

        fill(255, 200, 100); 
        noStroke();
        const numSmallDots = 8;
        const smallDotRadius = 15;
        const smallDotSize = 4;
        for (let i = 0; i < numSmallDots; i++) {
            let angle = map(i, 0, numSmallDots, 0, TWO_PI);
            let dx = midX + cos(angle) * smallDotRadius;
            let dy = midY + sin(angle) * smallDotRadius;
            circle(dx, dy, smallDotSize);
        }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeArtwork(); 
}