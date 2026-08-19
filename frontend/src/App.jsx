import { Routes, Route } from 'react-router-dom';
import "./style/styles.css"
import { LoginPage } from './routes/LoginPage.jsx';
import { AdminPage } from './routes/AdminPage.jsx';
import { GamePage } from './routes/GamePage.jsx';

const App = () => {

  return (
    <Routes>

      <Route 
        path="/game" 
        element={<GamePage />} 
      />

      <Route 
        path="/admin" 
        element={<AdminPage />} 
      />

      <Route 
        path="/login" 
        element={<LoginPage/>}
      />

      <Route
        path="*" 
        element={<div>404 Not Found</div>}
      />

    </Routes>
    
  ) 
}

export default App;