import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
        <main className="container">
            <Outlet />
        </main>

        <footer className="container">&copy; JWT auth</footer>
        </>
    )
}

export {Layout}
