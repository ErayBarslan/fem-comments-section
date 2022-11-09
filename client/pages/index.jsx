import Image from 'next/image'
import styled from 'styled-components'
import Navbar from '../components/Navbar'
import { useAtom } from 'jotai'
import { userAtom, tokenAtom, commentsAtom, parentAtom, textAtom, displayScreenAtom } from './_app'
import { useEffect, useState, useMemo } from 'react'
import { vars } from '../styles/Global'
import CommentList from '../components/CommentList'
import Loading from '../components/Loading'
import NoSSR from '../utils/NoSSR'
import { FiChevronLeft } from 'react-icons/fi'
import Router from 'next/router'

import io from "socket.io-client"

const socket = io.connect("http://localhost:5000")

export const getStaticProps = async () => {
  const res = await fetch(`${process.env.API_URL}/comments`)
  const data = await res.json()

  const res2 = await fetch(`${process.env.API_URL}/user`)
  const data2 = await res2.json()

  return {
    props: {
      fetchedComments: data,
      users: data2
    }
  }
}

export default function Home({ fetchedComments, users }) {
  const [user, setUser] = useAtom(userAtom)
  const [token, setToken] = useAtom(tokenAtom)
  const [comments, setComments] = useAtom(commentsAtom)
  const [text, setText] = useAtom(textAtom)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [parentId, setParentId] = useAtom(parentAtom)
  const [renderIndex, setRenderIndex] = useState(false)
  const [displayedScreen, setDisplayedScreen] = useAtom(displayScreenAtom)

  const sendComment = (comment_id, replyToId, replyText) => {
    const textData = {
      text: replyText || text,
      userName: user.name,
      userAvatar: user.avatar,
      createdAt: Date.now(),
      _id: comment_id,
      likes: 0,
      self: false,
      replyTo: replyToId || undefined
    }

    socket.emit('send_comment', textData)

    textData.self = true
    setComments((list) => [...list, textData])
  }

  useEffect(() => {
    socket.off('receive_comment').on('receive_comment', (data) => {
      setComments((list) => [...list, data])
    })
  }, [socket])

  useEffect(() => {
    setDisplayedScreen("comments")
    setLoading(true)
    if (!user && localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user')).user)
      setToken(JSON.parse(localStorage.getItem('user')).token)
    }

    setComments(fetchedComments)
    setLoading(false)
  }, [])

  //Comments by reply
  const commentsByParent = useMemo(() => {
    if (!comments) return []
    const group = {}

    comments.forEach(comment => {
      group[comment?.replyTo] ||= []
      group[comment?.replyTo].push(comment)
    })
    return group
  }, [comments])

  const getReplies = (parentID) => {
    return commentsByParent[parentID]
  }

  //Send comment
  const submitHandler = async (e) => {
    e.preventDefault()

    if (!user) return Router.push('/signup')
    if (sending) return

    try {
      setSending(true)

      const res = await fetch('/comments', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        setSending(false)
      }
      else {
        sendComment(data.comment._id)
        setError(null)
        setLoading(false)
        setSending(false)
        if (user) setText("")
      }
    } catch (error) {
      console.error(error)
      setError(data.error)
    }
  }

  return (<>
    <NoSSR>
      <Navbar setRenderIndex={setRenderIndex} renderIndex={renderIndex} />
      <StyledContainer>
        {
          loading ?
            (
              <div className='loading-holder'><Loading /></div>
            )
            : (
              <div className='comment-area'>
                {parentId && <button
                  onClick={() => setParentId(undefined)}
                  className='back-btn'>
                  <FiChevronLeft className='left-icon' size={30} />
                  <span>Back</span>
                </button>}
                <CommentList
                  comments={commentsByParent[parentId]}
                  getReplies={getReplies}
                  user={user}
                  users={users}
                  sendComment={sendComment} />

                <form className='form-container' onSubmit={submitHandler}>
                  <textarea
                    type="text"
                    maxLength="700"
                    className='txt-area'
                    placeholder="Add a comment..."
                    onChange={(e) => setText(e.target.value)}
                    value={text} />
                  <div className='img-holder'>
                    <Image
                      src={user ? user.avatar : '/default-avatar.png'}
                      width={40}
                      height={40}
                      className="form-avatar" />
                  </div>
                  <div className='send-btn-holder'>
                    <button className={text ? 'send-btn' : 'send-btn disabled'} type="submit" disabled={!text}>send</button>
                  </div>
                </form>
              </div>
            )
        }
      </StyledContainer>
    </NoSSR>
  </>)
}

const StyledContainer = styled.main`
margin-top: 64px;
margin-bottom: 32px;
width: 100%;

.comment-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 17px;
  width: 91.5%;
  max-width: 731px;
  margin: 0 auto;
}

.form-container {
  width: 100%;
  background: white;
  padding: 17px 16px 13px 16px;
  display: grid;
  grid-template-areas: 
              "text text"
              "text text"
              "person send";
  gap: 16px;
  align-items: center;
  border-radius: 8px;
}

.txt-area {
  width: 100%;
  height: 95px;
  resize: none;
  padding: 12px 24px;
  grid-area: text;
  font-family: 'Rubik';
  border: 1px solid ${vars.lightGray};
  border-radius: 8px;
  color: ${vars.darkBlue};
}

.img-holder {
  display: flex;
  align-items: center;
}

.form-avatar {
  border-radius: 50%;
}

.send-btn-holder {
  display: flex;
  align-items: center;
  justify-content: end;
}

.send-btn {
  background-color: ${vars.moderateBlue};
  color: white;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 16px;
  padding: 14.5px 30.5px;
  border: none;
  border-radius: 8px;
}

.disabled {
  cursor: not-allowed;
}

.loading-holder {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.back-btn {
  display: flex;
  align-self: flex-end;
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
    font-size: 20px;
  }
}

@media screen and (min-width:720px){
  .comment-area {
    gap: 20px;
  }

  .form-container {
    grid-template-areas: 
              "person text send"
              ".      text .";

    grid-template-columns: auto 1fr auto;          
  }

  .form-container {
    padding: 24px;
  }
}
`