const _ = require('lodash');

const ignoreFields = ['side', 'timestamp', 'maint_margin_ratio'];
const keyMap = {
  long: {
    position: 'long_qty',
    avail_position: 'long_avail_qty',
    avg_cost: 'long_avg_cost',
    margin: 'long_margin',
    settled_pnl: 'long_settled_pnl',
    realized_pnl: 'long_pnl',
    unrealized_pnl: 'long_unrealised_pnl',
    settlement_price: 'long_settlement_price'
  },
  short: {
    position: 'short_qty',
    avail_position: 'short_avail_qty',
    avg_cost: 'short_avg_cost',
    margin: 'short_margin',
    settled_pnl: 'short_settled_pnl',
    realized_pnl: 'short_pnl',
    unrealized_pnl: 'short_unrealised_pnl',
    settlement_price: 'short_settlement_price'
  }
};

function etlSwapPosition(p) {
  const { instrument_id, margin_mode, holding } = p;
  const etlResult = holding
    .map((v, idx) => _.chain(v)
      .toPairs()
      .filter(p => ignoreFields.indexOf(p[0]) < 0)
      .map(p => (p[0] = keyMap[holding[idx].side][p[0]] || p[0]) && p)
      .fromPairs()
      .value()
    )
    .reduce((a, b) => ({ ...a, ...b, margin_mode }));

  etlResult.instrument_id = etlResult.instrument_id || instrument_id;
  etlResult.realised_pnl = (etlResult.long_pnl * 1 || 0) + (etlResult.short_pnl * 1 || 0) + '';
  return etlResult;
}

module.exports = { etlSwapPosition };