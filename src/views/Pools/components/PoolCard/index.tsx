import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import { Flex, CardRibbon, useMatchBreakpoints } from 'uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import { ReactComponent as ArrowDown } from 'assets/images/ArrowDown.svg'
import { ReactComponent as ArrowUp } from 'assets/images/ArrowUp.svg'
import styled from 'styled-components'
import AprRow from './AprRow'
import { StyledCardContent, StyledCardBody, StyledCard, StyledCardInner } from './StyledCard'
import ExpandedFooter from './CardFooter/ExpandedFooter'
import { PoolTokenPairImage } from '../PoolsTable/Cells/PoolTokenPairImage'
import CardActions from './CardActions'

const ArrowWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const { sousId, stakingToken, earningToken, isFinished, userData, isAutoVault } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  // const accountHasStakedBalance = stakedBalance.gt(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const { isXl } = useMatchBreakpoints()

  const CustomSpanElement = styled.span`
    font-size: 10px;
    ${({ theme }) => theme.mediaQueries.xs} {
      font-size: 10px;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 14px;
    }
  `
  const CustomConnectWalletButton = styled(ConnectWalletButton)`
    font-size: 10px;
    ${({ theme }) => theme.mediaQueries.xs} {
      font-size: 10px;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 14px;
      padding: 12px 30px;
      width: 200px;
    }
  `
  return (
    <StyledCard
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={t('Finished')} />}
    >
      <StyledCardInner>
        <StyledCardBody>
          {isXl && (
            <PoolTokenPairImage
              isAuto={isAutoVault}
              primaryToken={earningToken}
              secondaryToken={stakingToken}
              mr="8px"
              width={40}
              height={40}
            />
          )}
          <StyledCardContent>
            <AprRow pool={pool} />
            <Flex alignItems="left" justifyContent="space-between">
              {account ? (
                <CardActions
                  isExpanded={isExpanded}
                  pool={pool}
                  stakedBalance={stakedBalance}
                  setExpanded={() => {
                    setIsExpanded(!isExpanded)
                  }}
                />
              ) : (
                <>
                  <Flex alignItems="center" justifyContent="space-between">
                    <CustomSpanElement>{t('Start earning')}</CustomSpanElement>
                    <CustomConnectWalletButton />
                    <ArrowWrapper onClick={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? <ArrowUp /> : <ArrowDown />}
                    </ArrowWrapper>
                  </Flex>
                </>
              )}
            </Flex>
          </StyledCardContent>
        </StyledCardBody>
        {isExpanded && <ExpandedFooter pool={pool} account={account} />}
      </StyledCardInner>
    </StyledCard>
  )
}

export default PoolCard
