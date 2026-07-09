import.meta.env.VITE_API_URL
import Footer from "../components/Footer"

export default function HomePage() {
    return (
        <div className="homepage">
            <a href={`${import.meta.env.VITE_API_URL}/auth/discord`}>
                <button>Login con Discord</button>
            </a>
            <Footer />
        </div>
    )    
}