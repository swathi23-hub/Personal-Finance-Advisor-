import './App.css';
import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login/Login';
import CreateAccPage from './components/CreateAccPage/CreateAccPage';
import Dashboard from './components/Dashboard/Dashboard';
import HomePage from './components/HomePage/HomePage';
import SettingsPage from './components/SettingsPage/SettingsPage';
import ExpensePage from './components/ExpensePage/ExpensePage';
import BudgetPage from './components/BudgetPage/BudgetPage';

// import Home from './components/home/home'
// import Create from './components/create/create';
// import Read from './components/read/read';
// import Edit from './components/edit/edit';

function App() {
  return (
    <>
    {/* <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/create' element={<Create/>}></Route>
      <Route path='/read/:id' element={<Read/>}></Route>
      <Route path='/edit/:id' element={<Edit/>}></Route>
    </Routes>
    </BrowserRouter> */}

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/createaccount' element={<CreateAccPage/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}>
          <Route index path='homepage' element={<HomePage/>}/>
          <Route path='settingspage' element={<SettingsPage/>}/>
          <Route path='expensepage' element={<ExpensePage/>}/>
          <Route path='budgetpage' element={<BudgetPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>

    </>
  );
}

export default App;
