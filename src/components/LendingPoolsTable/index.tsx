import React, { useContext, useState, useEffect } from 'react';
import {
  Link
} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { LanguageContext } from '../../contexts/Language';
import phrases from './translations';
import './index.scss';
import { LISTED_PAIRS } from '../../utils/constants';
import { Networks } from '../../utils/connections';
import { useLendingPool } from '../../hooks/useContract';
import { BorrowableData, getBorrowablesData } from '../../utils/borrowableData';
import { getIconByTokenAddress } from '../../utils/icons';
import { formatPercentage, formatUSD } from '../../utils/format';

interface LendingPoolsRowProps {
  uniswapV2PairAddress: string;
}

/**
 * Component for a single Lending Pool row.
 */
export function LendingPoolsRow(props: LendingPoolsRowProps) {

  const { uniswapV2PairAddress } = props;

  const [borrowableAData, setBorrowableAData] = useState<BorrowableData>();
  const [borrowableBData, setBorrowableBData] = useState<BorrowableData>();
  const lendingPool = useLendingPool(uniswapV2PairAddress);

  useEffect(() => {
    getBorrowablesData(lendingPool).then(({borrowableAData, borrowableBData}) => {
      setBorrowableAData(borrowableAData);
      setBorrowableBData(borrowableBData);
    });
  }, [lendingPool]);

  if (!borrowableAData || !borrowableBData) return null;

  return (<tr className="lending-pools-row">
    <td>
      <div className="currency-name">
        <div className="combined">
          <div className="currency-overlapped">
            <img src={getIconByTokenAddress(borrowableAData.tokenAddress)} />
            <img src={getIconByTokenAddress(borrowableBData.tokenAddress)} />
          </div>
          <Link to={"lending-pool/" + uniswapV2PairAddress}>{borrowableAData.symbol}/{borrowableBData.symbol}</Link>
        </div>
        <div>
          <div>
            <img className="currency-icon" src={getIconByTokenAddress(borrowableAData.tokenAddress)} />
            {borrowableAData.symbol}
          </div>
          <div>
            <img className="currency-icon" src={getIconByTokenAddress(borrowableBData.tokenAddress)} />
            {borrowableBData.symbol}
          </div>
        </div>
      </div>
    </td>
    <td className="text-center">
      <div>
        {formatUSD(borrowableAData.supplyUSD)}
      </div>
      <div>
        {formatUSD(borrowableBData.supplyUSD)}
      </div>
    </td>
    <td className="text-center">
      <div>
        {formatUSD(borrowableAData.borrowedUSD)}
      </div>
      <div>
        {formatUSD(borrowableBData.borrowedUSD)}
      </div>
    </td>
    <td className="text-center">
      <div>
        {formatPercentage(borrowableAData.supplyAPY)}
      </div>
      <div>
        {formatPercentage(borrowableBData.supplyAPY)}
      </div>
    </td>
    <td className="text-center">
      <div>
        {formatPercentage(borrowableAData.borrowAPY)}
      </div>
      <div>
        {formatPercentage(borrowableBData.borrowAPY)}
      </div>
    </td>
    {/*<td className="text-center">
      <div>
        {formatPercentage(borrowableAData.farmingAPY)}
      </div>
      <div>
        {formatPercentage(borrowableBData.farmingAPY)}
      </div>
    </td>*/}
  </tr>);
}

/**
 * Generate a searchable lending pools table.
 */
export function LendingPoolsTable() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;

  const t = (s: string) => (phrases[s][language]);
  return (<div className="lending-pools-table">
    <Table>
      <thead>
        <tr>
          <th>{t("Market")}</th>
          <th className="text-center">{t("Total Supply")}</th>
          <th className="text-center">{t("Total Borrowed")}</th>
          <th className="text-center">{t("Supply APY")}</th>
          <th className="text-center">{t("Borrow APY")}</th>
          {/*<th className="text-center">{t("Farming APY")}</th>*/}
        </tr>
      </thead>
      <tbody>
        {LISTED_PAIRS[(process.env.NETWORK as Networks)].map((pair: string, key: any) =>    
          <LendingPoolsRow uniswapV2PairAddress={pair} key={key} />
        )}
      </tbody>
    </Table>
  </div>)
}