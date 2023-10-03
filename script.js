const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const spaceshipWidth = 40;
const spaceshipHeight = 20;
let spaceshipX = canvas.width / 2 - spaceshipWidth / 2;
const spaceshipSpeed = 10;
let points = 0;
const pointsDisplay = document.getElementById('pointsDisplay');

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
let AlienBulletSpeed = 5;
let gameActive = true;

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
    const alienSpeed = 1;
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

                if (Math.random() < 0.0005 && !alien.canShoot) {
                    alien.canShoot = true;
                }
                if (alien.canShoot) {
                    alien.alienBulletY += AlienBulletSpeed;

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

function checkCollisionWithPlayer() {
    for (let c = 0; c < alienColCount; c++) {
        for (let r = 0; r < alienRowCount; r++) {
            const alien = aliens[c][r];
            if (alien.alive && alien.canShoot) {
                const alienBulletLeft = alien.x + alienWidth / 2 - bulletWidth / 2;
                const alienBulletRight = alienBulletLeft + bulletWidth;
                const alienBulletTop = alien.alienBulletY;
                const alienBulletBottom = alienBulletTop + bulletHeight;

                const playerLeft = spaceshipX;
                const playerRight = spaceshipX + spaceshipWidth;
                const playerTop = canvas.height - spaceshipHeight;
                const playerBottom = canvas.height;

                // Katso osuma
                if (
                    alienBulletRight >= playerLeft &&
                    alienBulletLeft <= playerRight &&
                    alienBulletBottom >= playerTop &&
                    alienBulletTop <= playerBottom
                ) {
                    // Osuma tapahtui
                    gameOver();
                }
            }
        }
    }
}
// Game over teksti
function gameOver() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game over!', canvas.width / 2 - 80, canvas.height / 2);
    ctx.fillText('Points: ' + points, canvas.width / 2 - 80, canvas.height / 2 + 30);
    ctx.fillText('Press "R" to restart! ', canvas.width / 2 - 80, canvas.height / 2 + 60);
    gameActive = false;
}
// Voitto teksti
function gameWon() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'green';
    ctx.fillText('You won!', canvas.width / 2 - 80, canvas.height / 2);
    ctx.fillText('Points: ' + points, canvas.width / 2 - 80, canvas.height / 2 + 30);
    ctx.fillText('Press "R" to restart! ', canvas.width / 2 - 80, canvas.height / 2 + 60);
    gameActive = false;
}

function draw() {
    if (gameActive) {
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

        // Päivitetään pisteet
        pointsDisplay.textContent = 'Points: ' + points;
        // Katsotaan osumat pelaajaan
        checkCollisionWithPlayer();

        // Katsotaan onko peli voitettu
        if (points === alienRowCount * alienColCount) {
            gameWon();
        }
        requestAnimationFrame(draw);
    }
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
    } else if (e.key === 'r') {
        location.reload();
    }
});


draw();

