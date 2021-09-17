import React from 'react'
import styled from 'styled-components'
import tokens from 'config/constants/tokens'
import { Token } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'

interface NFTImageProps {
  token: Token,
  quoteToken: Token,
  list?: boolean,
}

const StyledImage = styled.img<{ list: boolean }>`
  margin-top: 30px;
  width: ${({ list }) => list ? '38px' : '30px'};
  height: ${({ list }) => list ? '38px' : '30px'};
`

const NFTImage: React.FC<NFTImageProps> = (props) => {
  const { token, quoteToken, list } = props
  const getImageUrl = (srcToken: Token) => {
    const address = getAddress(srcToken.symbol === 'BNB' ? tokens.wbnb.address : srcToken.address)
    return `/images/tokens/${address}.svg`
  }

  return (
    <>
      <StyledImage src={getImageUrl(token)} list={list} />
      <StyledImage src={getImageUrl(quoteToken)} list={list} />
    </>
  )
}

export default NFTImage