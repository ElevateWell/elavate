import { Route, Routes } from 'react-router-dom';
import './App.css';
import Chat from './components/common/Authentication';


function App() {
  return (
 <Routes>
  <Route path='/' element={<Chat/>}/>
 </Routes>
  );
}

export default App;
