import.meta.env.VITE_API_URL

export default function HomePage() {
    return (
        <div className="homepage">
            <a href={`${import.meta.env.VITE_API_URL}/auth/discord`}>
                <button>Login con Discord</button>
            </a>
        </div>
    )    
}