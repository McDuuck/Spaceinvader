const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const spaceshipWidth = 40;
const spaceshipHeight = 20;
let spaceshipX = canvas.width / 2 - spaceshipWidth / 2;
const spaceshipSpeed = 5;
let points = 0;

const alienWidth = 30;
const alienHeight = 20;
const alienRowCount = 4;
const alienColCount = 5;
const aliens = [];

for (let c = 0; c < alienColCount; c++) {
    aliens[c] = [];
    for (let r = 0; r < alienRowCount; r++) {
        aliens[c][r] = { x: 0, y: 0, alive: true };
    }
}

const bulletWidth = 3;
const bulletHeight = 10;
let bulletX = spaceshipX + spaceshipWidth / 2 - bulletWidth / 2;
let bulletY = canvas.height - spaceshipHeight;
let bulletSpeed = 10;
let bulletFired = false;


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = 'white';
    ctx.fillRect(spaceshipX, canvas.height - spaceshipHeight, spaceshipWidth, spaceshipHeight);

   
    for (let c = 0; c < alienColCount; c++) {
        for (let r = 0; r < alienRowCount; r++) {
            if (aliens[c][r].alive) {
                const alienX = c * (alienWidth + 10);
                const alienY = r * (alienHeight + 10);
                aliens[c][r].x = alienX;
                aliens[c][r].y = alienY;
                ctx.fillRect(alienX, alienY, alienWidth, alienHeight);
            }
        }
    }

   
    if (bulletFired) {
        ctx.fillStyle = 'red';
        ctx.fillRect(bulletX, bulletY, bulletWidth, bulletHeight);

       
        bulletY -= bulletSpeed;

        
        for (let c = 0; c < alienColCount; c++) {
            for (let r = 0; r < alienRowCount; r++) {
                const alien = aliens[c][r];
                if (alien.alive) {
                    if (bulletX > alien.x && bulletX < alien.x + alienWidth &&
                        bulletY > alien.y && bulletY < alien.y + alienHeight) {
                        points++;
                        alien.alive = false;
                        bulletFired = false;
                        bulletX = spaceshipX + spaceshipWidth / 2 - bulletWidth / 2;
                        bulletY = canvas.height - spaceshipHeight;
                        console.log(points);
                    }
                }
            }
        }

        
        if (bulletY < 0) {
            bulletFired = false;
            bulletX = spaceshipX + spaceshipWidth / 2 - bulletWidth / 2;
            bulletY = canvas.height - spaceshipHeight;
        }
    }

    requestAnimationFrame(draw);
}


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && spaceshipX > 0) {
        spaceshipX -= spaceshipSpeed;
    } else if (e.key === 'ArrowRight' && spaceshipX + spaceshipWidth < canvas.width) {
        spaceshipX += spaceshipSpeed;
    } else if (e.key === 'ArrowUp' && !bulletFired) {
        bulletX = spaceshipX + spaceshipWidth / 2 - bulletWidth / 2;
        bulletY = canvas.height - spaceshipHeight;
        bulletFired = true;
    }
});


draw();

