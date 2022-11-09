import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { userAtom } from '../pages/_app'
import styled from 'styled-components'
import { vars } from '../styles/Global'
import Image from 'next/image'
import { IoClose } from 'react-icons/io5'

const ProfileModal = ({ setProfileModal, users, profile }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const user = users.filter(item => item.name === profile)

  return (<>
    <ProfileContainer
      aria-modal="true"
      role="dialog"
      aria-live="assertive"
      aria-labelledby="profile-title"
    >
      <div className="avatar-holder">
        <img
          src={user[0].avatar}
          className="avatar" />
      </div>

      <h2 className='profile-title' id="profile-title">{user[0].name}</h2>

      <p className='bio'>{user[0].bio}</p>

      <button
        arial-label="close"
        className='close-btn'
        onClick={() => setProfileModal(false)}>
        <IoClose
          size={40}
          className="close-icon" />
      </button>
    </ProfileContainer>

    <ModalBg onClick={() => setProfileModal(false)} />
  </>)
}

const ProfileContainer = styled.div`
  z-index: 4;
  background-color: #000000b9;
  position: fixed;
  width: 92%;
  max-width: 380px;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  border-radius: 8px;

  .avatar-holder {
    margin-top: 30px;
  }

  .avatar {
    display: block;
    width: 80px;
    outline: 4px solid #f7f8ff;
  }

  .profile-title {
    font-weight: 500;
    margin-top: 20px;
    color: #f7f8ff;
  }

  .bio {
    padding: 0 10px;
    margin: 30px 0;
    color: ${vars.veryLightGray};
    font-style: italic;
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: none;
  }

  .close-icon {
    color: ${vars.lightBlue};
    opacity: .6;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .close-btn:hover > .close-icon {
    opacity: 1;
  }
`

const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000066;
  z-index: 3;
`

export default ProfileModal