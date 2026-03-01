import { useState, useEffect } from 'react'

const sections = ['Home', 'About', 'Experience', 'Projects', 'Contact']

export default function Navbar() {
    const [active, setActive] = useState('Home')
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleClick = (section) => {
        setActive(section)
        setMenuOpen(false)
        const el = document.getElementById(section.toLowerCase())
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-logo">
                AHK<span>.</span>
            </div>
            <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                {sections.map((s) => (
                    <li key={s}>
                        <a
                            className={active === s ? 'active' : ''}
                            onClick={() => handleClick(s)}
                        >
                            {s}
                        </a>
                    </li>
                ))}
            </ul>
            <div className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                <span />
                <span />
                <span />
            </div>
        </nav>
    )
}
