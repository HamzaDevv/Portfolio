import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'

// Deep space black background
const BG_COLOR = '#050508'

// Gradient colors (Cyan-Core to Deep Indigo)
const COLOR_CYAN = new THREE.Color('#00f0ff')
const COLOR_INDIGO = new THREE.Color('#2e00ff') // Deep indigo / electric blue
const COLOR_GOLD = new THREE.Color('#ffd700') // For accents

// Number of points
const POINTS_COUNT = 20000

// Cluster Locations
const CLUSTER_CENTERS = [
    new THREE.Vector3(0, 0, 0),             // 0: Hero (Sphere)
    new THREE.Vector3(-40, -50, -80),       // 1: About (Neural Network)
    new THREE.Vector3(50, -100, -160),      // 2: Experience (Data Block)
    new THREE.Vector3(-50, -150, -240),     // 3: Projects (Holographic Islands)
    new THREE.Vector3(40, -200, -320),      // 4: Achievements (Rings)
    new THREE.Vector3(0, -250, -400)        // 5: Contact (Singularity)
]

function generateLatentSpace() {
    const positions = new Float32Array(POINTS_COUNT * 3)
    const colors = new Float32Array(POINTS_COUNT * 3)
    const basePositions = new Float32Array(POINTS_COUNT * 3)
    const noiseOffsets = new Float32Array(POINTS_COUNT) // for organic movement

    let idx = 0

    // Helper to add a point
    const addPoint = (x, y, z, cx, cy, cz) => {
        positions[idx * 3] = x + cx
        positions[idx * 3 + 1] = y + cy
        positions[idx * 3 + 2] = z + cz
        basePositions[idx * 3] = positions[idx * 3]
        basePositions[idx * 3 + 1] = positions[idx * 3 + 1]
        basePositions[idx * 3 + 2] = positions[idx * 3 + 2]

        // Gradient based on Y position mostly
        const ratio = Math.random()
        const color = new THREE.Color().lerpColors(COLOR_CYAN, COLOR_INDIGO, ratio)
        // Occasional gold accent
        if (Math.random() > 0.95) color.lerp(COLOR_GOLD, 0.8)

        colors[idx * 3] = color.r
        colors[idx * 3 + 1] = color.g
        colors[idx * 3 + 2] = color.b

        noiseOffsets[idx] = Math.random() * Math.PI * 2
        idx++
    }

    // == Cluster 0: Loose Sphere (Hero) ==
    const cluster0Count = 4000
    const c0 = CLUSTER_CENTERS[0]
    for (let i = 0; i < cluster0Count; i++) {
        const r = 2 + Math.random() * 12
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        addPoint(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi),
            c0.x, c0.y, c0.z
        )
    }

    // == Cluster 1: Neural Network Nodes/Layers (About) ==
    const cluster1Count = 4000
    const c1 = CLUSTER_CENTERS[1]
    const layers = 5
    for (let i = 0; i < cluster1Count; i++) {
        const layer = Math.floor(Math.random() * layers)
        const x = (layer - layers / 2) * 5 + (Math.random() - 0.5) * 2 // spread layers
        let y = (Math.random() - 0.5) * 15
        let z = (Math.random() - 0.5) * 15

        // Cluster into "nodes" within layers
        if (Math.random() > 0.3) {
            const nodeCenterY = Math.floor(y / 4) * 4
            const nodeCenterZ = Math.floor(z / 4) * 4
            y = nodeCenterY + (Math.random() - 0.5) * 1.5
            z = nodeCenterZ + (Math.random() - 0.5) * 1.5
        }
        addPoint(x, y, z, c1.x, c1.y, c1.z)
    }

    // == Cluster 2: Data Block / 19M Docs (Experience) ==
    const cluster2Count = 4000
    const c2 = CLUSTER_CENTERS[2]
    for (let i = 0; i < cluster2Count; i++) {
        const x = (Math.random() - 0.5) * 20
        const y = (Math.random() - 0.5) * 10
        const z = (Math.random() - 0.5) * 8
        addPoint(x, y, z, c2.x, c2.y, c2.z)
    }

    // == Cluster 3: Holographic Islands (Projects) ==
    const cluster3Count = 4000
    const c3 = CLUSTER_CENTERS[3]
    for (let i = 0; i < cluster3Count; i++) {
        const island = Math.floor(Math.random() * 3)
        const centers = [
            { x: -8, y: 0, z: -4 },
            { x: 8, y: 4, z: 2 },
            { x: 0, y: -6, z: 6 }
        ]
        const center = centers[island]
        const r = Math.random() * 5
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)

        addPoint(
            center.x + r * Math.sin(phi) * Math.cos(theta),
            center.y + r * Math.sin(phi) * Math.sin(theta),
            center.z + r * Math.cos(phi),
            c3.x, c3.y, c3.z
        )
    }

    // == Cluster 4: Scales/Rings (Achievements) ==
    const cluster4Count = 2000
    const c4 = CLUSTER_CENTERS[4]
    for (let i = 0; i < cluster4Count; i++) {
        const ring = Math.floor(Math.random() * 3)
        const radii = [4, 8, 12]
        const r = radii[ring] + (Math.random() - 0.5) * 1.5
        const theta = Math.random() * Math.PI * 2
        const y = (Math.random() - 0.5) * 1.5 // flat rings

        addPoint(
            r * Math.cos(theta),
            y,
            r * Math.sin(theta),
            c4.x, c4.y, c4.z
        )
    }

    // == Cluster 5: Dense Core / Singularity (Contact) ==
    const cluster5Count = 2000
    const c5 = CLUSTER_CENTERS[5]
    for (let i = 0; i < cluster5Count; i++) {
        // concentrated at center with spiral arms
        const theta = Math.random() * Math.PI * 10
        const r = Math.pow(Math.random(), 2) * 10 // concentrated in middle
        const arm = Math.sin(theta * 2) * 0.5

        addPoint(
            (r + arm) * Math.cos(theta),
            (Math.random() - 0.5) * (10 - r), // taller in middle
            (r + arm) * Math.sin(theta),
            c5.x, c5.y, c5.z
        )
    }

    return { positions, colors, basePositions, noiseOffsets }
}

function LatentSpaceEmbedding() {
    const pointsRef = useRef()
    const { positions, colors, basePositions, noiseOffsets } = useMemo(() => generateLatentSpace(), [])

    useFrame((state) => {
        if (!pointsRef.current) return
        const time = state.clock.elapsedTime
        const geo = pointsRef.current.geometry
        const pos = geo.attributes.position.array

        // Organic breathing for all points
        for (let i = 0; i < POINTS_COUNT; i++) {
            const i3 = i * 3
            const noise = noiseOffsets[i]
            const bx = basePositions[i3]
            const by = basePositions[i3 + 1]
            const bz = basePositions[i3 + 2]

            pos[i3] = bx + Math.sin(time * 0.5 + noise) * 0.1
            pos[i3 + 1] = by + Math.cos(time * 0.4 + noise) * 0.1
            pos[i3 + 2] = bz + Math.sin(time * 0.6 + noise) * 0.1
        }
        geo.attributes.position.needsUpdate = true
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={POINTS_COUNT}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={POINTS_COUNT}
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
    )
}

function CameraWarpController() {
    const scroll = useScroll()
    const { camera } = useThree()

    // Need to communicate aberration intensity to the post-processing
    // We'll use a globally accessible object for simplicity since Drei's ScrollControls doesn't easily pass state up
    window.warpIntensity = 0

    const cameraOffsets = [
        new THREE.Vector3(0, 0, 15),          // Hero
        new THREE.Vector3(0, 5, 20),          // About (look down slightly)
        new THREE.Vector3(0, 0, 25),          // Experience (wide view of block)
        new THREE.Vector3(0, 8, 20),          // Projects
        new THREE.Vector3(0, 15, 15),         // Achievements (look down at rings)
        new THREE.Vector3(0, 0, 20)           // Contact
    ]

    useFrame(() => {
        const progress = scroll.offset * 5 // 0 to 5
        const segment = Math.min(Math.floor(progress), 4)
        const t = progress - segment // 0 to 1

        // Determine target clusters
        const currentCenter = CLUSTER_CENTERS[segment]
        const nextCenter = CLUSTER_CENTERS[segment + 1]
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
            {CLUSTER_CENTERS.map((pos, idx) => (
                <pointLight
                    key={idx}
                    position={[pos.x, pos.y, pos.z + 5]}
                    color={idx % 2 === 0 ? COLOR_CYAN : COLOR_INDIGO}
                    intensity={2}
                    distance={40}
                />
            ))}

            <CameraWarpController />
            <LatentSpaceEmbedding />
            <PostProcessing />
        </>
    )
}
