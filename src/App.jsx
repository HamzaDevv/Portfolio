import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import Scene from './components/Scene'
import Overlay from './components/Overlay'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'

export default function App() {
    const [loaded, setLoaded] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let p = 0
        const interval = setInterval(() => {
            p += Math.random() * 15 + 5
            if (p >= 100) {
                p = 100
                clearInterval(interval)
                setTimeout(() => setLoaded(true), 600)
            }
            setProgress(Math.min(p, 100))
        }, 200)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <CustomCursor />
            <LoadingScreen progress={progress} loaded={loaded} />
            <Navbar />
            <div className="canvas-container">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 75 }}
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: true }}
                >
                    <Suspense fallback={null}>
                        <ScrollControls pages={6} damping={0.15}>
                            <Scene />
                            <Overlay />
                        </ScrollControls>
                    </Suspense>
                </Canvas>
            </div>
        </>
    )
}
