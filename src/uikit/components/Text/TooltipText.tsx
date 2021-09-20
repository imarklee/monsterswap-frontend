import styled from 'styled-components'
import Text from './Text'

const TooltipText = styled(Text)`
  text-decoration: ${({ theme }) => `underline dotted ${theme.colors.textSubtle}`};
  text-underline-offset: 0.1em;
  font-size: 10px;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 10px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 14px;
  }
`

export default TooltipText
