import Navbar from '../components/Navbar'
import ProfileDisplay from '../components/ProfileDisplay'
import ProfileEdit from '../components/ProfileEdit'
import { useState, useLayoutEffect } from 'react'
import Router from 'next/router'
import { userAtom, displayScreenAtom } from './_app'
import { useAtom } from 'jotai'

const Profile = () => {
  const [renderIndex, setRenderIndex] = useState(true)
  const [displayedScreen, setDisplayedScreen] = useAtom(displayScreenAtom)
  const [user] = useAtom(userAtom)

  useLayoutEffect(() => {
    if (!user) {
      Router.push('/')
    }
  }, [])

  return (<>
    <Navbar
      setRenderIndex={setRenderIndex}
      renderIndex={renderIndex} />
    {
      displayedScreen === "display" && <ProfileDisplay />
    }
    {
      displayedScreen === "edit" && <ProfileEdit />
    }
  </>)
}

export default Profile