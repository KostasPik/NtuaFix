import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Auth from './pages/auth/Auth';
import Login from './pages/auth/Login';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import DamageReport from './pages/DamageReport';

function App() {
  return (
    <div className="App">
     <Router trailingSlash={true}>
     <AuthProvider>

        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/damage-report/:reportID/' element={<DamageReport />} />
          <Route path='/auth' element={<Auth></Auth>}>
              <Route path='login/' element={<Login/>}/>
          </Route>
        </Routes>
        </AuthProvider>
     </Router>
    </div>
  );
}

export default App;
