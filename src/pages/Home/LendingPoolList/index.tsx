
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useMedia } from 'react-use';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';

import LendingPoolListItem from './LendingPoolListItem';
import LendingPoolListHeader from './LendingPoolListHeader';
import ErrorFallback from 'components/ErrorFallback';
import LineLoadingSpinner from 'components/LineLoadingSpinner';
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
import { UNISWAP_V2_FACTORY_ADDRESSES } from 'config/web3/contracts/uniswap-v2-factories';
import getPairAddress from 'utils/helpers/web3/get-pair-address';
import { BREAKPOINTS } from 'utils/constants/styles';
import lendingPoolsFetcher, {
  LendingPoolData,
  LENDING_POOLS_FETCHER
} from 'services/fetchers/lending-pools-fetcher';
import uniswapAPYsFetcher, { UNISWAP_APYS_FETCHER } from 'services/fetchers/uniswap-apys-fetcher';

const LendingPoolList = (): JSX.Element => {
  const { chainId } = useWeb3React<Web3Provider>();

  const greaterThanMd = useMedia(`(min-width: ${BREAKPOINTS.md})`);

  const {
    isLoading: initialLendingPoolsLoading,
    data: initialLendingPools,
    error: initialLendingPoolsError
  } = useQuery<Array<LendingPoolData>, Error>(
    [
      LENDING_POOLS_FETCHER,
      chainId
    ],
    lendingPoolsFetcher,
    {
      enabled: chainId !== undefined
    }
  );
  useErrorHandler(initialLendingPoolsError);

  const uniswapV2PairAddresses = initialLendingPools?.map(
    (initialLendingPool: { id: string; }) => initialLendingPool.id
  );

  const {
    isLoading: uniswapAPYsLoading,
    data: uniswapAPYs,
    error: uniswapAPYsError
  } = useQuery<{
    [key in string]: number;
  }, Error>(
    [
      UNISWAP_APYS_FETCHER,
      uniswapV2PairAddresses
    ],
    uniswapAPYsFetcher,
    {
      enabled: uniswapV2PairAddresses !== undefined
    }
  );
  useErrorHandler(uniswapAPYsError);

  // TODO: should use skeleton loaders
  if (initialLendingPoolsLoading) {
    return <LineLoadingSpinner />;
  }
  if (uniswapAPYsLoading) {
    return <LineLoadingSpinner />;
  }
  if (initialLendingPools === undefined) {
    throw new Error('Something went wrong!');
  }
  if (uniswapAPYs === undefined) {
    throw new Error('Something went wrong!');
  }

  const lendingPools = initialLendingPools.map(initialLendingPool => ({
    ...initialLendingPool,
    pair: {
      ...initialLendingPool.pair,
      uniswapAPY: uniswapAPYs[initialLendingPool.id]
    }
  }));

  if (!chainId) {
    throw new Error('Invalid chain ID!');
  }

  const imxAddress = IMX_ADDRESSES[chainId];
  const wethAddress = W_ETH_ADDRESSES[chainId];
  const uniswapV2FactoryAddress = UNISWAP_V2_FACTORY_ADDRESSES[chainId];
  const imxPair = getPairAddress(wethAddress, imxAddress, uniswapV2FactoryAddress).toLowerCase();
  const imxLendingPool = lendingPools.find(lendingPool => lendingPool.id === imxPair);

  if (!imxLendingPool) {
    throw new Error('Something went wrong!');
  }

  return (
    <div className='space-y-3'>
      {greaterThanMd && (
        <LendingPoolListHeader className='px-4' />
      )}
      {lendingPools.map(lendingPool => {
        return (
          <LendingPoolListItem
            key={lendingPool.id}
            chainID={chainId}
            imxLendingPool={imxLendingPool}
            lendingPool={lendingPool}
            greaterThanMd={greaterThanMd} />
        );
      })}
    </div>
  );
};

export default withErrorBoundary(LendingPoolList, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
