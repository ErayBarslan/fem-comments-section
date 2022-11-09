import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { userAtom, tokenAtom, displayScreenAtom } from '../pages/_app'
import styled from 'styled-components'
import Image from 'next/image'
import { vars } from '../styles/Global'

const ProfileDisplay = () => {
  const [user, setUser] = useAtom(userAtom)
  const [token, setToken] = useAtom(tokenAtom)
  const [laoding, setLoading] = useState(false)
  const [displayedScreen, setDisplayedScreen] = useAtom(displayScreenAtom)

  useEffect(() => {
    setLoading(true)
    if (!user && localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user')).user)
      setToken(JSON.parse(localStorage.getItem('user')).token)
    }
    setLoading(false)
  }, [])

  return (
    <DisplayContainer>
      <div className='profile-header'>
        <div className='text-holder'>
          <h2>Profile Info</h2>
        </div>
        <button
          className='edit-btn'
          onClick={() => setDisplayedScreen("edit")}>Edit</button>
      </div>

      <div className='info-holder with-img'>
        <p className='left-p'>photo</p>
        <Image
          src={user?.avatar || "/default-avatar.png"} alt="user avatar"
          width={72}
          height={72}
          className="avatar" />
      </div>

      <div className='info-holder'>
        <p className='left-p'>username</p>
        <p className='right-p'>{user?.name}</p>
      </div>

      <div className='info-holder'>
        <p className='left-p'>bio</p>
        <p className='right-p bio'>{user?.bio}</p>
      </div>

      <div className='info-holder'>
        <p className='left-p'>password</p>
        <p className='right-p'>**********</p>
      </div>
    </DisplayContainer>
  )
}

const DisplayContainer = styled.main`
margin-top: 120px;
margin-bottom: 30px;
display: flex;
flex-direction: column;
width: 95%;
max-width: 800px;

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30px;
  position: relative;

  h2 {
    font-weight: 500;
    font-size: 27px;
    color: ${vars.darkBlue};
  }

  .edit-btn {
    background: #ffffff84;
    border: 1px solid ${vars.moderateBlue};
    color: ${vars.moderateBlue};
    font-family: 'Rubik';
    font-weight: 500;
    font-size: 16px;
    padding: 8px 33px;
    border-radius: 12px;
    opacity: .75;
  }

  .edit-btn:hover {
    opacity: .6;
  }
}

.info-holder {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 31px 0;
    position: relative;

    .left-p {
      text-transform: uppercase;
      font-size: 14px;
      color: ${vars.grayishBlue};
    }

    .avatar {
      border-radius: 8px;
    }

    .right-p {
      color: ${vars.darkBlue};
      word-wrap: break-word;
      max-width: 70%;
    }

    .bio {
      font-style: italic;
    }
  }

.with-img {
  padding: 10px 0;
}  

  .info-holder::after, .profile-header::after {
    content: '';
    position: absolute;
    left: -100%;
    top: 100%;
    width: 200vw;
    height: 1px;
    background-color: #82828282;
  }

@media screen and (min-width: 720px){
  padding: 30px 40px 0 40px;
  border: 1px solid #82828282;
  overflow: hidden;
  align-self: flex-start;
  border-radius: 12px;
}  
`

export default ProfileDisplay