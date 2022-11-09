import styled from 'styled-components'
import { vars } from '../styles/Global'

const Loading = () => {
  return (
    <LoadingEffect />
  )
}

const LoadingEffect = styled.div`
  margin: auto;
  border: 10px solid #EAF0F6;
  border-radius: 50%;
  border-top: 10px solid ${vars.moderateBlue};
  border-left: 10px solid ${vars.moderateBlue};
  width: 44px;
  height: 44px;
  animation: spinner .75s linear infinite;

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`

export default Loading