// Stocks
import Base from "@stocks/base";
import XueqiuStockTransform from "@stocks/xueqiu/transforms/stock";
import XueqiuExchangeTransform from "@stocks/xueqiu/transforms/exchange";

// Utils
import fetch from "@utils/fetch";

// Types
import Stock from "types/utils/stock";
import Dictionary from "types/utils/dictionary";

/**
 * 雪球股票代码接口
 */
class Xueqiu extends Base {
  public token: string = '';
  /**
   * 构造函数
   */
  constructor() {
    super();
  }

  /**
   * 获取 Token
   */
  async getToken() {
    if (this.token !== '') return this.token;

    const res = await fetch.get('https://xueqiu.com/');
    const cookies: string[] = res.headers['set-cookie'];

    const param: string = cookies.filter(key => key.includes('xq_a_token'))[0] || '';
    this.token = param.split(';')[0] || '';

    return this.token;
  }

  /**
   * 获取股票数据
   * @param code 需要获取的股票代码
   */
  async getStock(code: string): Promise<Stock> {
    const token = await this.getToken();
    const transform = (new XueqiuExchangeTransform).transform(code);

    // 数据获取
    const url = `https://stock.xueqiu.com/v5/stock/quote.json?symbol=${transform}`;
    const res = await fetch.get(url).set('Cookie', token);

    const body = JSON.parse(res.text);
    const row: Dictionary<number | string> = body.data.quote;

    // 数据深解析
    const params = row;
    const data = (new XueqiuStockTransform(code, params));

    return data.getStock();
  }

  /**
   * 获取股票组数据
   * @param codes 需要获取的股票组代码
   */
  async getStocks(codes: string[]): Promise<Stock[]> {
    const token = await this.getToken();
    const transforms = (new XueqiuExchangeTransform).transforms(codes);

    // 数据获取
    const url = `https://stock.xueqiu.com/v5/stock/batch/quote.json?symbol=${transforms.join(',')}`;
    const res = await fetch.get(url).set('Cookie', token);

    const body = JSON.parse(res.text);
    const rows: Dictionary<Dictionary<number | string>>[] = body.data.items;

    return codes.map(code => {
      // 数据深解析
      const transform = (new XueqiuExchangeTransform).transform(code);
      const params = rows.find(i => i.quote.symbol === transform) || {};

      const data = (new XueqiuStockTransform(code, params.quote));
      return data.getStock();
    });
  }
}

export default Xueqiu;
