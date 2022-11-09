import { useState } from 'react'
import styled from 'styled-components'
import { vars } from '../styles/Global'
import { BsPersonFill } from 'react-icons/bs'
import { IoMdLock } from 'react-icons/io'
import Loading from '../components/Loading'
import Link from 'next/link'
import Image from 'next/image'
import { useAtom } from 'jotai'
import { userAtom, tokenAtom } from './_app'
import Router from 'next/router'

const Login = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useAtom(userAtom)
  const [token, setToken] = useAtom(tokenAtom)

  const submitHandler = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/user/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ name, password })
      })
      const data = await res.json()

      if (!res.ok) {
        setLoading(false)
        setError(data.error)
      }
      else {
        localStorage.setItem('user', JSON.stringify(data))

        setUser(data.user)
        setToken(data.token)
        setLoading(false)
        Router.push('/')
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <LoginContainer>
      <Link href="/"><a aria-labelledby='logo-login'>
        <Image src="/logo.svg" alt="comment section" width={202} height={56} id="logo-login" />
      </a></Link>

      <h1>Login</h1>

      <form onSubmit={submitHandler}>

        <div className='input-holder'>
          <BsPersonFill className='person-icon' size={27} />
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Username"
            aria-label="username"
            autoFocus />
        </div>

        <div className='input-holder'>
          <IoMdLock className='lock-icon' size={27} />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
            aria-label="password" />
        </div>

        {loading ? <Loading /> :
          <button
            disabled={loading}
            className="submit-btn"
            type="submit"
          >Login</button>}
        {error && <p className='error'>{error}</p>}
      </form>

      <p className='bottom-txt'>Don&apos;t have an account yet? <Link href="/signup" className="link"><a>Register</a></Link></p>
    </LoginContainer>
  )
}

const LoginContainer = styled.main`
width: 90%;
max-width: 474px;
margin: 18px 0 30px 0;

h1 {
  margin-top: 27px;
  font-size: 20px;
  font-weight: 500;
  color: ${vars.grayishBlue};
}

form {
  display: flex;
  flex-direction: column;
  gap: 14.5px;
  width: 100%;
  margin-top: 27px;
  position: relative;
}

.input-holder {
  display: flex;
  align-items: center;
  border: 1px solid ${vars.grayishBlue};
  border-radius: 8px;
  padding: 13.6px 14px; 

  .person-icon, .lock-icon{
    color: ${vars.grayishBlue};
    margin: -15px 0;
  }

  input {
    border: none;
    outline: none;
    color: ${vars.darkBlue};
    margin-left: 13px;
    width: 100%;
    font-size: 16px;
    font-weight: 400;
    background: transparent;
  }
}

.submit-btn {
  margin-top: 8px;
  border: none;
  background-color: ${vars.moderateBlue};
  border-radius: 8px;
  color: White;
  font-weight: 500;
  font-size: 16px;
  font-family: 'Rubik';
  padding: 8px;
  cursor: pointer;
}

.error {
  position: absolute;
  top: Calc(100% - 55px);
  color: ${vars.softRed};
}

.bottom-txt {
  margin-top: 32px;
  text-align: center;
  color: ${vars.grayishBlue};
  font-size: 14px;
  font-weight: 400;
}

a {
  color: ${vars.lightBlue};
  text-decoration: none;
}

//DESKTOP
@media screen and (min-width: 720px) {
  border-radius: 24px;
  padding: 40px 58px 58px 58px;
  margin: 0;
  align-self: center;
  background: white;
  box-shadow: 1px 7px 35px ${vars.lightGrayishBlue};
}
`

export default Login