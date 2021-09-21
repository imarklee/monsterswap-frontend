import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon, useMatchBreakpoints } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import PoolRow from './PoolRow'

interface PoolsTableProps {
  pools: Pool[]
  userDataLoaded: boolean
  account: string
}

const StyledTable = styled.div`
  background-color: transparent;
`

const StyledTableBorder = styled.div`
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  align-items: center;
  height: 45px;
  border-radius: 60px;
  background: white;
  filter: ${({ theme }) => theme.card.dropShadow};
  & div {
    color: #464486;
  }
  @media (max-width: 767.98px) {
    padding-left: 20px;
  }
`

const StyledCell = styled.div`
  flex: 5;
  flex-direction: row;
  padding: 0 4px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding: 0 20px;
  }
`
const LiquidityHead = styled.div`
  background: #49468a;
  border-radius: 70px;
  padding: 12px 10px;
  color: white;
`

const PoolHead = styled.div`
  background: white;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05);
  border-radius: 70px;
  padding: 8px 12px;
  margin-top: 16px;
  & table {
    width: 100%;
    & td {
      text-align: center;
      line-height: 16px;
      letter-spacing: 0.04em;
      color: #464486;
      font-size: 9px;
      ${({ theme }) => theme.mediaQueries.xs} {
        font-size: 10px;
        padding-left: 20px;
      }
      ${({ theme }) => theme.mediaQueries.sm} {
        padding-right: 32px;
        font-size: 14px;
      }
    }
  }

  @media (max-width: 767.98px) {
    & table {
      & > div {
        padding-left: 20px;
      }
    }
  }
`
const TdElement = styled.div`
  background: #49468a;
  border-radius: 70px;
  color: white;
  padding: 12px 10px;
`
const CustomButton = styled(Button)`
  font-size: 10px;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 10px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 14px;
  }
`

const PoolsTable: React.FC<PoolsTableProps> = ({ pools, userDataLoaded, account }) => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const tableWrapperEl = useRef<HTMLDivElement>(null)

  const [sortState, setSortState] = useState(0)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  
  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        <PoolHead>
          <table>
            <thead>
              <tr>
                <td width="10%">
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={() => setSortState(0)}
                    onKeyDown={() => {
                      console.log()
                    }}
                  >
                    {sortState === 0 ? <TdElement>HOT</TdElement> : <span>HOT</span>}
                  </div>
                </td>
                <td width="25%">LP</td>
                <td width="10%">
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={() => setSortState(2)}
                    onKeyDown={() => {
                      console.log()
                    }}
                  >
                    {sortState === 2 ? <TdElement>APR</TdElement> : <span>APR</span>}
                  </div>
                </td>
                <td width="20%">
                  {/* <LiquidityHead>
                          Liquidity
                        <WhiteArrowDown /> }
                    </LiquidityHead>  */}
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={() => setSortState(3)}
                    onKeyDown={() => {
                      console.log()
                    }}
                  >
                    {sortState === 3 ? <TdElement>Liquidity</TdElement> : <span>Liquidity</span>}
                  </div>
                </td>
                <td width="15%">
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={() => setSortState(4)}
                    onKeyDown={() => {
                      console.log()
                    }}
                  >
                    {sortState === 4 ? <TdElement>Earned</TdElement> : <span>Earned</span>}
                  </div>
                </td>
                <td width="30%" />
              </tr>
            </thead>
          </table>
        </PoolHead>
        {pools.map((pool) => (
          <PoolRow
            key={pool.isAutoVault ? 'auto-cake' : pool.sousId}
            pool={pool}
            account={account}
            userDataLoaded={userDataLoaded}
          />
        ))}
        <ScrollButtonContainer>
          <CustomButton variant="text" onClick={scrollToTop}>
            {t('To Top')}
            <ChevronUpIcon color="primary" />
          </CustomButton>
        </ScrollButtonContainer>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable
