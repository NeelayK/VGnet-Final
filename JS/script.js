export function canvasLoad(numParticlesParameter=80, maxDistanceParameter =100, particleVelocityParamter=1.2, canvasName = "missionCanvas", RGBA = "150,150,150") {
    const canvas = document.getElementById(canvasName);
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;


    let particles = [];
    const numParticles = numParticlesParameter;
    const maxDistance = maxDistanceParameter;
    const particleVelocity = particleVelocityParamter;

    function createParticles() {
        for (let i = 0; i < numParticles; i++) {
            let gray = Math.floor(Math.random() * 200) + 55;

            particles.push({
                x: Math.random() * canvas.width ,
                y: Math.random() * canvas.height ,
                radius: Math.random() * 3 + 1,
                color: `rgb(${gray}, ${gray}, ${gray})`,
                velocityX: (Math.random() - 0.5) * particleVelocityParamter,
                velocityY: (Math.random() - 0.5) * particleVelocityParamter
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
    }

    function updateParticles() {
        for (let p of particles) {
            p.x += p.velocityX;
            p.y += p.velocityY;
            if (p.x <= 0 || p.x >= canvas.width) p.velocityX *= -1;
            if (p.y <= 0 || p.y >= canvas.height) p.velocityY *= -1;
        }
    }


    function drawParticleConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${RGBA} , ${1 - distance / maxDistance})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawParticles();
        drawParticleConnections();
        updateParticles();
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();

    window.addEventListener("resize", () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        particles = [];
        createParticles();
    });
};



