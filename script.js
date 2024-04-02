        // Creating canvassssss
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');

        // Circle and arrow objects
        let initialState = [
            { circle: { x: 200, y: 100, radius: 30, color: '#F08080', hit: false }, arrow: { x: 600, y: 100, width: 40, height: 30, color: '#000', dx: 0, dy: 0, speed: 4, moving: false, visible: true } },
            { circle: { x: 200, y: 200, radius: 30, color: '#9966CC', hit: false }, arrow: { x: 600, y: 200, width: 40, height: 30, color: '#000', dx: 0, dy: 0, speed: 4, moving: false, visible: true } },
            { circle: { x: 200, y: 300, radius: 30, color: '#006D6F', hit: false }, arrow: { x: 600, y: 300, width: 40, height: 30, color: '#000', dx: 0, dy: 0, speed: 4, moving: false, visible: true } },
            { circle: { x: 200, y: 400, radius: 30, color: '#5D8AA8', hit: false }, arrow: { x: 600, y: 400, width: 40, height: 30, color: '#000', dx: 0, dy: 0, speed: 4, moving: false, visible: true } }
        ];

        let elements = JSON.parse(JSON.stringify(initialState));

        // Calculate initial arrow directions
        function calculateArrowDirections() {
            elements.forEach(element => {
                const angle = Math.atan2(element.circle.y - element.arrow.y, element.circle.x - element.arrow.x);
                element.arrow.dx = Math.cos(angle) * element.arrow.speed;
                element.arrow.dy = Math.sin(angle) * element.arrow.speed;
            });
        }

        // Function to draw circles
        function drawCircles() {
            elements.forEach(element => {
                ctx.beginPath();
                ctx.arc(element.circle.x, element.circle.y, element.circle.radius, 0, Math.PI * 2);
                ctx.fillStyle = element.circle.color;
                ctx.fill();
                ctx.strokeStyle = '#000'; 
                ctx.lineWidth = 1; 
                ctx.stroke(); 
                ctx.closePath();
            });
        }


        // Function to draw arrows
        function drawArrows() {
            elements.forEach(element => {
                if (element.arrow.visible) {
                    ctx.save();
                    ctx.translate(element.arrow.x, element.arrow.y);
                    const angle = Math.atan2(element.circle.y - element.arrow.y, element.circle.x - element.arrow.x);
                    ctx.rotate(angle);
                    ctx.beginPath();
                    ctx.moveTo(0, -element.arrow.height / 2); 
                    ctx.lineTo(element.arrow.width, 0);
                    ctx.lineTo(0, element.arrow.height / 2);
                    ctx.fillStyle = element.arrow.color;
                    ctx.fill();
                    ctx.restore();
                }
            });
        }


        
        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Function to update arrow positions
        function updateArrows() {
            elements.forEach(element => {
                if (element.arrow.moving) {
                    
                    element.arrow.x += element.arrow.dx;
                    element.arrow.y += element.arrow.dy;
                
                    const distanceToCenter = Math.sqrt((element.circle.x - element.arrow.x) ** 2 + (element.circle.y - element.arrow.y) ** 2);
            
                    const distanceToEdge = distanceToCenter - element.circle.radius;

                    if (distanceToEdge <= element.arrow.width / 1) {
                        
                        element.arrow.moving = false;
                        element.circle.color = '#ccc'; 
                    }
                }
            });
        }


        // Function to reset the application
        function reset() {
            elements = JSON.parse(JSON.stringify(initialState));
            calculateArrowDirections();
        }

        // Function to redraw everything
        function draw() {
            clearCanvas();
            drawCircles();
            drawArrows();
            updateArrows();
            requestAnimationFrame(draw);
        }

        
        reset();
        draw();

        
        canvas.addEventListener('click', handleClick);

        // Function for handling mouse click
        function handleClick(event) {
            const clickX = event.clientX - canvas.offsetLeft;
            const clickY = event.clientY - canvas.offsetTop;

            elements.forEach(element => {
                const distance = Math.sqrt((clickX - element.circle.x) ** 2 + (clickY - element.circle.y) ** 2);
                if (distance <= element.circle.radius) {
                    elements.forEach(e => e.arrow.moving = false);   // Reset all arrows to not moving
                    element.arrow.moving = true;                           // Set only the clicked arrow to moving
                }
            });
        }

        // Reset button
        const resetButton = document.getElementById('resetButton');
        resetButton.addEventListener('click', reset);
