# Tut 9 Group F_ruxu0462
rui_individual task

Creative Coding Major Project: Wheels of Fortune - Time-Based Animation
This project is a digital emulation and animation of Pacita Abad's "Wheels of Fortune," created using p5.js. As part of a group assignment, this individual submission focuses on implementing time-based animation to bring the artwork to life, building directly upon the final collaborative group code.

Instructions on How to Interact with the Work
To experience the animation, simply open the index.html file in a web browser. The artwork will load, and the animations will begin automatically. There is no user interaction required; the visual effects are driven purely by internal timers. The wheels will continuously rotate, and their outer dots will subtly pulse in size over time, creating a mesmerizing and evolving display.

Individual Approach to Animating the Group Code
Method Chosen: Time-Based Animation

My individual approach to animating the "Wheels of Fortune" artwork is driven entirely by internal program timers and the passage of frames. This method was specifically chosen to create a continuous, self-sustaining, and hypnotic visual experience, directly applying the concepts of easing and periodic changes as taught in our Week 10 "Animation" lectures.

Animated Properties and Uniqueness:

I have implemented two distinct time-based animations within each individual Wheel object:

Individual Wheel Rotation:

How: Each "wheel" in the artwork undergoes a continuous, slow rotation around its own center. This creates a perpetual motion effect for every intricate wheel.

Uniqueness: This animation is driven by a currentRotation variable incremented each frame by a rotationSpeed. To ensure visual variety, each wheel is assigned a random initial rotation angle and a random rotation speed. This prevents all wheels from moving in unison, resulting in an asynchronous and more organic feel, distinct from a uniform, synchronized movement.

Outer Dot Pulsation:

How: The outer ring of dots on each Wheel subtly and smoothly pulses in size, expanding and contracting. This creates a "breathing" effect that adds a layer of organic vitality and dynamic texture to the individual wheels.

Uniqueness: This pulsation utilizes the lerp() function for smooth easing, transitioning between a minimum and maximum dot size. The trigger for changing the target size is frameCount % this.pulsePeriod === 0, where pulsePeriod is a randomized value for each wheel. This makes each wheel's dots pulse at its own unique frequency and rhythm, further enhancing the asynchronous nature of the overall animation and distinguishing it from any potentially synchronized effects implemented by other group members (e.g., changes in color, revealing components, or effects driven by external input).

My animation is unique because it relies exclusively on the program's internal clock (frameCount) and smooth interpolation (lerp()) to generate its dynamic qualities. This provides a self-contained, constantly evolving visual loop that requires no external triggers or user interaction, offering a distinct interpretation of the artwork's dynamism.

References to Inspiration for Animating Individual Code
My animation approach is deeply rooted in the principles taught in Week 10: Animation of our course material.

Easing and Periodic Changes (Week 10 Lecture/Tutorial): The core mechanism for the outer dot pulsation directly stems from the "Easing Part 2: Change Periodically" example. This involved using the frameCount operator (%) to trigger changes at regular intervals and the lerp() function to ensure a smooth, natural deceleration as the animated property approaches its target value. This technique was fundamental in making the dot size transitions feel organic rather than abrupt.

Transformations (Rotation, Week 10 Lecture/Tutorial): The continuous rotation of each wheel leverages the rotate() transformation taught in Week 10. The use of push() and pop() is also directly from class, ensuring that the rotation applied to one Wheel object does not affect the global canvas coordinate system or other independent drawing elements.

General Motion Graphics and Abstract Animations: Beyond specific class examples, my inspiration for the continuous, subtle motion of the wheels comes from observing various motion graphics and abstract digital art pieces that feature perpetual, gentle movements. The aim was to imbue each wheel with a sense of internal life, much like gears turning or celestial bodies moving, contributing to the overall "Wheels of Fortune" theme.

Technical Explanation of How Individual Code Works
My individual animation primarily focuses on enhancing the existing Wheel class (which originated from rui's detailed wheel design within our group's iterative process) to incorporate time-based behaviors. The fundamental structure of setup(), draw(), initializeArtwork(), and the Connector class from our group's final code remains consistent, ensuring the core artwork is correctly rendered.

Properties Added to Wheel Class (constructor):

this.currentRotation: A float variable to store the current rotation angle (in radians) of the wheel. Initialized with random(TWO_PI) to give each wheel a unique starting orientation.

this.rotationSpeed: A small float value (random(0.003, 0.015)) representing how much currentRotation increases per frame. Each wheel has a slightly different speed, contributing to the asynchronous motion.

this.initialOuterDotSize: Stores the baseline size for the outer dots, derived from this.radius * 0.08.

this.currentOuterDotSize: The actual size used for drawing the outer dots, smoothly interpolated.

this.targetOuterDotSize: The goal size for the pulsation. It alternates between this.initialOuterDotSize * this.pulseMinFactor and this.initialOuterDotSize * this.pulseMaxFactor.

this.pulseMinFactor, this.pulseMaxFactor: Constants (0.85, 1.15) defining the percentage range for dot size changes.

this.pulsePeriod: An int (floor(random(80, 200))). This random value determines, in frames, how often the targetOuterDotSize flips, ensuring each wheel pulses at its own rate.

// This concept and its implementation (using frameCount % N) was covered in class (Week 10, Easing Part 2: Change Periodically).

this.easingFactor: A float (0.1) that controls the smoothness of the lerp() transition. A smaller value results in slower, more gradual easing.

// The lerp() function and its use for smooth transitions was a core concept from Week 10 on Easing.

Modifications in Wheel Class display() Method:

Wheel Rotation:

this.currentRotation += this.rotationSpeed; // Continuously update rotation angle based on speed.
rotate(this.currentRotation); // Apply the rotation transformation for the entire wheel.

// The rotate() function applies a rotational transformation, as discussed in Week 10 Transformations. The use of push() and pop() (inherent in the display() method structure) ensures that this transformation is localized to the individual wheel.

// This continuous change based on frameCount is fundamental to time-based animation in p5.js.

Outer Dot Pulsation with Easing:

if (frameCount % this.pulsePeriod === 0) {
  // Toggle the target size for the pulsation every 'pulsePeriod' frames.
  if (this.targetOuterDotSize === this.initialOuterDotSize * this.pulseMaxFactor) {
    this.targetOuterDotSize = this.initialOuterDotSize * this.pulseMinFactor; // Set target to shrink
  } else {
    this.targetOuterDotSize = this.initialOuterDotSize * this.pulseMaxFactor; // Set target to grow
  }
}
// Smoothly interpolate the 'currentOuterDotSize' towards the 'targetOuterDotSize' using 'easingFactor'.
this.currentOuterDotSize = lerp(this.currentOuterDotSize, this.targetOuterDotSize, this.easingFactor);
// Call the drawing method for outer dots, passing the dynamically calculated size.
this.drawOuterDots(this.currentOuterDotSize);

// The frameCount % this.pulsePeriod === 0 logic directly implements the "Change Periodically" concept from Week 10.

// The lerp() function provides the smooth easing animation, a core concept from Week 10 on Easing.

Modified Drawing Helper (drawOuterDots):

The drawOuterDots method within the Wheel class was updated to accept a dotSize parameter (drawOuterDots(dotSize)). This allows the display() method to pass the dynamically calculated this.currentOuterDotSize to it, enabling the pulsating effect.

Usage of AI (ChatGPT):

This individual code, particularly the implementation of the continuous wheel rotation and the eased outer dot pulsation (including the setup of their respective properties and the integration of frameCount and lerp() for these specific effects), was developed with the assistance of an AI (ChatGPT). While the core p5.js functions and animation concepts were learned in class (Week 10), the precise application, combination, and parameter tuning for these animations within the existing group code structure were guided by AI.

Additionally, the underlying structure of the group code, such as the optimized wheel packing logic in initializeArtwork() (allowing moderate overlap and ensuring nearby wheels for connections) and the detailed Connector class structure (for intricate chain-like connections), were also developed with the assistance of an AI (ChatGPT) based on iterative discussions and refinements during the group project phase.

