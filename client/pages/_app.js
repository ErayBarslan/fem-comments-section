import Head from 'next/head'
import { GlobalStyles } from '../styles/Global'
import { Provider, atom } from 'jotai'

export const userAtom = atom(null)
export const tokenAtom = atom(null)
export const commentsAtom = atom([])
export const parentAtom = atom(undefined)
export const textAtom = atom("")
export const replyTextAtom = atom("")
export const displayScreenAtom = atom("")

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Interactive Comments Section | Frontend Mentor</title>
    </Head>
    <GlobalStyles />
    <Provider>
      <Component {...pageProps} />
    </Provider>
  </>
}

export default MyApp
