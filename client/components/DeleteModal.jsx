import { useState } from 'react'
import { useAtom } from 'jotai'
import { tokenAtom, commentsAtom } from '../pages/_app'
import styled from 'styled-components'
import { vars } from '../styles/Global'

const Modal = ({ setDeleteModal, comment }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [token] = useAtom(tokenAtom)
  const [comments, setComments] = useAtom(commentsAtom)

  const deleteHandler = async () => {
    try {
      setLoading(true)
      const res = await fetch('/comments/' + comment._id, {
        method: 'DELETE',
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        setLoading(false)
      }
      else {
        setComments(comments.filter(deleted => comment._id !== deleted._id))

        setError(null)
        setLoading(false)
      }

    } catch (error) {
      console.error(error)
      setError(data.error)
    }
  }

  return (<>
    <DeleteContainer
      aria-modal="true"
      role="dialog"
      aria-live="assertive"
      aria-labelledby="delete-title"
    >
      <h1 id="delete-title" className='delete-title'>Delete comment</h1>
      <p className='delete-txt'>Are you sure you want to delete this comment? This will remove the comment and can&apos;t be undone.</p>

      <div className='btn-area'>

        <button
          className='modal-btn cancel-btn'
          onClick={() => setDeleteModal(false)}>no, cancel
        </button>

        <button
          className='modal-btn delete-btn'
          onClick={deleteHandler}>yes, delete</button>
      </div>
    </DeleteContainer>

    <ModalBg onClick={() => setDeleteModal(false)} />
  </>)
}

const DeleteContainer = styled.div`
  z-index: 4;
  background-color: white;
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

  .delete-title {
    align-self: flex-start;
    color: ${vars.darkBlue};
    font-size: 26px;
    font-weight: 500;
  }

  .delete-txt {
    margin-top: 15px;
    color: ${vars.grayishBlue};
    line-height: 1.35;
  }

  .btn-area {
    display: flex;
    margin-top: 20px;
    gap: 10px;
    width: 100%;
  }

  .modal-btn {
  text-transform: uppercase;
  font-weight: 500;
  font-size: 16px;
  padding: 14.5px 0;
  border: none;
  border-radius: 8px;
  color: white;
  width: 100%;
  }

  .cancel-btn {
    background-color: ${vars.grayishBlue};
  }

  .delete-btn {
    background-color: ${vars.softRed};
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

export default Modal