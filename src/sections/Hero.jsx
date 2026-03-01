import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
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

    const skills = [
        "Python", "LLMs", "RAG", "LangGraph", "PyTorch", "React",
        "Three.js", "Docker", "AWS", "Agentic Systems"
    ]

    return (
        <section className="section hero relative overflow-hidden" id="home" style={{ height: '100vh' }}>
            <div className="absolute inset-0 pointer-events-none z-0">
                {skills.map((skill, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -100, x: Math.random() * window.innerWidth - window.innerWidth / 2 }}
                        animate={{
                            opacity: [0, 0.8, 0],
                            y: ['-10vh', '110vh'],
                            x: (Math.random() - 0.5) * 400
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "linear"
                        }}
                        className="absolute top-0 text-white font-mono text-sm opacity-30"
                    >
                        [{skill}]
                    </motion.div>
                ))}
            </div>

            <div className="z-10 flex flex-col items-center">
                <div ref={nameRef} className={`hero-name neon-glow reveal ${nameVisible ? 'visible' : ''}`}>
                    AMEER HAMZA KHAN
                </div>

                <div ref={subtitleRef} className={`hero-subtitle text-cyber-lime font-mono text-lg tracking-widest mb-12 min-h-[28px] reveal delay-2 ${subtitleVisible ? 'visible' : ''}`}>
                    <TypeWriter
                        texts={[
                            'AI ENGINEER INTERN @ VAQUILL AI',
                            'ARCHITECTING HIGH-SCALE AI SYSTEMS',
                            'LLM FINE-TUNING & RAG ENGINEERING',
                            'BUILDING THE FUTURE OF LEGAL AI',
                        ]}
                        speed={60}
                    />
                </div>

                <div className="flex gap-6 mb-16 z-10 glass-strong p-6 border-electric-purple/30">
                    <div className="text-center px-4 border-r border-electric-purple/20">
                        <div className="font-heading text-3xl font-bold text-cyber-lime mb-1">
                            <AnimatedCounter target={19} suffix="M+" />
                        </div>
                        <div className="font-mono text-[10px] text-gray uppercase tracking-[0.2em]">Tokens Processed</div>
                    </div>
                    <div className="text-center px-4 border-r border-electric-purple/20">
                        <div className="font-heading text-3xl font-bold text-cyber-lime mb-1">
                            <AnimatedCounter target={91} suffix="%" />
                        </div>
                        <div className="font-mono text-[10px] text-gray uppercase tracking-[0.2em]">Recall@10</div>
                    </div>
                    <div className="text-center px-4">
                        <div className="font-heading text-3xl font-bold text-cyber-lime mb-1">
                            <AnimatedCounter target={1000} suffix="+" />
                        </div>
                        <div className="font-mono text-[10px] text-gray uppercase tracking-[0.2em]">Optimization Iterations</div>
                    </div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                >
                    <span className="font-mono text-[10px] text-gray tracking-[0.3em] uppercase">Initialize Sequence</span>
                    <div className="w-5 h-5 border-r-2 border-b-2 border-electric-purple rotate-45 opacity-60" />
                </motion.div>
            </div>
        </section>
    )
}
