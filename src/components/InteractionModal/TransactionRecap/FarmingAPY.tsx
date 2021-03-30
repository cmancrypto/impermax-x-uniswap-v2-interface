import React from "react";
import { Row, Col } from "react-bootstrap";
import { PoolTokenType } from "../../../impermax-router/interfaces";
import usePoolToken from "../../../hooks/usePoolToken";
import { formatPercentage } from "../../../utils/format";
import { useNextFarmingAPY } from "../../../hooks/useData";


export default function FarmingAPY({ amount }: { amount: number }) {
  const poolTokenType = usePoolToken();
  if (poolTokenType == PoolTokenType.Collateral) return null;

  const farmingAPY = useNextFarmingAPY(amount);

  return (
    <Row>
      <Col xs={6}>Farming APY:</Col>
      <Col xs={6} className="text-right">{formatPercentage(farmingAPY)}</Col>
    </Row>
  );
}