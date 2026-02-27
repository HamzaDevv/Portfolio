import useScrollReveal from '../hooks/useScrollReveal'

export default function About() {
    const [photoRef, photoVisible] = useScrollReveal()
    const [textRef, textVisible] = useScrollReveal()
    const [skillsRef, skillsVisible] = useScrollReveal()

    const skills = [
        {
            title: 'Programming',
            tags: ['Python', 'C/C++', 'JavaScript', 'React.js', 'Node.js', 'SQL'],
        },
        {
            title: 'AI / ML',
            tags: ['LLMs', 'RAG', 'LangGraph', 'AI Agents', 'Fine-tuning', 'Unsloth', 'QLoRA'],
        },
        {
            title: 'Databases',
            tags: ['PostgreSQL', 'Qdrant', 'ChromaDB', 'Vector DBs'],
        },
        {
            title: 'Infrastructure',
            tags: ['Docker', 'AWS', 'FastAPI', 'Streamlit', 'GGUF', 'Git'],
        },
    ]

    return (
        <section className="section" id="about" style={{ minHeight: '100vh' }}>
            <div className="about">
                <div ref={photoRef} className={`reveal-left ${photoVisible ? 'visible' : ''}`}>
                    <div className="about-photo-frame">
                        <div className="about-photo-placeholder">
                            [ PHOTO ]
                        </div>
                    </div>
                </div>
                <div>
                    <div ref={textRef} className={`reveal-right ${textVisible ? 'visible' : ''}`}>
                        <div className="section-label">// about me</div>
                        <h2 className="section-title">
                            Building <span className="accent">Intelligent</span> Systems
                        </h2>
                        <p className="about-bio">
                            <strong>B.Tech IT</strong> student at <strong>IIEST Shibpur</strong> (CGPA: 8.24)
                            with expertise in <strong>high-scale AI systems</strong>, LLM applications, and
                            full-stack development. Currently engineering legal AI infrastructure
                            at <strong>Vaquill AI</strong>, managing retrieval across
                            <strong> 19M+ documents</strong>. Ranked in the{' '}
                            <strong>top 6% globally on LeetCode</strong> with 1000+ problems solved.
                        </p>
                    </div>
                    <div ref={skillsRef} className={`skills-grid stagger-children ${skillsVisible ? 'visible' : ''}`}>
                        {skills.map((cat) => (
                            <div key={cat.title} className="skill-category glass">
                                <div className="skill-category-title">{cat.title}</div>
                                <div className="skill-tags">
                                    {cat.tags.map((tag) => (
                                        <span key={tag} className="skill-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
