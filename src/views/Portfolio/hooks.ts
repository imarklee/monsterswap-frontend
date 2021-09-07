import { useMemo } from 'react'
import useActiveWeb3React from "hooks/useActiveWeb3React"
import { usePools } from "state/pools/hooks"
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'


export const useTotalStakedBalance = () => {
    const { account } = useActiveWeb3React()
    const { pools: poolData, userDataLoaded} = usePools(account)
    const getTvl = useMemo(() => {
        if( userDataLoaded ) {
            const sumPool = poolData.reduce((sum, item) => {
                return {
                    ...sum,
                    userData: { ...sum.userData, stakingTokenBalance: sum.userData.stakingTokenBalance.plus(item.userData.stakingTokenBalance) }
                }
            })
            return sumPool.userData.stakingTokenBalance
        }
        return BIG_ZERO
    }, [poolData, userDataLoaded])
    return getBalanceNumber(getTvl)
}