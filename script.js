const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const spaceshipWidth = 40;
const spaceshipHeight = 20;
let spaceshipX = canvas.width / 2 - spaceshipWidth / 2;
const spaceshipSpeed = 5;
let points = 0;

const alienWidth = 25;
const alienHeight = 15;
const alienRowCount = 4;
const alienColCount = 5;
const aliens = [];

for (let c = 0; c < alienColCount; c++) {
    aliens[c] = [];
    for (let r = 0; r < alienRowCount; r++) {
        const x = c * (alienWidth + 10);
        const y = r * (alienHeight + 10);
        aliens[c][r] = { 
            x,
            y,
            alive: true,
            direction: 1,
            canShoot: false,
            alienBulletY: y + alienHeight 
        };
    }
}

const bulletWidth = 2;
const bulletHeight = 10;
let bulletX = spaceshipX + spaceshipWidth / 2 - bulletWidth / 2;
let bulletY = canvas.height - spaceshipHeight;
let bulletSpeed = 10;
let bulletFired = false;

// Vihollisten piirtäminen
function drawAliens() {
    ctx.fillStyle = "green";
    for (let c = 0; c < alienColCount; c++) {
        for (let r = 0; r < alienRowCount; r++) {
            if (aliens[c][r].alive) {
                const alienX = aliens[c][r].x;
                const alienY = aliens[c][r].y;
                ctx.fillRect(alienX, alienY, alienWidth, alienHeight);
            }
        }
    }
}

// Vihollisten liikuttaminen ja vihollisten ampuminen satunnaisesti
function moveAliens() {
    const alienSpeed = 1.5;
    let changeDirection = false;

    for (let r = 0; r < alienRowCount; r++) {
        let leftMostX = canvas.width;
        let rightMostX = 0;

        for (let c = 0; c < alienColCount; c++) {
            const alien = aliens[c][r];
            
            if (alien.alive) {
                alien.x += alien.direction * alienSpeed;
                leftMostX = Math.min(leftMostX, alien.x);
                rightMostX = Math.max(rightMostX, alien.x + alienWidth);

                if (Math.random() < 0.002 && !alien.canShoot) {
                    alien.canShoot = true;
                }
                if (alien.canShoot) {
                    alien.alienBulletY += bulletSpeed;

                    if (alien.alienBulletY > canvas.height) {
                        alien.alienBulletY = alien.y + alienHeight;
                        alien.canShoot = false;
                    }
                }
            }
        }

        // Kun reunimmainen alien saavuttaa kentän reunan, suunta vaihtuu.
        if ( leftMostX <= 0 || rightMostX >= canvas.width) {
            changeDirection = true;
        }
    }

    // Viholliset liikkuvat toiseen suuntaan
    if (changeDirection) {
        for (let c = 0; c < alienColCount; c++) {
            for (let r = 0; r < alienRowCount; r++) {
                const alien = aliens[c][r];

                if (alien.alive) {
                    alien.direction *= -1;
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = 'white';
    ctx.fillRect(spaceshipX, canvas.height - spaceshipHeight, spaceshipWidth, spaceshipHeight);

    // Kutsutaan vihollisten piirtämisfunktiota
    drawAliens();

    for (let c = 0; c < alienColCount; c++) {
        for (let r = 0; r < alienRowCount; r++) {
            const alien = aliens[c][r];

            if (alien.alive && alien.canShoot) {
                ctx.fillStyle = "blue";
                ctx.fillRect(alien.x + alienWidth / 2 - bulletWidth / 2, alien.alienBulletY, bulletWidth, bulletHeight);
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

    // Kutsutaan vihollisten liikuttamisfunktiota
    moveAliens();
    
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

