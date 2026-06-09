'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './NeuralCore3D.css';

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  scale: number;
  duration: number;
}

export function NeuralCore3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for tilt tracking
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);

  // Smooth springs for tilt
  const rotateXSpring = useSpring(rotateXVal, { stiffness: 150, damping: 25 });
  const rotateYSpring = useSpring(rotateYVal, { stiffness: 150, damping: 25 });

  // Map coordinate offsets to degree tilts (up to 20 deg tilt)
  const rotateX = useTransform(rotateXSpring, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(rotateYSpring, [-0.5, 0.5], [-20, 20]);

  // Particle positions helper
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  useEffect(() => {
    // Generate 12 random floating particle objects
    const items = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 260 - 130,
      y: Math.random() * 260 - 130,
      z: Math.random() * 100 - 50,
      scale: Math.random() * 0.8 + 0.4,
      duration: Math.random() * 3 + 2,
    }));
    setParticles(items);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Relative position from center (-0.5 to +0.5)
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    
    rotateXVal.set(y);
    rotateYVal.set(x);
  };

  const handleMouseLeave = () => {
    // Reset back to center
    rotateXVal.set(0);
    rotateYVal.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="neural-core-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="scanning-grid">
        <div className="scanning-bar" />
      </div>

      <motion.div
        className="neural-core-3d"
        style={{
          rotateX,
          rotateY,
        }}
      >
        {/* Core center sphere */}
        <div className="core-sphere-glow" />
        <div className="core-sphere" />

        {/* 3D concentric orbital rings */}
        <div className="orbital-ring ring-1">
          <div className="neural-node node-r1-1" />
          <div className="neural-node node-r1-2" />
          <div className="neural-node node-r1-3" />
        </div>

        <div className="orbital-ring ring-2">
          <div className="neural-node node-r2-1" />
          <div className="neural-node node-r2-2" />
          <div className="neural-node node-r2-3" />
        </div>

        <div className="orbital-ring ring-3">
          <div className="neural-node node-r3-1" />
          <div className="neural-node node-r3-2" />
        </div>

        {/* 3D drifting background particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="floating-particle"
            style={{
              x: p.x,
              y: p.y,
              z: p.z,
              scale: p.scale,
            }}
            animate={{
              y: [p.y - 15, p.y + 15, p.y - 15],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
