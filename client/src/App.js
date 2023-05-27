import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout'
import { Homepage } from './pages/Homepage'
import { Service } from './pages/Service'
import { RegistrationPage } from './pages/Registrationpage'
import { LoginPage } from './pages/Loginpage'
import { Notfoundpage } from './pages/Notfoundpage'
import { NavBar } from './components/NavBar';
import { BrowserRouter } from 'react-router-dom';
import { RequireAuth } from './hoc/RequireAuth'
import { AuthProvider } from './hoc/AuthProvider'
import {observer} from "mobx-react-lite";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="service" element={
              <RequireAuth>
                <Service />
              </RequireAuth>
            } />
            <Route path="registration" element={<RegistrationPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<Notfoundpage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default observer(App);
