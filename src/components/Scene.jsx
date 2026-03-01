import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'

// Deep space black background
const BG_COLOR = '#050505'

// Gradient colors
const COLOR_CYAN = new THREE.Color('#A855F7') // Electric Purple
const COLOR_INDIGO = new THREE.Color('#7E22CE') // Deep Purple
const COLOR_GOLD = new THREE.Color('#84CC16') // Cyber Lime

// Transformer Embeddings: Define the "Tokens"
// Instead of random points, we dedicate a specific cluster location to each portfolio section (Token).
// Q, K, V are implicitly represented by how they connect.
const TOKENS = [
    { id: 0, name: "Input Embedding", center: new THREE.Vector3(0, 0, 0), size: 600 },
    { id: 1, name: "About", center: new THREE.Vector3(-40, -50, -80), size: 400 },
    { id: 2, name: "Multi-Head Attention", center: new THREE.Vector3(50, -100, -160), size: 700 },
    { id: 3, name: "Feed-Forward Network", center: new THREE.Vector3(-50, -150, -240), size: 500 },
    { id: 4, name: "Softmax Output", center: new THREE.Vector3(0, -200, -320), size: 400 }
];

const TOTAL_POINTS = TOKENS.reduce((acc, t) => acc + t.size, 0);

function generateTransformerState() {
    const positions = new Float32Array(TOTAL_POINTS * 3);
    const colors = new Float32Array(TOTAL_POINTS * 3);
    const basePositions = new Float32Array(TOTAL_POINTS * 3);
    const noiseOffsets = new Float32Array(TOTAL_POINTS);

    let idx = 0;

    const addPoint = (x, y, z, cx, cy, cz, tokenIdx) => {
        positions[idx * 3] = x + cx;
        positions[idx * 3 + 1] = y + cy;
        positions[idx * 3 + 2] = z + cz;

        basePositions[idx * 3] = positions[idx * 3];
        basePositions[idx * 3 + 1] = positions[idx * 3 + 1];
        basePositions[idx * 3 + 2] = positions[idx * 3 + 2];

        // Tokens have distinct color bases for their 'Values'
        let baseColor = COLOR_CYAN;
        if (tokenIdx % 2 !== 0) baseColor = COLOR_INDIGO;

        const ratio = Math.random();
        const color = new THREE.Color().lerpColors(baseColor, COLOR_GOLD, ratio > 0.9 ? 0.7 : 0.1);

        colors[idx * 3] = color.r;
        colors[idx * 3 + 1] = color.g;
        colors[idx * 3 + 2] = color.b;

        noiseOffsets[idx] = Math.random() * Math.PI * 2;
        idx++;
    };

    // Generate clusters for each token
    TOKENS.forEach((token, tIdx) => {
        // We use spherical distribution to represent the "embedding space" of a token
        for (let i = 0; i < token.size; i++) {
            const r = 2 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            addPoint(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi),
                token.center.x, token.center.y, token.center.z,
                tIdx
            );
        }
    });

    return { positions, colors, basePositions, noiseOffsets };
}

// Global state to pass active token index to the beams
window.activeTokenIdx = 0;

function AttentionBeams() {
    const lineGeoRef = useRef();
    const lineMatRef = useRef();

    // Generate all possible connections between token centers
    const { linePositions, lineColors } = useMemo(() => {
        const p = [];
        const c = [];
        const numTokens = TOKENS.length;

        for (let i = 0; i < numTokens; i++) {
            for (let j = 0; j < numTokens; j++) {
                if (i !== j) {
                    p.push(TOKENS[i].center.x, TOKENS[i].center.y, TOKENS[i].center.z);
                    p.push(TOKENS[j].center.x, TOKENS[j].center.y, TOKENS[j].center.z);
                    // Initial color (faded cyan)
                    c.push(0, 0.94, 1, 0, 0.94, 1);
                }
            }
        }
        return {
            linePositions: new Float32Array(p),
            lineColors: new Float32Array(c)
        };
    }, []);

    useFrame((state) => {
        if (!lineGeoRef.current || !lineMatRef.current) return;

        const colors = lineGeoRef.current.attributes.color.array;
        const time = state.clock.elapsedTime;

        let idx = 0;
        const numTokens = TOKENS.length;

        // Mock Attention Mechanism: Softmax(Q * K^T)
        // Highly simplified: the active token has strong lines to others, others have weak/no lines
        for (let q = 0; q < numTokens; q++) {
            for (let k = 0; k < numTokens; k++) {
                if (q !== k) {
                    // Base brightness depends on whether this is the active Query token
                    let attentionScore = (q === window.activeTokenIdx) ? 0.8 : 0.05;

                    // Add some noise/pulse to simulate continuous calculation
                    attentionScore += Math.sin(time * 2 + q + k) * 0.1;

                    // Make the line color intense GOLD if highly attended, else faded CYAN
                    const targetColor = attentionScore > 0.5 ? COLOR_GOLD : COLOR_CYAN;

                    // Vertex 1 (Query origin)
                    colors[idx * 6] = targetColor.r * attentionScore;
                    colors[idx * 6 + 1] = targetColor.g * attentionScore;
                    colors[idx * 6 + 2] = targetColor.b * attentionScore;

                    // Vertex 2 (Key destination)
                    colors[idx * 6 + 3] = targetColor.r * attentionScore * 0.5; // Fades out towards target
                    colors[idx * 6 + 4] = targetColor.g * attentionScore * 0.5;
                    colors[idx * 6 + 5] = targetColor.b * attentionScore * 0.5;

                    idx++;
                }
            }
        }

        lineGeoRef.current.attributes.color.needsUpdate = true;
    });

    return (
        <lineSegments>
            <bufferGeometry ref={lineGeoRef}>
                <bufferAttribute
                    attach="attributes-position"
                    count={linePositions.length / 3}
                    array={linePositions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={lineColors.length / 3}
                    array={lineColors}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial
                ref={lineMatRef}
                vertexColors
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                linewidth={2}
            />
        </lineSegments>
    );
}

function TransformerEmbeddings() {
    const pointsRef = useRef();
    const { positions, colors, basePositions, noiseOffsets } = useMemo(() => generateTransformerState(), []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.elapsedTime;
        const pos = pointsRef.current.geometry.attributes.position.array;

        // V (Value) Matrix Aggregation Animation
        // Points belonging to the active token pulse larger/faster

        let ptIdx = 0;
        for (let t = 0; t < TOKENS.length; t++) {
            const tokenSize = TOKENS[t].size;
            const isActive = (t === window.activeTokenIdx);

            for (let i = 0; i < tokenSize; i++) {
                const i3 = ptIdx * 3;
                const noise = noiseOffsets[ptIdx];
                const bx = basePositions[i3];
                const by = basePositions[i3 + 1];
                const bz = basePositions[i3 + 2];

                // If active, strong chaotic movement (representing QKV matrix multiplication)
                // If inactive, gentle idle breathing
                const speedMulti = isActive ? 2.5 : 0.5;
                const distMulti = isActive ? 0.4 : 0.1;

                pos[i3] = bx + Math.sin(time * speedMulti + noise) * distMulti;
                pos[i3 + 1] = by + Math.cos(time * speedMulti * 0.8 + noise) * distMulti;
                pos[i3 + 2] = bz + Math.sin(time * speedMulti * 1.2 + noise) * distMulti;

                ptIdx++;
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={TOTAL_POINTS}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={TOTAL_POINTS}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={2.5}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={false}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function CameraWarpController() {
    const scroll = useScroll()
    const { camera } = useThree()

    // Need to communicate aberration intensity to the post-processing
    // We'll use a globally accessible object for simplicity since Drei's ScrollControls doesn't easily pass state up
    window.warpIntensity = 0

    const cameraOffsets = [
        new THREE.Vector3(0, 0, 15),          // Input
        new THREE.Vector3(0, 2, 20),          // About
        new THREE.Vector3(0, 0, 25),          // Attention
        new THREE.Vector3(0, 5, 20),          // FFN
        new THREE.Vector3(0, 0, 20)           // Output
    ]

    useFrame(() => {
        const progress = scroll.offset * (TOKENS.length - 1) // 0 to 4

        let activeIdx = Math.round(progress);
        activeIdx = Math.max(0, Math.min(activeIdx, TOKENS.length - 1));

        if (window.activeTokenIdx !== activeIdx) {
            window.activeTokenIdx = activeIdx;
            window.dispatchEvent(new CustomEvent('tokenChanged'));
        }

        const segment = Math.min(Math.floor(progress), TOKENS.length - 2) // Current segment index
        const t = progress - segment // 0 to 1 within the current segment

        // Determine target clusters
        const currentCenter = TOKENS[segment].center
        const nextCenter = TOKENS[segment + 1].center
        const currOffset = cameraOffsets[segment]
        const nextOffset = cameraOffsets[segment + 1]

        // Warp logic: slow -> SUPER FAST JUMP -> slow
        // t goes from 0 to 1 between two pages

        // Apply quintic easing for a very sharp middle acceleration (jump)
        // ease = 0 for a while, jumps to 1 in the middle 30%, stays 1
        let ease = 0
        if (t > 0.3 && t < 0.7) {
            // mapping 0.3 -> 0.7 to 0 -> 1
            const normalizedT = (t - 0.3) / 0.4
            // smoothstep
            ease = normalizedT * normalizedT * (3 - 2 * normalizedT)
        } else if (t >= 0.7) {
            ease = 1
        }

        // Aberration intensity spikes during the warp (t=0.3 to 0.7)
        let warpIntensity = 0
        if (t > 0.3 && t < 0.7) {
            const spike = Math.sin(((t - 0.3) / 0.4) * Math.PI)
            warpIntensity = spike
        }
        window.warpIntensity = warpIntensity

        // Parallax from mouse
        // Note: scroll.offset might not have mouse pointer attached easily here, skip for simplicity during warp, 
        // or we can just use the fixed camera jumps

        // Interpolate positions
        const targetCenter = new THREE.Vector3().lerpVectors(currentCenter, nextCenter, ease)
        const targetCamOffset = new THREE.Vector3().lerpVectors(currOffset, nextOffset, ease)

        // Zoom out arc during warp
        const zoomOut = warpIntensity * 20 // pulls camera back during jump

        camera.position.x = targetCenter.x + targetCamOffset.x
        camera.position.y = targetCenter.y + targetCamOffset.y + zoomOut * 0.5
        camera.position.z = targetCenter.z + targetCamOffset.z + zoomOut

        camera.lookAt(targetCenter)
    })

    return null
}

function PostProcessing() {
    const aberrationRef = useRef()

    useFrame(() => {
        if (aberrationRef.current && window.warpIntensity !== undefined) {
            // Set the shift vector magnitude based on warp speed
            const intensity = window.warpIntensity * 0.08 // Max aberration offset
            aberrationRef.current.offset.set(intensity, intensity)
        }
    })

    return (
        <EffectComposer>
            <Bloom
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                intensity={1.5}
                mipmapBlur
            />

            <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
    )
}

export default function Scene() {
    return (
        <>
            <color attach="background" args={[BG_COLOR]} />
            <fog attach="fog" args={[BG_COLOR, 15, 60]} />

            <ambientLight intensity={0.1} />
            {/* Lights attached to clusters so they are illuminated when visited */}
            {TOKENS.map((token, idx) => (
                <pointLight
                    key={idx}
                    position={[token.center.x, token.center.y, token.center.z + 5]}
                    color={idx % 2 === 0 ? COLOR_CYAN : COLOR_INDIGO}
                    intensity={2}
                    distance={40}
                />
            ))}

            <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={50} scale={100} size={2} speed={0.4} opacity={0.5} color={COLOR_CYAN} position={[0, -100, -200]} />

            <CameraWarpController />
            <AttentionBeams />
            <TransformerEmbeddings />
            <PostProcessing />
        </>
    )
}
