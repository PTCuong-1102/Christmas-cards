// Snow Effect
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
let width, height, snowflakes;

function initSnow() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    snowflakes = [];
    const snowflakeCount = width > 768 ? 300 : 100; // More snow on desktop

    for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 3 + 1, // varied size
            v: Math.random() * 1.5 + 0.5, // speed
            o: Math.random() * 0.8, // opacity
            sway: Math.random() * 0.05 // horizontal sway speed
        });
    }
}

function drawSnow() {
    ctx.clearRect(0, 0, width, height);

    // Add a subtle gradient brightness to snow for realism
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.4)");
    ctx.fillStyle = gradient;

    for (let i = 0; i < snowflakes.length; i++) {
        let f = snowflakes[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${f.o})`;
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
        ctx.fill();
    }
    moveSnow();
}

function moveSnow() {
    for (let i = 0; i < snowflakes.length; i++) {
        let f = snowflakes[i];
        f.y += f.v;
        f.x += Math.sin(f.y * 0.01 + f.sway * 100) * 0.5; // Natural swaying

        if (f.y > height) {
            snowflakes[i].y = -10;
            snowflakes[i].x = Math.random() * width;
        }
    }
}

function animateSnow() {
    drawSnow();

    // Fireworks
    for (let i = 0; i < fireworks.length; i++) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update(i);
    }

    // Random fireworks occasionally when surprise is open
    const surpriseBox = document.getElementById('surpriseBox');
    if (surpriseBox && surpriseBox.style.display === 'block' && Math.random() < 0.05) {
        launchFirework();
    }

    requestAnimationFrame(animateSnow);
}

function launchFirework() {
    const startX = Math.random() * width;
    const targetX = Math.random() * width;
    const targetY = Math.random() * (height / 2);
    fireworks.push(new Firework(startX, height, targetX, targetY));
}

// Interaction Logic
function toggleCard() {
    const card = document.getElementById('mainCard');
    const isOpen = card.classList.contains('open');

    if (!isOpen) {
        card.classList.add('open');
        createSparkles(window.innerWidth / 2, window.innerHeight / 2, 20);
        // Play sound if added later
    } else {
        card.classList.remove('open');
    }
}

function showSurprise(e) {
    e.stopPropagation(); // Prevent card from toggling
    const overlay = document.querySelector('.overlay');
    const surpriseBox = document.getElementById('surpriseBox');

    overlay.style.display = 'block';
    surpriseBox.style.display = 'block';

    // Animate entry
    requestAnimationFrame(() => {
        surpriseBox.style.opacity = '0';
        surpriseBox.style.transform = 'translate(-50%, -40%) scale(0.9)';

        setTimeout(() => {
            surpriseBox.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            surpriseBox.style.opacity = '1';
            surpriseBox.style.transform = 'translate(-50%, -50%) scale(1)';

            // Start features
            startTyping();
            startCarousel();
        }, 10);
    });

    createSparkles(window.innerWidth / 2, window.innerHeight / 2, 40);
}

function closeSurprise() {
    const overlay = document.querySelector('.overlay');
    const surpriseBox = document.getElementById('surpriseBox');

    surpriseBox.style.opacity = '0';
    surpriseBox.style.transform = 'translate(-50%, -40%) scale(0.9)';

    setTimeout(() => {
        overlay.style.display = 'none';
        surpriseBox.style.display = 'none';
        stopCarousel(); // Stop to save resources
        resetTyping();
    }, 300);
}

// Typing Effect
const message = "Bé biết không? Mùa đông này chẳng hề lạnh chút nào vì trong lòng anh luôn có hình bóng của nàng. Giáng sinh này, món quà duy nhất anh ước ao chính là được che chở và đồng hành cùng bé Thùy thêm thật nhiều mùa Noel nữa. thương bé cute ❤️";
let typingTimeout;

function startTyping() {
    const el = document.getElementById('typingText');
    el.innerHTML = '';
    let i = 0;

    function type() {
        if (i < message.length) {
            el.innerHTML += message.charAt(i);
            i++;
            typingTimeout = setTimeout(type, 50); // Speed
        }
    }
    type();
}

function resetTyping() {
    clearTimeout(typingTimeout);
    document.getElementById('typingText').innerHTML = '';
}

// Carousel Logic
let currentSlide = 0;
let carouselInterval;
const slides = document.querySelectorAll('.carousel-track > div');
const totalSlides = 3; // Hardcoded matches HTML

function updateCarousel() {
    const track = document.querySelector('.carousel-track');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide(e) {
    if (e) e.stopPropagation();
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide(e) {
    if (e) e.stopPropagation();
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function startCarousel() {
    stopCarousel();
    carouselInterval = setInterval(() => nextSlide(null), 3000);
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

// Visual Effects
function createSparkles(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';

        // Random properties
        const size = Math.random() * 10 + 2;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;

        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        s.style.width = size + 'px';
        s.style.height = size + 'px';
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        s.style.setProperty('--tx', `${tx}px`);
        s.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1200);
    }
}

// Fireworks
class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.distanceToTarget = Math.hypot(x - targetX, y - targetY);
        this.distanceTraveled = 0;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = Math.random() * 50 + 50;
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;

        this.distanceTraveled = Math.hypot(this.startX - this.x, this.startY - this.y);

        if (this.distanceTraveled >= this.distanceToTarget) {
            createParticles(this.targetX, this.targetY);
            fireworks.splice(index, 1);
        } else {
            this.x += vx;
            this.y += vy;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
        ctx.stroke();
    }
}

let fireworks = [];
let particles = [];

function createParticles(x, y) {
    let particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 10 + 1;
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = Math.random() * 360;
        this.brightness = Math.random() * 50 + 50;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.015;
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
            particles.splice(index, 1);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();
    }
}

function updateFireworks() {
    // We'll reuse the snow canvas for fireworks for simplicity/performance
    // Note: drawSnow clears rect, so we need to integrate or layer.
    // Better: separate loop or call from animateSnow.
    // Let's integrate into 'drawSnow' or 'animateSnow' flow?
    // Actually, 'animateSnow' calls 'drawSnow' which clears rect.
    // So we should add firework drawing AFTER snow drawing in animateSnow()
}

// Let's modify 'animateSnow' to handle fireworks too
// We need to inject the firework update loop into existing animation loop.

// Initialization
window.addEventListener('resize', initSnow);
window.addEventListener('load', () => {
    initSnow();
    animateSnow();
});

// Music Control
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        music.pause();
        musicIcon.textContent = '🔇';
        musicBtn.classList.remove('animate-spin-slow');
    } else {
        music.play().then(() => {
            musicIcon.textContent = '🎵';
            musicBtn.classList.add('animate-spin-slow');
        }).catch(err => {
            console.log("Audio play failed (interaction needed):", err);
        });
    }
    isPlaying = !isPlaying;
}

// Auto-play attempt on load and first interaction
window.addEventListener('load', () => {
    // Try to play immediately
    toggleMusic();
});

document.body.addEventListener('click', () => {
    if (!isPlaying) {
        toggleMusic();
    }
}, { once: true });

document.body.addEventListener('touchstart', () => {
    if (!isPlaying) {
        toggleMusic();
    }
}, { once: true });
