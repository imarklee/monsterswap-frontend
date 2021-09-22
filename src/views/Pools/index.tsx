import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { ButtonMenuItem, ButtonMenu, Flex, Image, Text, Checkbox, NotificationDot, useMatchBreakpoints } from 'uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { useFetchPublicPoolsData, usePools, useFetchCakeVault, useCakeVault } from 'state/pools/hooks'
import { usePollFarmsData } from 'state/farms/hooks'
import { latinise } from 'utils/latinise'
// import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import SearchInput from 'components/SearchInput'
// import Select, { OptionProps } from 'components/Select/Select'
import { Pool } from 'state/types'
import Loading from 'components/Loading'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolsTable from './components/PoolsTable/PoolsTable'
import ToggleView, { ViewMode } from './components/ToggleView/ToggleView'
import { getAprData, getCakeVaultEarnings } from './helpers'

const CardLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  & > div {
    width: 100%;
    margin: 16px 0 0;
    ${({ theme }) => theme.mediaQueries.md} {
      width: calc(50% - 16px);
    }
  }
`

const PoolControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.04);
  border-radius: 60px;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  @media (max-width: 767.98px) {
    padding: 10px 10px;
    ${({ theme }) => theme.mediaQueries.xs} {
      font-size: 10px;
      padding: 20px 30px;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 14px;
      padding: 20px 30px;
    }
    border-radius: 30px;
    margin-top: -80px;

    & > div {
      flex-wrap: nowrap;
    }
    & > div:nth-child(1) > div {
      margin-left: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 8px 24px;
    height: 58px;
  }
`

// const FilterContainer = styled.div`
//   display: flex;
//   align-items: center;
//   width: 100%;
//   padding: 8px 0px;

//   ${({ theme }) => theme.mediaQueries.sm} {
//     width: auto;
//     padding: 0;
//   }
// `

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
  margin-left: 16px;

  @media (max-width: 767.98px) {
    margin-left: 0;
  }
`

// const ControlStretch = styled(Flex)`
//   > div {
//     flex: 1;
//   }
// `

const PoolsBanner = styled.div`
  width: 100%;
  min-height: 211px;
  > div {
    width: 100%;
    max-width: 100%;
    height: 300px;
    @media (max-width: 2560px) {
      height: 400px;
    }
    @media (max-width: 1920px) {
      height: 350px;
    }
    @media (max-width: 1330px) {
      height: 200px;
    }
    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &::after {
      padding-top: 0;
    }
  }

  @media (max-width: 767.98px) {
    min-height: 200px;
    > div {
      height: 200px;

      > img {
      }
    }
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  @media (max-width: 767.98px) {
    &:nth-child(1) {
      margin-bottom: 20px;
    }
    > div {
      padding: 0;
    }
    > div > a,
    > div > span > a,
    > div > div {
      font-size: 12px;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const PoolHead = styled.div`
  background: white;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05);
  border-radius: 70px;
  padding: 8px 12px;
  margin-top: 32px;
  & table {
    width: 100%;
    & td {
      padding: 0;
      text-align: center;
      line-height: 16px;
      letter-spacing: 0.04em;
      color: #464486;
      font-size: 10px;
      ${({ theme }) => theme.mediaQueries.md} {
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
const CustomText = styled(Text)`
  font-size: 10px;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 10px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 14px;
    padding: 12px 30px;
  }
`
const TdElement = styled.div`
  background: #49468a;
  border-radius: 70px;
  color: white;
  padding: 5px 0px;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 10px 10px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 10px 10px;
  }
`
const CustomFailureText = styled(Text)`
  font-size: 10px;
  padding-bottom: 10px;
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 14px;
    padding-bottom: 15px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
    padding-bottom: 32px;
  }
`

const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const { url, isExact } = useRouteMatch()
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isXl } = useMatchBreakpoints()
  const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'pancake_pool_staked' })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.CARD, { localStorageKey: 'pancake_pool_view' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const chosenPoolsLength = useRef(0)
  const [sortState, setSortState] = useState(0)

  const {
    userData: { cakeAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalCakeInVault,
  } = useCakeVault()
  const accountHasVaultShares = userShares && userShares.gt(0)
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  const pools = useMemo(() => {
    // const cakePool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0)

    // TAKE OUT AUTO-POOL
    // const cakeAutoVault = { ...cakePool, isAutoVault: true }
    // return [cakeAutoVault, ...poolsWithoutAutoVault]
    return [...poolsWithoutAutoVault]
  }, [poolsWithoutAutoVault])

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools, accountHasVaultShares],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools, accountHasVaultShares],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsData()
  useFetchCakeVault()
  useFetchPublicPoolsData()

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
          if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
            return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
          }
          return poolsCurrentlyVisible
        })
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const showFinishedPools = location.pathname.includes('history')

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  // const handleSortOptionChange = (option: OptionProps): void => {
  //   setSortOption(option.value)
  // }

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0),
          'desc',
        )
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0
            }
            return pool.isAutoVault
              ? getCakeVaultEarnings(
                  account,
                  cakeAtLastUserAction,
                  userShares,
                  pricePerFullShare,
                  pool.earningTokenPrice,
                ).autoUsdToDisplay
              : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.isAutoVault ? totalCakeInVault.toNumber() : pool.totalStaked.toNumber()),
          'desc',
        )
      default:
        return poolsToSort
    }
  }

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
  }

  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    chosenPools = chosenPools.filter((pool) =>
      latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
    )
  }

  chosenPools = sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  chosenPoolsLength.current = chosenPools.length

  const cardLayout = (
    <CardLayout>
      {chosenPools.map((pool) =>
        pool.isAutoVault ? (
          <CakeVaultCard key="auto-cake" pool={pool} showStakedOnly={stakedOnly} />
        ) : (
          <PoolCard key={pool.sousId} pool={pool} account={account} />
        ),
      )}
    </CardLayout>
  )

  const tableLayout = <PoolsTable pools={chosenPools} account={account} userDataLoaded={userDataLoaded} />

  return (
    <>
      <PoolsBanner>
        <Image src="/images/pools/bg-hero-pools.svg" alt="Monster Pools" width={100} height={300} />
      </PoolsBanner>
      <Page>
        <PoolControls>
          <ViewControls>
            <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
            <LabelWrapper>
              <SearchInput onChange={handleChangeSearchQuery} placeholder="Search" />
            </LabelWrapper>
          </ViewControls>
          <ViewControls>
            <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="subtle">
              <ButtonMenuItem as={Link} to={`${url}`}>
                {t('Active')}
              </ButtonMenuItem>
              <NotificationDot show={hasStakeInFinishedPools}>
                <ButtonMenuItem as={Link} to={`${url}/history`}>
                  {t('InActive')}
                </ButtonMenuItem>
              </NotificationDot>
            </ButtonMenu>
            <ToggleWrapper>
              <Checkbox checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
              <CustomText> {t('Staked only')}</CustomText>
            </ToggleWrapper>
          </ViewControls>
        </PoolControls>
        {showFinishedPools && (
          <CustomFailureText color="failure">
            {t('These pools are no longer distributing rewards. Please unstake your tokens.')}
          </CustomFailureText>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
            <Loading />
          </Flex>
        )}
        {viewMode === ViewMode.CARD && (
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
                  <td width="20%">LP</td>
                  <td width="20%">
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
                  <td width="20%">
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
                  <td width="10%" />
                </tr>
              </thead>
            </table>
          </PoolHead>
        )}
        {viewMode === ViewMode.CARD ? cardLayout : tableLayout}
        <div ref={loadMoreRef} />
        <Image
          mx="auto"
          mt="12px"
          src="/images/decorations/monster-pools.png"
          alt="Monster Pools"
          width={280}
          height={88}
        />
      </Page>
    </>
  )
}

export default Pools
