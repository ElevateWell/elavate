import { Route, Routes } from 'react-router-dom';
import './App.css';
// import Authentication from './components/common/Authentication';
import Login from './components/common/Login';


function App() {
  return (
 <Routes>
  <Route path='/' element={<Login />}/>
 </Routes>
  );
}

export default App;
