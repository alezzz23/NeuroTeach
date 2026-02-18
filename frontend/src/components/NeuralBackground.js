import React, { useRef, useEffect, useCallback } from 'react';

/**
 * Animated neural network background with cursor interactivity
 * - Subtle white lines on pure white background
 * - Cursor creates ripple/particle effects
 * - Slow autonomous animation
 */
function NeuralBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const nodesRef = useRef([]);
  const starsRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, ripples: [] });
  const timeRef = useRef(0);

  // Configuration
  const config = {
    nodeCount: 90,
    connectionDistance: 210,
    nodeRadius: 2,
    lineWidth: 0.95,
    baseOpacity: 0.34,
    hoverOpacity: 0.62,
    hoverDistance: 150,
    rippleDuration: 1000,
    rippleMaxRadius: 120,
    pulseSpeed: 0.002,
    driftSpeed: 0.15,
    starCount: 160,
    starMaxRadius: 1.2,
    starBaseOpacity: 0.35,
    spaceBackground: '#05060a',
  };

  // Initialize nodes
  const initNodes = useCallback((width, height) => {
    const nodes = [];
    // Offset nodes towards top-left
    const offsetX = width * 0.15;
    const offsetY = height * 0.1;
    const areaWidth = width * 0.6;
    const areaHeight = height * 0.5;

    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push({
        x: offsetX + Math.random() * areaWidth,
        y: offsetY + Math.random() * areaHeight,
        vx: (Math.random() - 0.5) * config.driftSpeed,
        vy: (Math.random() - 0.5) * config.driftSpeed,
        baseX: 0,
        baseY: 0,
        phase: Math.random() * Math.PI * 2,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
    nodesRef.current = nodes;

    const stars = [];
    for (let i = 0; i < config.starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * config.starMaxRadius,
        o: Math.random() * config.starBaseOpacity,
        tw: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const nodes = nodesRef.current;
    const stars = starsRef.current;
    const mouse = mouseRef.current;
    timeRef.current += config.pulseSpeed;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Space background
    ctx.fillStyle = config.spaceBackground;
    ctx.fillRect(0, 0, width, height);

    // Stars (subtle twinkle)
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = (Math.sin(timeRef.current * 8 + s.tw) * 0.5 + 0.5) * 0.6 + 0.4;
      const opacity = Math.min(1, s.o * twinkle);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    // Update nodes
    nodes.forEach((node, i) => {
      // Drift movement
      node.x += node.vx;
      node.y += node.vy;

      // Subtle pulse movement
      const pulse = Math.sin(timeRef.current * 2 + node.pulseOffset) * 0.3;
      node.x += pulse;
      node.y += pulse * 0.5;

      // Boundary check with soft bounce
      const margin = 50;
      if (node.x < margin) node.vx = Math.abs(node.vx) * 0.5;
      if (node.x > width - margin) node.vx = -Math.abs(node.vx) * 0.5;
      if (node.y < margin) node.vy = Math.abs(node.vy) * 0.5;
      if (node.y > height - margin) node.vy = -Math.abs(node.vy) * 0.5;

      // Mouse interaction - push nodes away
      if (mouse.active) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.hoverDistance && dist > 0) {
          const force = (config.hoverDistance - dist) / config.hoverDistance;
          const angle = Math.atan2(dy, dx);
          node.x += Math.cos(angle) * force * 2;
          node.y += Math.sin(angle) * force * 2;
        }
      }
    });

    // Draw connections
    ctx.strokeStyle = `rgba(230, 240, 255, ${config.baseOpacity})`;
    ctx.lineWidth = config.lineWidth;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectionDistance) {
          // Calculate opacity based on distance
          let opacity = config.baseOpacity * (1 - dist / config.connectionDistance);

          // Increase opacity near mouse
          if (mouse.active) {
            const midX = (nodes[i].x + nodes[j].x) / 2;
            const midY = (nodes[i].y + nodes[j].y) / 2;
            const mouseDist = Math.sqrt(
              (midX - mouse.x) ** 2 + (midY - mouse.y) ** 2
            );
            if (mouseDist < config.hoverDistance) {
              const hoverFactor = 1 - mouseDist / config.hoverDistance;
              opacity = Math.min(config.hoverOpacity, opacity + hoverFactor * 0.3);
            }
          }

          // Subtle color shift based on time
          const hueShift = Math.sin(timeRef.current + i * 0.1) * 5;
          ctx.strokeStyle = `rgba(${220 + hueShift}, ${235 + hueShift}, ${255}, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((node) => {
      let nodeOpacity = config.baseOpacity * 1.25;
      let nodeRadius = config.nodeRadius;

      // Highlight near mouse
      if (mouse.active) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.hoverDistance) {
          const factor = 1 - dist / config.hoverDistance;
          nodeOpacity = Math.min(0.7, nodeOpacity + factor * 0.5);
          nodeRadius = config.nodeRadius + factor * 2;
        }
      }

      // Pulse effect
      const pulse = Math.sin(timeRef.current * 3 + node.pulseOffset) * 0.3 + 0.7;
      nodeRadius *= pulse;

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 250, 255, ${nodeOpacity})`;
      ctx.fill();
    });

    // Draw ripples
    const now = Date.now();
    mouse.ripples = mouse.ripples.filter((ripple) => {
      const age = now - ripple.startTime;
      if (age > config.rippleDuration) return false;

      const progress = age / config.rippleDuration;
      const radius = progress * config.rippleMaxRadius;
      const opacity = (1 - progress) * 0.22;

      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140, 190, 255, ${opacity})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      return true;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (nodesRef.current.length === 0) {
        initNodes(canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initNodes]);

  // Mouse event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getRelative = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseMove = (e) => {
      const { x, y } = getRelative(e);
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      // ignore clicks outside the viewport region
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;
      mouseRef.current.ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        startTime: Date.now(),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('blur', handleMouseLeave);
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('blur', handleMouseLeave);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        background: '#05060a',
      }}
    />
  );
}

export default NeuralBackground;
