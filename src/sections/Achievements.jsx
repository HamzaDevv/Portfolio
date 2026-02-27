import { useEffect, useRef, useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

function AnimatedValue({ target, suffix = '' }) {
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
        const step = Math.max(target / 60, 1)
        const interval = setInterval(() => {
            start += step
            if (start >= target) {
                setCount(target)
                clearInterval(interval)
            } else {
                setCount(Math.floor(start))
            }
        }, 30)
        return () => clearInterval(interval)
    }, [started, target])

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const achievements = [
    {
        icon: '⚔️',
        value: <AnimatedValue target={1000} suffix="+" />,
        label: 'LeetCode Problems',
        detail: 'Knight Rank • Max Rating 1835 • Top 6% globally',
    },
    {
        icon: '🏆',
        value: 'Rank 772',
        label: 'Codeforces',
        detail: 'Best Contest Rank in Round 1062, Div. 4',
    },
    {
        icon: '🎯',
        value: 'Top 2%',
        label: 'JEE Mains',
        detail: 'Among 1M+ candidates • JEE Advanced qualified (2022)',
    },
    {
        icon: '🧠',
        value: '32 Hours',
        label: 'AI Certification',
        detail: 'Advanced Deep Learning, Generative AI & Business Intelligence',
    },
]

export default function Achievements() {
    const [headerRef, headerVisible] = useScrollReveal()
    const [gridRef, gridVisible] = useScrollReveal()

    return (
        <section className="section" id="achievements" style={{ minHeight: '100vh' }}>
            <div style={{ width: '100%' }}>
                <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div className="section-label">// achievements</div>
                    <h2 className="section-title">
                        The <span className="gold">Scoreboard</span>
                    </h2>
                </div>

                <div ref={gridRef} className={`achievements-grid stagger-children ${gridVisible ? 'visible' : ''}`}>
                    {achievements.map((a, idx) => (
                        <div key={idx} className="achievement-card glass">
                            <span className="achievement-icon" style={{ animationDelay: `${idx * 0.5}s` }}>
                                {a.icon}
                            </span>
                            <div className="achievement-value">{a.value}</div>
                            <div className="achievement-label">{a.label}</div>
                            <div className="achievement-detail">{a.detail}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
