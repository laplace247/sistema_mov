import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div style={{ textAlign: "center" }}>
            <h1>404</h1>
            <h2>Page not found</h2>
            <p>Lo sentimos, no pudimos encontrar la página que buscas</p>
            <Link to="/dashboard">Volver al inicio</Link>
        </div>
    );
};

export default NotFoundPage;
