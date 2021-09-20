import React, { useRef } from 'react'
import styled from 'styled-components'
import { useTable, Button, ChevronUpIcon, ColumnType, useMatchBreakpoints } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { ReactComponent as WhiteArrowDown } from 'assets/images/WhiteArrowDown.svg'

import Row, { RowProps } from './Row'

export interface ITableProps {
  data: RowProps[]
  columns: ColumnType<RowProps>[]
  userDataReady: boolean
  sortColumn?: string
}

const Container = styled.div`
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const StyledTable = styled.div`
  background-color: transparent;
`
const StyledRow = styled.div`
  background-color: transparent;
  margin-top: 20px;
  display: flex;
  align-items: center;
  height: 60px;
  border-radius: 60px;
  background: white;
  filter: ${({ theme }) => theme.card.dropShadow};
  @media (max-width: 767.98px) {
    padding-left: 20px;
  }
`
const StyledCell = styled.div`
  flex: 5;
  flex-direction: row;
  padding: 0 4px;
  color: #464486;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding: 0 20px;
  }
`
const TableHead = styled.thead`
  filter: ${({ theme }) => theme.card.dropShadow};
  border-radius: 10px;
  margin-bottom: 16px;
  & tr {
    td {
      font-size: 14px;
      color: #464486;
      padding: 12px 0;
      text-align: center;
      background: ${({ theme }) => theme.card.background};
      &:first-child {
        border-top-left-radius: 70px;
        border-bottom-left-radius: 70px;
      }
      &:last-child {
        border-top-right-radius: 70px;
        border-bottom-right-radius: 70px;
      }
      ${({ theme }) => theme.mediaQueries.md} {
        padding-right: 32px;
      }
    }
  }
`

const TableBody = styled.tbody`
  border-radius: 10px;
  & tr {
    border: none;
    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const LiquidityHead = styled.div`
  background: #49468a;
  border-radius: 70px;
  padding: 12px 10px;
  color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
`
const FarmHead = styled.div`
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
    background: #49468A;
    border-radius: 70px;
    color: white;
    padding: 12px 10px;
  `
const FarmTable: React.FC<ITableProps> = (props) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { isXl } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { data, columns, userDataReady } = props

  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <Container>
      <StyledTable role="table" ref={tableWrapperEl}>
         <FarmHead>
            <table>
              <thead>
                <tr>
                  <td width="5%"><TdElement>HOT</TdElement></td>
                    <td width="7%">LP</td>
                    <td width="12%">APR</td>
                    {isXl?
                      <td width="17%">
                        <LiquidityHead>
                          Liquidity
                          <WhiteArrowDown />
                        </LiquidityHead>
                      </td>
                      :
                      <td width="17%">Liquidity</td>
                    }
                    <td width="15%" style={{ textAlign: 'left' }}>Earned</td>
                    <td  width="15%"/>
                </tr>
              </thead>
            </table>
          </FarmHead>
        <TableBody>
          {rows.map((row) => {
            return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
          })}
        </TableBody>
      </StyledTable>
      <ScrollButtonContainer>
        <Button variant="text" onClick={scrollToTop}>
          {t('To Top')}
          <ChevronUpIcon color="primary" />
        </Button>
      </ScrollButtonContainer>
    </Container>
  )
}

export default FarmTable
