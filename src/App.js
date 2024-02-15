import { Route, Routes } from 'react-router-dom';
import './App.css';
import Authentication from './components/common/Authentication';


function App() {
  return (
 <Routes>
  <Route path='/' element={<Authentication/>}/>
 </Routes>
  );
}

export default App;
