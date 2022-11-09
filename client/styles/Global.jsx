import { createGlobalStyle } from "styled-components"

export const vars = {
  'moderateBlue': '#5457b6',
  'softRed': '#ed6468',
  'lightGrayishBlue': '#c3c4ef',
  'paleRed': '#ffb8bb',
  'darkBlue': '#324152',
  'darkerBlue': '#243345',
  'grayishBlue': '#67727e',
  'lightGray': '#eaecf1',
  'veryLightGray': '#f5f6fa',
  'gray': '#828282',
  'lightBlue': '#3D90E3',
  'darkModerateBlue': '#282a7d'
}

export const GlobalStyles = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  height: 100vh;
}

body {
  height: 100%;
  font-family: 'Rubik';
  font-weight: 500;
  background: ${vars.veryLightGray};
  overflow-x: hidden;
}

#__next {
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
}

button {
  cursor: pointer;
  font-family: 'Rubik';
}

button:hover {
  opacity: .8;
}

button:active {
  opacity: 1;
}
`