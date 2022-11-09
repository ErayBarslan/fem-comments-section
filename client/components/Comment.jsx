import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { vars } from '../styles/Global'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { useAtom } from 'jotai'
import { tokenAtom, userAtom, parentAtom, commentsAtom, replyTextAtom } from '../pages/_app'
import Image from 'next/image'
import DeleteModal from '../components/DeleteModal'
import { MdCancel } from 'react-icons/md'
import CommentList from './CommentList'
import { FiChevronRight, FiChevronDown } from 'react-icons/fi'
import Router from 'next/router'
import ProfileModal from './ProfileModal'

const Comment = ({ comment, getReplies, nestCountPassed, sendComment, users }) => {
  const [token] = useAtom(tokenAtom)
  const [user, setUser] = useAtom(userAtom)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [profileModal, setProfileModal] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(comment.text)
  const [editedText, setEditedText] = useState("")
  const [sending, setSending] = useState(false)
  const [commentLikes, setCommentLikes] = useState(null)
  const [childrenHidden, setChildrenHiddden] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [profile, setProfile] = useState("")
  const [replyText, setReplyText] = useAtom(replyTextAtom)
  const [parentId, setParentId] = useAtom(parentAtom)
  const [comments, setComments] = useAtom(commentsAtom)
  const childComments = getReplies(comment._id)

  const nestCount = nestCountPassed || 1

  useEffect(() => {
    setShowTime(true)
  }, [])

  const editHandler = async (e) => {
    e.preventDefault()

    if (!user) return
    if (!editText) return
    if (sending) return

    try {
      setSending(true)

      const res = await fetch('/comments/' + comment._id, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: editText })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        setSending(false)
        setEditing(false)
        setEditText(editedText || comment.text)
      }
      else {
        setError(null)
        setLoading(false)
        setSending(false)
        setEditing(false)
        setEditedText(data?.comment.text)
        setEditText(data?.comment.text || comment.text)
      }
    } catch (error) {
      console.error(error)
      setError(data?.error)
    }
  }

  const upvote = async () => {
    if (sending) return
    if (!user) return Router.push('/signup')

    let vote
    try {
      setSending(true)

      if (user.upvoted.includes(comment._id)) {
        vote = -1
      }
      else if (user.downvoted.includes(comment._id)) {
        vote = 2
      }
      else {
        vote = 1
      }

      const res = await fetch('user/vote/' + comment._id, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vote, like: true })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.error)
        setLoading(false)
        setSending(false)
      }
      else {
        setError(null)
        setLoading(false)
        setSending(false)
        setCommentLikes(data.comment.likes)
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data))
      }

    } catch (error) {
      console.error(error)
      setError(data?.error)
    }
  }

  const downvote = async () => {
    if (sending) return
    if (!user) return Router.push('/signup')

    let vote
    try {
      setSending(true)

      if (user.downvoted.includes(comment._id)) {
        vote = 1
      }
      else if (user.upvoted.includes(comment._id)) {
        vote = -2
      }
      else {
        vote = -1
      }

      const res = await fetch('user/vote/' + comment._id, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vote })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.error)
        setLoading(false)
        setSending(false)
      }
      else {
        setError(null)
        setLoading(false)
        setSending(false)
        setCommentLikes(data.comment.likes)
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data))
      }

    } catch (error) {
      console.error(error)
      setError(data?.error)
    }
  }

  const replyHandler = async (e) => {
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
        body: JSON.stringify({ text: replyText, replyTo: comment._id })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
        setSending(false)
      }
      else {
        sendComment(data.comment._id, comment._id, replyText)
        setError(null)
        setLoading(false)
        setSending(false)
        if (user) setShowReply(false)
        if (user) setReplyText("")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (<>
    <CommentContainer>
      <div className='comment-container'>
        {deleteModal ?
          <DeleteModal
            setDeleteModal={setDeleteModal}
            comment={comment}
          /> :
          null
        }

        {profileModal ?
          <ProfileModal
            setProfileModal={setProfileModal}
            users={users}
            profile={profile}
          /> :
          null
        }

        <div className='sender'>
          <Image
            width={32}
            height={32}
            src={comment.userAvatar}
            className="avatar" />
          <p
            className='name'
            onClick={(e) => {
              setProfileModal(true)
              setProfile(e.target.innerText)
            }}
            aria-haspopup="dialog"
            aria-label="profile details">{comment.userName}</p>
          {user?._id === comment.user_id || comment.self ? (
            <p className='you'>you</p>
          ) : null}
          <p className='time'>{showTime && formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })}</p>
        </div>

        <div className='text-holder'>
          {!editing ? (
            <p className='comment-txt'>
              {!editedText ? users.reduce((result, item) => {
                result.push(item.name)
                return result
              }, []).filter(user => comment.text.includes("@" + user)).map(user => (
                <span
                  className='comment-txt-mention'
                  key={user}
                  onClick={(e) => {
                    setProfileModal(true)
                    setProfile(e.target.innerText.substring(1).trim())
                  }}
                  aria-haspopup="dialog"
                  aria-label="profile details">@{user} </span>
              )) :
                users.reduce((result, item) => {
                  result.push(item.name)
                  return result
                }, []).filter(user => editedText.includes("@" + user)).map(user => (
                  <span className='comment-txt-mention' key={user}>@{user} </span>
                ))}
              <span className='comment-txt-text'>{editedText.replace(/\B@[a-z0-9_-]+/gi, '') || comment.text.replace(/\B@[a-z0-9_-]+/gi, '')}</span>
            </p>
          ) : (
            <form onSubmit={editHandler} className='edit-form'>
              <textarea
                rows="8"
                className='edit-txt'
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
                onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                maxLength="700" />
              <button type="submit" className='confirm-edit'>Update Comment</button>
            </form>
          )}
        </div>

        <div className='like-container'>
          <div className='like-holder'>
            <button
              aria-label="upvote"
              className='like-btn'
              onClick={upvote}>
              <Image
                src={user?.upvoted.includes(comment._id) ?
                  "/icon-plus-active.svg" :
                  "/icon-plus.svg"
                }
                width={11}
                height={11}
                aria-hidden="true" />
            </button>
            <span
              aria-label="likes"
              className='likes'
            >{commentLikes || comment.likes}</span>
            <button
              aria-label="downvote"
              className='like-btn'
              onClick={downvote}>
              <Image
                src={user?.downvoted.includes(comment._id) ?
                  "/icon-minus-active.svg" :
                  "/icon-minus.svg"
                }
                width={11}
                height={3}
                aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className='reply-container'>
          {user?._id === comment.user_id || comment.self ? (<>
            <button
              className='response-btn delete-btn'
              onClick={() => setDeleteModal(true)}
              aria-haspopup="dialog"
            >
              <Image
                src="/icon-delete.svg"
                width={12}
                height={14}
                aria-hidden="true" />
              <span className='response-txt delete'>Delete</span>
            </button>

            <button className='response-btn edit-btn' onClick={() => setEditing(!editing)}>
              {!editing ? (<>
                <Image
                  src="/icon-edit.svg"
                  width={14}
                  height={14}
                  aria-hidden="true" />
                <span className='response-txt edit'>Edit</span>
              </>) : (<>
                <MdCancel
                  className='cancel cancel-icon'
                  size={18} />
                <span className='response-txt cancel'>Cancel</span>
              </>)}
            </button>

          </>) : (
            <button
              className='response-btn'
              onClick={() => {
                setShowReply(!showReply)
                setReplyText(replyText.includes(comment.userName) ?
                  replyText :
                  "@" + comment.userName + " ")
              }}
            >
              <Image
                src="/icon-reply.svg"
                width={14}
                height={13}
                aria-hidden="true" />
              <span className='response-txt'>Reply</span>
            </button>
          )}
        </div>
      </div>

      {showReply && (
        <form
          className='reply-form-container'
          onSubmit={replyHandler}>
          <textarea
            type="text"
            maxLength="700"
            className='reply-txt-area'
            placeholder="Reply to comment..."
            onChange={(e) => setReplyText(e.target.value)}
            value={replyText}
            autoFocus
            onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
            onBlur={() => {
              const delayBlur = setInterval(() => {
                if (!sending) {
                  setShowReply(false)
                  clearInterval(delayBlur)
                }
              }, 100)
            }} />
          <div className='reply-btn-holder'>
            <button
              className='reply-to-btn cancel-to-btn'
              type="submit"
              onClick={() => {
                setShowReply(false)
                setReplyText("")
              }}>cancel</button>
            <button className={replyText ? 'reply-to-btn' : 'reply-to-btn disabled'} type="submit" disabled={!replyText}>reply</button>
          </div>
        </form>
      )}

    </CommentContainer>
    {childComments?.length > 0 && (<RepliesContainer>

      {nestCount < 3 ? (<>
        <div className={`nested-comments-container ${childrenHidden ? 'hide' : ''}`}>
          <button
            aria-label="hide replies"
            className='reply-line'
            onClick={() => setChildrenHiddden(true)} />
          <div className='nested-comments'>
            <CommentList
              comments={childComments}
              getReplies={getReplies}
              nestCount={nestCount + 1}
              sendComment={sendComment}
              users={users} />
          </div>
        </div>

        <button className={`show-replies-btn ${!childrenHidden ? "hide" : ""}`} onClick={() => setChildrenHiddden(false)}>
          <span>Show replies</span>
          <FiChevronDown size={22} className="replies-icon down" /></button></>
      ) : (
        <button className='show-replies-btn' onClick={() => setParentId(comment.replyTo)}>
          <span>Continue this comment</span>
          <FiChevronRight size={22} className="replies-icon" />
        </button>
      )}
    </RepliesContainer>)}
  </>)
}

const CommentContainer = styled.div`
width: 100%;
align-self: end;

.comment-container {
  width: 100%;
  background: white;
  padding: 16px;
  display: grid;
  grid-template-areas: 
              "person person"
              "text   text"
              "likes  reply";
  gap: 17px;
  align-items: center;
  border-radius: 9px;
}  

.sender {
  grid-area: person;
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  border-radius: 50%;
}

.name {
  color: ${vars.darkBlue};
  font-size: 16px;
  cursor: pointer;
}

.you {
  background-color: ${vars.moderateBlue};
  color: white;
  padding: 1px 7px 3px 7px;
  border-radius: 2px;
  font-weight: 400;
  font-size: 13px;
  margin: -2px -1px -2px -10px;
}

.time {
  color: ${vars.grayishBlue};
  font-weight: 400;
}

.text-holder {
  grid-area: text;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
}

.comment-txt {
  color: ${vars.grayishBlue};
  font-weight: 400;
  font-size: 16.1px;
  line-height: 1.45;
  word-wrap: break-word;

  .comment-txt-mention {
    color: ${vars.moderateBlue};
    font-weight: 500;
    cursor: pointer;
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
}

.edit-txt {
  resize: none;
  width: 100%;
  font-family: 'Rubik';
  color: ${vars.grayishBlue};
  font-weight: 400;
  line-height: 1.45;
  border-radius: 8px;
  border: 1px solid ${vars.lightGray};
}

.confirm-edit {
  margin-top: 15px;
  margin-bottom: 24px;
  background: #5480b6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
}

.like-container {
  grid-area: likes;
  display: flex;
  align-items: flex-start;
  height: 100%;
}

.like-holder {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 18px;
  background-color: ${vars.veryLightGray};
  border-radius: 10px;
}

.likes {
  color: ${vars.moderateBlue};
}

.like-btn {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  height: 11px;
}

.reply-container {
  grid-area: reply;
  display: flex;
  justify-content: end;
}

.response-btn {
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
}

.response-txt {
  margin-left: 8px;
  color: ${vars.moderateBlue};
  font-weight: 500;
  font-size: 16.5px;
}

.delete-btn {
  margin-right: 15px;  
}

.delete {
  color: ${vars.softRed};
}

.cancel {
  color: ${vars.grayishBlue};
}

.cancel-icon {
  margin: -3px;
}

.reply-form-container {
  width: 100%;
  background: white;
  padding: 17px 16px 13px 16px;
  border-radius: 8px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 10px;
}

.reply-txt-area {
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

.reply-to-btn {
  padding: 8px 20px;
  background-color: ${vars.moderateBlue};
  color: white;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 16px;
  border: none;
  border-radius: 8px;
}

.disabled {
  cursor: not-allowed;
}

.cancel-to-btn {
  padding: 7px 10px;
  margin-right: 20px;
  background: transparent;
  color: ${vars.grayishBlue};
}

.cancel-to-btn:hover {
  background-color: #5457b616;
}

@media screen and (min-width:720px){
  .comment-container {
    grid-template-areas:
              "likes person reply"
              "likes text   text"
              ".     text   text";
  grid-template-columns: auto 1fr auto;
  padding: 24px 24px 2px 24px;
  }

  .sender {
    gap: 17px;
  }

  .name {
    translate: 0 -1px;
  }

  .time {
    translate: 0 -1px;
  }

  .text-holder {
    margin-top: -5px;
  }

  .comment-txt {
    line-height: 1.5;
  }

  .like-container {
    margin-right: 7px;
  }

  .like-holder {
    flex-direction: column;
    padding: 10.5px 10px;
    min-width: 40px;
    gap: 18px;
  }

  .likes {
    font-size: 17px;
  }

  .response-txt {
    translate: 0 -1px;
  }
}
`

const RepliesContainer = styled.div`
  width: 100%;

.nested-comments-container {
  display: flex;
  justify-content: end;
  width: 100%;
}

.nested-comments {
  padding-left: 0;
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.reply-line {
  width: 15px;
  border: none;
  background: transparent;
  margin: 0 4px;
  cursor: pointer;
  position: relative;
}

.reply-line::after {
  content: '';
  position: absolute;
  width: 2px;
  top: 0;
  left: 50%;
  translate: -50%;
  height: 100%;
  background-color: ${vars.lightGray};
  border-radius: 100px;
}

.reply-line:hover::after {
  background-color: ${vars.moderateBlue};
  width: 3px;
}

.show-replies-btn {
  display: flex;
  align-items: center;
  color: ${vars.lightBlue};
  border: none;
  background: white;
  padding: 10px 17px;
  font-size: 17px;
  font-weight: 400;
  translate: -2px -25px;
  margin-left: 2px;
  margin-bottom: -25px;
  border-radius: 0 0 8px 8px;

  .replies-icon {
    margin: -1px -5px -1px -1px;
  }

  .down {
    margin: 0px -5px -2px -1px;
  }
}

.show-replies-btn:hover {
  text-shadow: 0 0 .1px ${vars.lightBlue};
}

.hide {
  display: none;
}

@media screen and (min-width: 720px){
  .reply-line {
    margin: 0 37px 0 38px;
  }

  .show-replies-btn {
    padding: 0 17px;
    translate: 0 -45px;
    margin-bottom: -45px;
    float: right;
  }

  .nested-comments {
    gap: 24px;
  }

  .delete-btn {
    margin-right: 24px;
  }
}
`

export default Comment