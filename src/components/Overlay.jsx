import { Scroll } from '@react-three/drei'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Experience from '../sections/Experience'
import Projects from '../sections/Projects'
import Achievements from '../sections/Achievements'
import Contact from '../sections/Contact'

export default function Overlay() {
    return (
        <Scroll html style={{ width: '100%' }}>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Achievements />
            <Contact />
        </Scroll>
    )
}
