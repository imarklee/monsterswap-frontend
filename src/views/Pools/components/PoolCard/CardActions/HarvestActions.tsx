import React from 'react'
import styled from 'styled-components'
import { Flex, Button, useModal, Skeleton } from 'uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { ReactComponent as ArrowDown } from 'assets/images/ArrowDown.svg'
import { ReactComponent as ArrowUp } from 'assets/images/ArrowUp.svg'
import ApprovalAction from './ApprovalAction'
import CollectModal from '../Modals/CollectModal'

interface HarvestActionsProps {
  earnings: BigNumber
  earningToken: Token
  sousId: number
  earningTokenPrice: number
  isBnbPool: boolean
  isLoading?: boolean
  needsApproval: boolean
  pool: any
  isExpanded: boolean
  setExpanded: () => void
}

const ArrowWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const EarnedText = styled.div`
  & h2 {
    font-family: 'Funhouse';
    font-size: 12px;
    font-weight: normal;

    ${({ theme }) => theme.mediaQueries.sm} {
      font-family: 'Ubuntu';
      font-size: 14px;
    }
  }

  & p {
    font-family: 'Ubuntu';
    font-size: 12px;

    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 18px;
      font-weight: bold;
    }
  }
`

const RoundedButton = styled(Button)`
  border-radius: 18px;
`

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  isBnbPool,
  earningTokenPrice,
  isLoading = false,
  needsApproval,
  pool,
  isExpanded,
  setExpanded,
}) => {
  const { t } = useTranslation()
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)

  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)

  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const hasEarnings = earnings.toNumber() > 0
  const isCompoundPool = sousId === 0

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningTokenDollarBalance}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {isLoading ? (
        <Skeleton width="80px" height="48px" />
      ) : (
        <>
          <EarnedText>
            <h2>{t('Earned')}</h2>
            <p>999, 999, 999</p>
            {/* {hasEarnings ? (
              <Balance decimals={5} value={earningTokenBalance} />
            ) : (
              <h2>0</h2>
            )} */}
          </EarnedText>
          <Flex>
            {/* {needsApproval && <ApprovalAction pool={pool} isLoading={isLoading} />} */}
            {/* {hasEarnings && (
              <Button onClick={onPresentCollect}>
                {t('Compound')}
              </Button>
            )} */}
            <RoundedButton onClick={onPresentCollect}>
              {/* {isCompoundPool ? t('Collect') : t('Harvest')} */}
              {t('Compound')}
            </RoundedButton>
            <ArrowWrapper onClick={setExpanded}>{isExpanded ? <ArrowUp /> : <ArrowDown />}</ArrowWrapper>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default HarvestActions
