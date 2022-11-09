import React, { useEffect } from 'react'
import Comment from '../components/Comment'

const CommentList = ({ comments, getReplies, user, nestCount, sendComment, users }) => {

  return comments?.map(comment => (
    <Comment
      key={comment._id}
      comment={comment}
      user={user}
      users={users}
      getReplies={getReplies}
      nestCountPassed={nestCount}
      sendComment={sendComment}
    />
  ))
}

export default CommentList