import { useRef, useEffect } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const projects = [
    {
        icon: '🤖',
        name: 'Proactive-AIoT-Assistant',
        subtitle: 'Context-Aware Smart Environment',
        description: 'Designed a SENSE-THINK-ACTION pipeline interpreting sensor data (Fit, Maps, Calendar) to predict user needs. Developed a hybrid reasoning model combining deterministic decision graphs with LLM intent extraction.',
        tech: ['Python', 'LLMs', 'FastAPI', 'ChromaDB', 'AIoT'],
        github: 'https://github.com/HamzaDevv/Proactive-AIoT-Assistant',
        isSadaf: false,
    },
    {
        icon: '👁️',
        name: 'Sadaf-Bot',
        subtitle: 'Conversational AI with Vision & Memory',
        description: 'Built a speech-enabled AI assistant with vision capabilities and modular long-term vector memory. Implemented multi-threaded async processing for real-time concurrent STT, TTS, and memory updates.',
        tech: ['Python', 'LLMs', 'ChromaDB', 'Ollama', 'STT/TTS'],
        github: 'https://github.com/HamzaDevv/Sadaf-BOT',
        isSadaf: true,
    },
    {
        icon: '🛒',
        name: 'Smart-Shop-Agent',
        subtitle: 'AI-Powered Inventory System',
        description: 'Dukaan Sahaayak — Smart inventory system using LangGraph-powered AI agents for automated billing and natural language-to-SQL conversion with Gemini OCR integration.',
        tech: ['Python', 'LangGraph', 'Gemini', 'Ollama', 'SQL'],
        github: 'https://github.com/HamzaDevv/smart-shop-agent',
        isSadaf: false,
    },
]

function SadafEye() {
    const eyeRef = useRef(null)
    const pupilRef = useRef(null)

    useEffect(() => {
        const handleMove = (e) => {
            if (!eyeRef.current || !pupilRef.current) return
            const rect = eyeRef.current.getBoundingClientRect()
            const cx = rect.left + rect.width / 2
            const cy = rect.top + rect.height / 2
            const dx = e.clientX - cx
            const dy = e.clientY - cy
            const dist = Math.sqrt(dx * dx + dy * dy)
            const maxDist = 14
            const ratio = Math.min(dist / 200, 1)
            pupilRef.current.style.transform = `translate(${(dx / dist) * maxDist * ratio}px, ${(dy / dist) * maxDist * ratio}px)`
        }
        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [])

    return (
        <div className="sadaf-eye" ref={eyeRef}>
            <div className="sadaf-pupil" ref={pupilRef} />
        </div>
    )
}

export default function Projects() {
    const [headerRef, headerVisible] = useScrollReveal()
    const [gridRef, gridVisible] = useScrollReveal()

    return (
        <section className="section" id="projects" style={{ minHeight: '100vh' }}>
            <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
                <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
                    <div className="section-label">// projects</div>
                    <h2 className="section-title" style={{ marginBottom: 48 }}>
                        The <span className="accent">Lab</span>
                    </h2>
                </div>

                <div ref={gridRef} className={`projects-grid stagger-children ${gridVisible ? 'visible' : ''}`}>
                    {projects.map((project, idx) => (
                        <div key={idx} className="project-card glass" style={{ position: 'relative' }}>
                            {project.isSadaf && <SadafEye />}
                            <div className="project-icon">{project.icon}</div>
                            <div className="project-name">{project.name}</div>
                            <div className="project-subtitle">{project.subtitle}</div>
                            <p className="project-description">{project.description}</p>
                            <div className="project-tech">
                                {project.tech.map((t) => (
                                    <span key={t}>{t}</span>
                                ))}
                            </div>
                            <div className="project-links">
                                <a href={project.github} target="_blank" rel="noopener noreferrer">
                                    ↗ GitHub
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
