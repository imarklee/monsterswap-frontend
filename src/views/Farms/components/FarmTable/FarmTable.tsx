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
        <StyledRow>
          <StyledCell style={{ flex: '1 0 130px' }}>HOT</StyledCell>
          <StyledCell>LP</StyledCell>
          {isXl && <StyledCell style={{ flex: '1 0 80px' }}>APR</StyledCell>}
          {isXl && (
            <LiquidityHead>
              Liquidity <WhiteArrowDown />
            </LiquidityHead>
          )}
          <StyledCell style={{ textAlign: 'left' }}>Earned</StyledCell>
          <StyledCell> </StyledCell>
        </StyledRow>

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
