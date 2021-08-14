
// ray test touch <<
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import {
  PoolTokenType,
  LendingPoolData
} from 'types/interfaces';

const getLendingPoolTokenName = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB,
  chainID: number
): string => {
  const wETHAddress = W_ETH_ADDRESSES[chainID];
  const lowerCasedWETHAddress = wETHAddress.toLowerCase();
  const underlyingAddress = lendingPool[poolTokenType].underlying.id;

  if (underlyingAddress === lowerCasedWETHAddress) {
    return 'Ethereum';
  } else {
    return lendingPool[poolTokenType].underlying.name;
  }
};

// TODO: double-check with `useSymbol`
const getLendingPoolTokenSymbol = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB,
  chainID: number
): string => {
  const wETHAddress = W_ETH_ADDRESSES[chainID];
  const lowerCasedWETHAddress = wETHAddress.toLowerCase();
  const underlyingAddress = lendingPool[poolTokenType].underlying.id;

  if (underlyingAddress === lowerCasedWETHAddress) {
    return 'ETH';
  } else {
    return lendingPool[poolTokenType].underlying.symbol;
  }
};

const getLendingPoolTokenTotalSupplyInUSD = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const totalBalance = parseFloat(lendingPool[poolTokenType].totalBalance);
  const totalBorrows = parseFloat(lendingPool[poolTokenType].totalBorrows);
  const totalSupply = totalBalance + totalBorrows;
  const utilizationRate = totalSupply === 0 ? 0 : totalBorrows / totalSupply; // TODO: could be a function

  const borrowRate = parseFloat(lendingPool[poolTokenType].borrowRate);
  const reserveFactor = parseFloat(lendingPool[poolTokenType].reserveFactor);
  const supplyRate = borrowRate * utilizationRate * (1 - reserveFactor); // TODO: could be a function

  const accrualTimestamp = parseFloat(lendingPool[poolTokenType].accrualTimestamp);
  const currentTotalSupply = totalSupply * (1 + (Date.now() / 1000 - accrualTimestamp) * supplyRate);
  const tokenPriceInUSD = parseFloat(lendingPool[poolTokenType].underlying.derivedUSD);
  const totalSupplyInUSD = currentTotalSupply * tokenPriceInUSD;

  return totalSupplyInUSD;
};

const getLendingPoolTokenTotalBorrowInUSD = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const totalBorrows = parseFloat(lendingPool[poolTokenType].totalBorrows);
  const accrualTimestamp = parseFloat(lendingPool[poolTokenType].accrualTimestamp);
  const borrowRate = parseFloat(lendingPool[poolTokenType].borrowRate);
  const currentTotalBorrow = totalBorrows * (1 + (Date.now() / 1000 - accrualTimestamp) * borrowRate);
  const tokenPriceInUSD = parseFloat(lendingPool[poolTokenType].underlying.derivedUSD);
  // TODO: it's also from lendingPool[poolTokenType].totalBorrowsUSD. What is different?
  const totalBorrowInUSD = currentTotalBorrow * tokenPriceInUSD;

  return totalBorrowInUSD;
};

export {
  getLendingPoolTokenName,
  getLendingPoolTokenSymbol,
  getLendingPoolTokenTotalSupplyInUSD,
  getLendingPoolTokenTotalBorrowInUSD
};
// ray test touch >>
