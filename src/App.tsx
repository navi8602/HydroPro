import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AppRouter } from './routes';

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <AppRouter />
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
