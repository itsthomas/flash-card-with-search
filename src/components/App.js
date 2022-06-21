import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Navigate
} from 'react-router-dom'
import DocList from './DocList'
import CardGroups from './CardGroups'
import Auth from './Auth'
import LogoutButton from './Auth/LogoutButton'
import { fireAuth } from '../firebase'
import '../App.scss'

function App() {
  const [user, setUser] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const handleLogout = () => {
    fireAuth.auth().signOut()
  }

  const authListener = () => {
    fireAuth.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser)
        authUser.getIdTokenResult().then((idTokenResult) => {
          setIsAdmin(idTokenResult.claims?.admin)
        })
      } else {
        setUser('')
      }
    })
  }

  useEffect(() => {
    authListener()
  }, [])

  return user !== '' ? (
    <Router>
      <div className='App'>
        <header className='header'>
          <LogoutButton handleLogout={handleLogout} />
          <h1 className='header__title'>English - German Vocabulary</h1>

          {isAdmin && (
            <ul className='header__nav'>
              <NavLink exact='true' className='header__nav-link' to='/'>
                <li className='header__nav-list'>List view</li>
              </NavLink>
              <NavLink className='header__nav-link' to='/cards'>
                <li className='header__nav-list'>Card view</li>
              </NavLink>
            </ul>
          )}
        </header>

        <main role='main'>
          <Routes>
            <Route
              exact='true'
              path='/'
              element={isAdmin ? <DocList /> : <Navigate to='/cards' />}
            />
            <Route exact='true' path='/cards' element={<CardGroups />} />
          </Routes>
        </main>

      </div>
    </Router>
  ) : (
    <Auth />
  )
}

export default App
