import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from 'uikit/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const baseUrl = process.env.REACT_APP_BASE_URL

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Funhouse';
    src: url(${baseUrl}/font/Funhouse.ttf);
  }
  @font-face {
    font-family: 'Ubuntu';
    src: local('Ubuntu'), url(${baseUrl}/font/Ubuntu.ttf) format('truetype');
  }
  @font-face {
    font-family: 'UbuntuBold';
    src: local('UbuntuBold'), url(${baseUrl}/font/UbuntuBold.ttf) format('truetype');
  }
  * {
    font-family: 'Funhouse';
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
