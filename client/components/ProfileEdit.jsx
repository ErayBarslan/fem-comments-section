import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { FiChevronLeft } from 'react-icons/fi'
import { AiFillCamera } from 'react-icons/ai'
import { vars } from '../styles/Global'
import { useAtom } from 'jotai'
import { userAtom, tokenAtom, displayScreenAtom } from '../pages/_app'
import Image from 'next/image'
import Loading from '../components/Loading'

const ProfileEdit = () => {
  const [user, setUser] = useAtom(userAtom)
  const [token, setToken] = useAtom(tokenAtom)
  const [displayedScreen, setDisplayedScreen] = useAtom(displayScreenAtom)
  const userid = user?._id

  const [name, setName] = useState(user?.name)
  const [bio, setBio] = useState(user?.bio)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(user?.avatar)

  const [selectedFile, setSelectedFile] = useState("")
  const submitButton = useRef()

  const fileInputHandler = (e) => {
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setSelectedFile(reader.result)
    }
  }

  useEffect(() => {
    selectedFile && submitButton.current.click()
  }, [selectedFile])

  const uploadImage = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const res = await fetch('/user/upload', {
        method: 'POST',
        body: JSON.stringify({ data: selectedFile }),
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()

      setImageUrl(data.url)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    let user;

    if (password) {
      user = { name, bio, password, avatar: imageUrl }
    }
    else {
      user = { name, bio, avatar: imageUrl }
    }

    if (!name) {
      setError("Name can't be empty")
      setLoading(false)
      return
    }

    const res = await fetch('/user/' + userid, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify(user)
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
    }
    else {
      setError(null)
      setName(data.name)
      setBio(data.bio)
      setPassword('')
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data.user)
      setToken(data.token)
      setLoading(false)
      setDisplayedScreen("display")
    }
  }

  return (<>
    {loading ? <Loading /> : (
      <EditContainer>
        <button
          className='back-btn'
          onClick={() => setDisplayedScreen("display")}>
          <FiChevronLeft className='left-icon' size={25} />
          <span>Back</span>
        </button>

        <div className='container'>
          <h2>Change Info</h2>

          <form onSubmit={uploadImage}>
            <div className='photo-container'>
              <label htmlFor="imgInput" className='change-btn'>
                <Image
                  src={imageUrl || user?.avatar || "/default-avatar.png"}
                  alt=""
                  width={72}
                  height={72}
                  className="avatar" />
                <AiFillCamera className='camera-icon' size={25} />
              </label>

              <input
                type="file"
                name="image"
                onChange={fileInputHandler}
                style={{ display: "none" }}
                id="imgInput" />
              <button
                type="submit"
                ref={node => submitButton.current = node}
                style={{ display: "none" }} />
              <p className='change-p'>change photo</p>
            </div>
          </form>

          <form
            onSubmit={submitHandler}
            className="submit-form">
            <label htmlFor="name"
              className='label'>Username</label>
            <input type="text"
              className='input'
              placeholder={user?.name}
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name} />

            <label htmlFor="bio"
              className='label'>Bio</label>
            <textarea type="text"
              className='txt-area'
              placeholder={user?.bio}
              id="bio"
              onChange={(e) => setBio(e.target.value)}
              value={bio} />

            <label htmlFor="password" className='label'>Password</label>
            <input type="password" className='input' placeholder="************" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />

            <button type="submit" className='save-btn'>Save</button>

            {error && <p className='error'>{error}</p>}
          </form>
        </div>
      </EditContainer>
    )}
  </>
  )
}

const EditContainer = styled.main`
margin-top: 120px;
margin-bottom: 30px;
display: flex;
flex-direction: column;
width: 95%;
max-width: 800px;
align-self: flex-start;

.submit-form {
  position: relative;
}

.error {
  position: absolute;
  top: Calc(100% - 80px);
  color: ${vars.softRed};
}

.back-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 18px;
  color: ${vars.moderateBlue};

  .left-icon {
    margin: 0 -7px;
  }

  span {
    margin-left: 5px;
  }
}

.container {
  h2 {
    margin-top: 30px;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    color: ${vars.darkBlue};
  }
}

.photo-container {
  margin-top: 25px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  .change-btn {
    position: relative;
    border: none;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;

    .avatar {
      display: block;
      border-radius: 8px;
    }

    .camera-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      translate: -50% -50%;
      color: ${vars.veryLightGray};
    }
  }

  .change-p {
    text-transform: uppercase;
    font-size: 14px;
    color: ${vars.grayishBlue};
    margin-left: 27px;
  }
}

.label {
  display: block;
  margin-top: 24px;
  font-size: 14px;
  color: ${vars.grayishBlue};
}

.input {
  width: 100%;
  padding: 15px;
  border: 1px solid #82828282;
  border-radius: 8px;
  color: ${vars.darkBlue};
  margin-top: 3px;
}

.txt-area {
  width: 100%;
  height: 100px;
  resize: none;
  padding: 15px;
  border: 1px solid #82828282;
  border-radius: 8px;
  color: ${vars.darkBlue};
  font-size: 14px;
  font-family: 'Rubik';
  margin-top: 3px;
}

.save-btn {
  border: none;
  background-color: ${vars.moderateBlue};
  padding: 8px 24px;
  font-size: 16px;
  font-family: 'Rubik';
  margin: 24px 0;
  border-radius: 8px;
  color: white;
}

@media screen  and (min-width:720px){
  padding: 30px 40px;
  border: 1px solid #82828282;
  border-radius: 12px;
  background-color: #ffffff58;
}
`

export default ProfileEdit