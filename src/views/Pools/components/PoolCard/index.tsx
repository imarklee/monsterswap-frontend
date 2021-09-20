import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import { Flex, CardRibbon, useMatchBreakpoints } from 'uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import styled from 'styled-components'
import AprRow from './AprRow'
import { StyledCardContent, StyledCardBody, StyledCard, StyledCardInner } from './StyledCard'
import ExpandedFooter from './CardFooter/ExpandedFooter'
import { PoolTokenPairImage } from '../PoolsTable/Cells/PoolTokenPairImage'
import CardActions from './CardActions'

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
            <Flex mt="8px" flexDirection="column">
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
                  <p>
                    <CustomSpanElement>{t('Start earning')}</CustomSpanElement>
                  </p>
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
