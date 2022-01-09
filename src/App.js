import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom' // get router
import MarketFooter from './components/MarketFooter';
import MarketHeader from './components/MarketHeader';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';
import AdminLogin from './views/AdminLogin';
import AdminPanel from './views/AdminPanel';
import MainPageMarket from './components/user/MainPageMarket';

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>

function App() {
  return (
    <Router>
        <MarketHeader/>
        <Routes>
            <Route path='/' exact element={
              <div className='mainDiv'>
                  <MainPageMarket/>
                <MarketFooter/>
              </div>
            }/>
            <Route path='/signin' element={<><SignIn /></>} />
            <Route path='/signup' element={<><SignUp /></>} />
            <Route path='/adminLogin' element={<><AdminLogin /></>} />
            <Route path='/adminPanel' element={<><AdminPanel/></>}/>
          </Routes>
          
    </Router>
  );
}

export default App;
