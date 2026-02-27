import { useState, useEffect, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

function TypeWriter({ texts, speed = 80, pause = 2000 }) {
    const [display, setDisplay] = useState('')
    const [textIdx, setTextIdx] = useState(0)
    const [charIdx, setCharIdx] = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const current = texts[textIdx]
        let timeout

        if (!deleting && charIdx < current.length) {
            timeout = setTimeout(() => setCharIdx(charIdx + 1), speed)
        } else if (!deleting && charIdx === current.length) {
            timeout = setTimeout(() => setDeleting(true), pause)
        } else if (deleting && charIdx > 0) {
            timeout = setTimeout(() => setCharIdx(charIdx - 1), speed / 2)
        } else if (deleting && charIdx === 0) {
            setDeleting(false)
            setTextIdx((textIdx + 1) % texts.length)
        }

        setDisplay(current.substring(0, charIdx))
        return () => clearTimeout(timeout)
    }, [charIdx, deleting, textIdx, texts, speed, pause])

    return (
        <span>
            {display}
            <span className="cursor-blink">▌</span>
        </span>
    )
}

function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true) },
            { threshold: 0.5 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!started) return
        let start = 0
        const step = target / (duration / 16)
        const interval = setInterval(() => {
            start += step
            if (start >= target) {
                setCount(target)
                clearInterval(interval)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(interval)
    }, [started, target, duration])

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function Hero() {
    const [nameRef, nameVisible] = useScrollReveal()
    const [subtitleRef, subtitleVisible] = useScrollReveal()
    const [statsRef, statsVisible] = useScrollReveal()

    return (
        <section className="section hero" id="home" style={{ height: '100vh' }}>
            <div ref={nameRef} className={`hero-name neon-glow reveal ${nameVisible ? 'visible' : ''}`}>
                AMEER HAMZA KHAN
            </div>

            <div ref={subtitleRef} className={`hero-subtitle reveal delay-2 ${subtitleVisible ? 'visible' : ''}`}>
                <TypeWriter
                    texts={[
                        'ARCHITECTING HIGH-SCALE AI SYSTEMS',
                        'LLM FINE-TUNING & RAG ENGINEERING',
                        'FULL-STACK AI DEVELOPMENT',
                        'BUILDING THE FUTURE OF LEGAL AI',
                    ]}
                    speed={60}
                />
            </div>

            <div ref={statsRef} className={`hero-stats stagger-children ${statsVisible ? 'visible' : ''}`}>
                <div className="hero-stat-card glass">
                    <div className="hero-stat-value">
                        <AnimatedCounter target={19} suffix="M+" />
                    </div>
                    <div className="hero-stat-label">Documents Processed</div>
                </div>
                <div className="hero-stat-card glass">
                    <div className="hero-stat-value">
                        <AnimatedCounter target={91} suffix="%" />
                    </div>
                    <div className="hero-stat-label">Recall@10</div>
                </div>
                <div className="hero-stat-card glass">
                    <div className="hero-stat-value">
                        <AnimatedCounter target={1000} suffix="+" />
                    </div>
                    <div className="hero-stat-label">LeetCode Problems</div>
                </div>
            </div>

            <div className="scroll-indicator">
                <span>Scroll to explore</span>
                <div className="chevron" />
            </div>
        </section>
    )
}
