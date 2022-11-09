import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import { useAtom } from 'jotai'
import { userAtom, parentAtom, tokenAtom, displayScreenAtom } from '../pages/_app'
import { useRouter } from 'next/router'
import { vars } from '../styles/Global'
import { useEffect, useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoMdLogIn, IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { IoPersonCircleSharp } from 'react-icons/io5'
import { AiOutlineComment } from 'react-icons/ai'
import { BiLogOutCircle, BiWindowOpen } from 'react-icons/bi'

const Navbar = ({ setRenderIndex, renderIndex }) => {
  const [user, setUser] = useAtom(userAtom)
  const [token, setToken] = useAtom(tokenAtom)
  const [parentId, setParentId] = useAtom(parentAtom)
  const [displayedScreen, setDisplayedScreen] = useAtom(displayScreenAtom)
  const router = useRouter()
  const [scrolled, setScrolled] = useState(0)
  const [showMenu, setShowMenu] = useState(false)

  const logoutUser = () => {
    router.push('/')
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    setRenderIndex(!renderIndex)
  }

  const listenScroll = () => {
    setScrolled(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', listenScroll);

    return () =>
      window.removeEventListener('scroll', listenScroll);
  }, [])

  const closeMenu = (e) => {
    if (e.target === document.querySelector('.menu-btn')) return
    if (e.target !== document.querySelector('#nav-menu')) {
      setShowMenu(false)
    }
  }

  useEffect(() => {
    window.addEventListener('click', closeMenu)

    return () => {
      window.removeEventListener('click', closeMenu)
    }
  }, [])

  return (
    <StyledContainer>
      <div className={scrolled <= 5 ? 'container' : 'container scrolled'}>
        <div className='inner-container'>
          <header>
            <div className="logo" role="heading" aria-level="1" onClick={() => setParentId(undefined)}>
              <Link href="/"><a>
                <Image src="/logo.svg" alt="comment section" width={148} height={40} />
              </a></Link>
            </div>
          </header>
          <nav className='nav-container'>
            {user ? (<>

              <button className='menu-btn' onClick={() => setShowMenu(!showMenu)} aria-label="menu">
                <img
                  src={user?.avatar || "/mock-avatar.png"}
                  alt=""
                  className="avatar"
                  width={40}
                  height={40} />
                <p className='menu-p'>{user.name}</p>
                {showMenu ?
                  <IoIosArrowUp className='menu-icon' size={22} /> :
                  <IoIosArrowDown className='menu-icon' size={22} />
                }
              </button>

              {showMenu && (
                <ul id="nav-menu" className='profile-menu'>
                  <li><Link href="/profile"><a
                    aria-labelledby="profile"
                    className={displayedScreen !== 'comments' ? 'page-btn btn-bg' : 'page-btn'}
                    onClick={() => {
                      setShowMenu(false)
                      displayedScreen === 'comments' ? setDisplayedScreen('display') : null
                    }
                    }>
                    <IoPersonCircleSharp className='person-icon' size={22} />
                    <p id="profile">My Profile</p>
                  </a></Link></li>

                  <li><Link href="/"><a
                    aria-labelledby="comments"
                    className={displayedScreen === 'comments' ? 'page-btn btn-bg'
                      : 'page-btn'}
                    onClick={() => {
                      setParentId(undefined)
                      setShowMenu(false)
                      if (displayedScreen !== 'comments') {
                        setDisplayedScreen('comments')
                      }
                    }}
                  >
                    <AiOutlineComment size={22} className="comments-icon" />
                    <p id="comments">Comments</p>
                  </a></Link></li>

                  <li><button
                    className='logout-btn'
                    arla-labelledby="logout"
                    onClick={logoutUser}>
                    <BiLogOutCircle className='logout-icon' size={22} />
                    <p id="logout">Logout</p>
                  </button></li>
                </ul>
              )}
            </>) : (<>
              <ul id="nav-menu" className='login-menu'>
                <li><Link href="/login"><a>
                  <IoMdLogIn className='login-icon login' />
                  <p>Login</p>
                </a></Link></li>
                <li><Link href="/signup"><a>
                  <FaRegUserCircle className="login-icon" />
                  <p>Register</p>
                </a></Link></li>
              </ul>
            </>)}
          </nav>
        </div>
      </div>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
position: fixed;
z-index: 3;
width: 100%;

.container {
  background-color: ${vars.veryLightGray};
}

.scrolled {
  border-bottom: 1.5px solid ${vars.lightGray};
  padding-bottom: 5px;
}

.inner-container {
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  max-width: 1300px;
  margin: 0 auto;
}

.login-menu {
  list-style: none;
  display: flex;
  gap: 5px;
  margin-left: 30px;

  a:hover {
    border: 1px solid ${vars.lightBlue};
    outline: 1px solid ${vars.lightBlue};
  }

  a:active {
    opacity: .8;
  }

  a {
    border: 1px solid ${vars.lightGrayishBlue};
    padding: 3px 6px;
    border-radius: 50px;
    text-decoration: none;
    color: ${vars.lightBlue};
    display: flex;
    align-items: center;
  }

  .login-icon {
    font-size: 18px;
  }

  .login {
    font-size: 20px;
  }

  p {
    margin-left: 5px;
  }
}

.menu-btn {
  border: none;
  border-radius: 8px;
  background: none;
  overflow:hidden;
  display: flex;
  align-items: center;
  translate: 0 -3px;

  .menu-p {
    display: none;
    pointer-events: none;
  }

  .menu-icon {
    display: block;
    margin-left: 5px;
    color: ${vars.darkBlue};
    pointer-events: none;
    }
}

.menu-btn:hover {
  opacity: 1;
}

.avatar {
  display: block;
  border-radius: 50px;
  pointer-events: none;
}

.nav-container {
  position: relative;
}

.profile-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  border-radius: 12px;
  background: #131414;
  padding: 15px;
  z-index: 4;

  li {
    list-style: none;
  }

  .page-btn, .logout-btn {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    font-family:'Rubik';
    font-size: 16px;
    font-weight: 500;
  }

  .page-btn {
    color: #4a9ff4;
  }

  .page-btn:hover {
    color: #7cbdff;
  }

  .logout-btn {
    color: #f16f73;
    width: 100%;
    border-radius: 0;
    margin-top: 15px;
    position: relative;
  }

  .logout-btn::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #f2f2f24d;
    top: -5px;
    left: 0;
    pointer-events: none;
  }

  p {
    margin-left: 10px;
  }

  a {
    text-decoration: none;
  }

  .btn-bg {
    background-color: #f2f2f21b;
  }
}

@media screen and (min-width: 720px){
  .login-menu {
    gap: 15px;

    a {
      padding: 5px 12px;
    }
  }

  .menu-btn {

    .menu-p {
    display: block;
    margin-left: 10px;
    font-weight: 500;
    font-size: 17px;
    font-family: 'Rubik';
    color: ${vars.darkBlue};
   }

   .menu-icon {
    margin-left: 7px;
   }
  }

  .scrolled {
    padding-bottom: 8px;
  }
}

@media screen and (min-width: 1200px) {
  .logo {
    margin-left: 70px;
  }
}
`

export default Navbar