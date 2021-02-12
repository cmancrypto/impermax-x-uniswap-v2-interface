import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useRouterCallback, useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { PermitData } from './useApprove';
import { useToNumber, useSymbol } from './useData';
import { formatFloat } from '../utils/format';


export default function useBorrow(approvalState: ButtonState, amount: BigNumber, permitData: PermitData): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const val = useToNumber(amount);
  const symbol = useSymbol();
  const summary = `Borrow ${formatFloat(val)} ${symbol}`;
  
  const borrowState: ButtonState = useMemo(() => {
    if (approvalState != ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalState, pending, amount]);

  const borrow = useCallback(async (): Promise<void> => {
    if (borrowState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.borrow(uniswapV2PairAddress, poolTokenType, amount, permitData, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    }
    finally {
      setPending(false);
    }
  }, [approvalState, uniswapV2PairAddress, poolTokenType, addTransaction, amount, permitData]);

  return [borrowState, borrow];
}