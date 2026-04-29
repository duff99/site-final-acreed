import { useEffect, useRef, useState } from 'react';

// Skip the particle field on coarse pointers (mobile/tablet) and when the
// user has asked the OS to reduce motion. Both signals point to "save
// battery and CPU"; the canvas easily eats 30–40% CPU on entry-level
// phones for a purely decorative effect.
const shouldSkipParticles = () => {
    if (typeof window === 'undefined' || typeof matchMedia === 'undefined') return false;
    return (
        matchMedia('(pointer: coarse)').matches ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
    );
};

const ParticleCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [skip, setSkip] = useState(() => shouldSkipParticles());

    useEffect(() => {
        const update = () => setSkip(shouldSkipParticles());
        const coarse = matchMedia('(pointer: coarse)');
        const motion = matchMedia('(prefers-reduced-motion: reduce)');
        coarse.addEventListener('change', update);
        motion.addEventListener('change', update);
        return () => {
            coarse.removeEventListener('change', update);
            motion.removeEventListener('change', update);
        };
    }, []);

    if (skip) return null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        class Particle {
            x: number;
            y: number;
            size: number;
            speed: number;
            angle: number;
            angleSpeed: number;
            baseAlpha: number;
            pulseSpeed: number;
            pulseOffset: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;

                // Le rayon est maintenant entre 1px et 3px (diamètre de 2px à 6px)
                this.size = Math.random() * 2 + 1;

                this.speed = Math.random() * 0.15 + 0.05;
                this.angle = Math.random() * Math.PI * 2;
                this.angleSpeed = (Math.random() - 0.5) * 0.01;

                this.baseAlpha = Math.random() * 0.25 + 0.05;
                this.pulseSpeed = Math.random() * 1.5 + 0.5;
                this.pulseOffset = Math.random() * Math.PI * 2;
            }

            update() {
                this.angle += this.angleSpeed;
                if (Math.random() < 0.01) {
                    this.angleSpeed = (Math.random() - 0.5) * 0.02;
                }
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;

                const margin = 20;
                if (this.x < -margin) this.x = canvas!.width + margin;
                if (this.x > canvas!.width + margin) this.x = -margin;
                if (this.y < -margin) this.y = canvas!.height + margin;
                if (this.y > canvas!.height + margin) this.y = -margin;
            }

            draw() {
                let currentAlpha = this.baseAlpha + Math.sin(Date.now() * 0.001 * this.pulseSpeed + this.pulseOffset) * 0.2;
                currentAlpha = Math.max(0.02, Math.min(0.5, currentAlpha));

                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                ctx!.fillStyle = `rgba(219, 204, 165, ${currentAlpha})`;

                // L'ombre s'adapte proportionnellement à la nouvelle taille
                ctx!.shadowBlur = this.size * 3 + 1;
                ctx!.shadowColor = `rgba(219, 204, 165, ${currentAlpha * 0.8})`;

                ctx!.fill();
                ctx!.shadowBlur = 0;
                ctx!.closePath();
            }
        }

        let particlesArray: Particle[] = [];
        const numberOfParticles = 80;
        let animationFrameId: number;

        const resizeCanvas = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Generate particles
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const animate = () => {
            // Clearing the rect to keep it completely transparent over the dark #0A0A0A background
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,   // Behinds content but in front of body background
                pointerEvents: 'none'
            }}
        />
    );
};

export default ParticleCanvas;
