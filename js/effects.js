/* =================================================================
   EFFECTS.JS - Visual effects (Three.js, Particles, Timeline Parallax)
   Lazy loaded for non-critical visual enhancements
   ================================================================= */

// Three.js Interactive Hero Background
export function initThreeHero() {
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded yet');
        return;
    }

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 50;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 1000 : 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: window.innerWidth < 768 ? 0.8 : 1.2,
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = mouseY * 0.1;
        particlesMesh.rotation.z = mouseX * 0.1;
        
        particlesMesh.position.x = mouseX * 5;
        particlesMesh.position.y = mouseY * 5;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Particle System for Sections
export class ParticleSystem {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.options = {
            maxParticles: options.maxParticles || 40,
            color: options.color || '#00d4ff',
            speed: options.speed || 0.3,
            size: options.size || 2,
            ...options
        };

        this.particles = [];
        this.init();
    }

    init() {
        for (let i = 0; i < this.options.maxParticles; i++) {
            this.createParticle();
        }
        this.animate();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${this.options.size}px`;
        particle.style.height = `${this.options.size}px`;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = this.options.color;
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.pointerEvents = 'none';

        const data = {
            element: particle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            speedX: (Math.random() - 0.5) * this.options.speed,
            speedY: (Math.random() - 0.5) * this.options.speed
        };

        particle.style.left = `${data.x}%`;
        particle.style.top = `${data.y}%`;

        this.container.appendChild(particle);
        this.particles.push(data);
    }

    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > 100) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > 100) particle.speedY *= -1;

            particle.element.style.left = `${particle.x}%`;
            particle.element.style.top = `${particle.y}%`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Timeline Parallax Effect
export function initTimelineParallax() {
    const milestones = document.querySelectorAll('.milestone-card');
    if (milestones.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    milestones.forEach((milestone, index) => {
        milestone.style.opacity = '0';
        milestone.style.transform = 'translateY(50px)';
        milestone.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(milestone);
    });

    // Parallax scroll effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        parallaxLayers.forEach((layer, index) => {
            const speed = (index + 1) * 0.05;
            layer.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialize all particle systems
export function initAllParticleSystems() {
    const isMobile = window.innerWidth < 768;
    const particleDensity = isMobile ? 0.5 : 1;

    const systems = [
        new ParticleSystem('chiefGuestParticles', { maxParticles: Math.round(30 * particleDensity), color: '#00d4ff', speed: 0.2, size: 2 }),
        new ParticleSystem('leadershipParticles', { maxParticles: Math.round(35 * particleDensity), color: '#8b5cf6', speed: 0.15, size: 2 }),
        new ParticleSystem('eventsParticles', { maxParticles: Math.round(40 * particleDensity), color: '#00d4ff', speed: 0.3, size: 2 }),
        new ParticleSystem('historyParticles', { maxParticles: Math.round(30 * particleDensity), color: '#60a5fa', speed: 0.2, size: 2 }),
        new ParticleSystem('contactParticles', { maxParticles: Math.round(32 * particleDensity), color: '#00d4ff', speed: 0.25, size: 2 }),
        new ParticleSystem('footerParticleContainer', { maxParticles: Math.round(40 * particleDensity), color: '#00d4ff', speed: 0.3, size: 2 })
    ];

    return systems;
}
