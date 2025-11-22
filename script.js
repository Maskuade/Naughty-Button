const button = document.getElementById('runawayButton');
let escapeCount = 0;

// This function runs whenever the mouse moves
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Get the button's position and size on the screen
    const buttonRect = button.getBoundingClientRect();

    // Calculate the center of the button
    const buttonX = buttonRect.left + buttonRect.width / 2;
    const buttonY = buttonRect.top + buttonRect.height / 2;

    // Calculate the distance between the mouse and the button
    const distance = Math.sqrt((mouseX - buttonX) ** 2 + (mouseY - buttonY) ** 2);

    // **MAJOR UPGRADES START HERE:**

    // 1. INCREASE SENSITIVITY - reacts from farther away
    const triggerDistance = 150; // Increased from 100 to 150

    // 2. SMARTER ESCAPE - calculates direction AWAY from mouse instead of random
    if (distance < triggerDistance) {
        escapeCount++;

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // **CALCULATE ESCAPE DIRECTION AWAY FROM MOUSE**
        const angle = Math.atan2(buttonY - mouseY, buttonX - mouseX);

        // **MAKE IT JUMP FARTHER** - increased multiplier
        const escapeDistance = 200 + (escapeCount * 5); // Gets farther with each escape!

        const newX = buttonRect.left + Math.cos(angle) * escapeDistance;
        const newY = buttonRect.top + Math.sin(angle) * escapeDistance;

        // **KEEP WITHIN BOUNDS** - but bounce off edges
        const boundedX = Math.max(10, Math.min(viewportWidth - buttonRect.width - 10, newX));
        const boundedY = Math.max(10, Math.min(viewportHeight - buttonRect.height - 10, newY));

        // **INSTANT MOVEMENT** - remove any transition for maximum speed
        button.style.transition = 'none';
        button.style.left = `${boundedX}px`;
        button.style.top = `${boundedY}px`;

        // **VISUAL FEEDBACK** - button gets more frantic
        button.style.backgroundColor = escapeCount % 2 === 0 ? '#ff4444' : '#ff6666';

        // **TAUNTING MESSAGES**
        if (escapeCount % 5 === 0) {
            const messages = [
                "CAN'T CATCH ME!",
                "TOO SLOW!",
                "NICE TRY!",
                "GOTTA BE FASTER!",
                "ALMOST! 😅"
            ];
            button.textContent = messages[Math.floor(Math.random() * messages.length)];

            // Reset to original text after 1 second
            setTimeout(() => {
                button.textContent = "DO NOT PRESS";
            }, 1000);
        }

        // **MAKE IT EVEN FASTER AFTER MANY ESCAPES**
        if (escapeCount > 10) {
            triggerDistance = 180; // Reacts even earlier
        }
    }
});

// **UPGRADED CLICK EVENT** - if they somehow manage to click it
button.addEventListener('click', () => {
    // Victory celebration!
    document.body.innerHTML = `
        <div style="
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: linear-gradient(45deg, #4CAF50, #8BC34A); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            flex-direction: column; 
            color: white; 
            font-size: 2em;
            font-family: Arial, sans-serif;
            text-align: center;
        ">
            <div style="font-size: 4em;">🎉</div>
            <div>IMPOSSIBLE! YOU CAUGHT IT!</div>
            <div style="font-size: 0.6em; margin-top: 20px;">After ${escapeCount} escapes...</div>
            <button onclick="location.reload()" style="
                margin-top: 30px; 
                padding: 15px 30px; 
                font-size: 0.8em; 
                border: none; 
                border-radius: 25px; 
                background: white; 
                color: #4CAF50; 
                cursor: pointer;
                font-weight: bold;
            ">TRY TO CATCH IT AGAIN!</button>
        </div>
    `;
});

// **BONUS: MAKE IT ESCAPE WHEN MOUSE MOVES TOO FAST**
let lastMouseX = 0;
let lastMouseY = 0;
let lastTime = 0;

document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime;

    if (timeDiff > 0) {
        const distance = Math.sqrt(
            Math.pow(e.clientX - lastMouseX, 2) +
            Math.pow(e.clientY - lastMouseY, 2)
        );
        const speed = distance / timeDiff;

        // If mouse moves too fast, trigger escape regardless of distance
        if (speed > 2) { // Adjust this value for sensitivity
            const buttonRect = button.getBoundingClientRect();
            const buttonX = buttonRect.left + buttonRect.width / 2;
            const buttonY = buttonRect.top + buttonRect.height / 2;
            const mouseDistance = Math.sqrt(
                Math.pow(e.clientX - buttonX, 2) +
                Math.pow(e.clientY - buttonY, 2)
            );

            if (mouseDistance < 200) {
                // Trigger the escape logic
                const event = new MouseEvent('mousemove', {
                    clientX: e.clientX,
                    clientY: e.clientY
                });
                document.dispatchEvent(event);
            }
        }
    }

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    lastTime = currentTime;
});