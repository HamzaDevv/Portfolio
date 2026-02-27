import { useEffect, useRef } from 'react'

export default function CustomCursor() {
    const cursorRef = useRef(null)
    const trailRefs = useRef([])
    const pos = useRef({ x: -100, y: -100 })
    const trailPositions = useRef(Array(5).fill({ x: -100, y: -100 }))

    useEffect(() => {
        // Hide on mobile
        if ('ontouchstart' in window) return

        const handleMove = (e) => {
            pos.current = { x: e.clientX, y: e.clientY }
        }

        const handleOver = (e) => {
            const target = e.target
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('.project-card') ||
                target.closest('.achievement-card')
            ) {
                cursorRef.current?.classList.add('hovering')
            }
        }

        const handleOut = () => {
            cursorRef.current?.classList.remove('hovering')
        }

        window.addEventListener('mousemove', handleMove)
        window.addEventListener('mouseover', handleOver)
        window.addEventListener('mouseout', handleOut)

        let raf
        const animate = () => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px)`
            }

            for (let i = trailPositions.current.length - 1; i > 0; i--) {
                trailPositions.current[i] = { ...trailPositions.current[i - 1] }
            }
            trailPositions.current[0] = { ...pos.current }

            trailRefs.current.forEach((ref, i) => {
                if (ref) {
                    const tp = trailPositions.current[i + 1] || pos.current
                    ref.style.transform = `translate(${tp.x - 3}px, ${tp.y - 3}px)`
                    ref.style.opacity = `${0.3 - i * 0.06}`
                }
            })

            raf = requestAnimationFrame(animate)
        }
        raf = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mouseover', handleOver)
            window.removeEventListener('mouseout', handleOut)
            cancelAnimationFrame(raf)
        }
    }, [])

    if (typeof window !== 'undefined' && 'ontouchstart' in window) return null

    return (
        <>
            <div ref={cursorRef} className="custom-cursor" />
            {[0, 1, 2, 3].map((i) => (
                <div
                    key={i}
                    ref={(el) => (trailRefs.current[i] = el)}
                    className="cursor-trail"
                />
            ))}
        </>
    )
}
