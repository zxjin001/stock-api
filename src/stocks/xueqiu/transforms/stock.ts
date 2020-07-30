// Stocks
import BaseStockTransform from "@stocks/base/transforms/stock";

// Types
import Stock from "types/stock";
import Dictionary from "types/dictionary";

/**
 * 雪球股票数据解析
 */
class XueqiuStockTransform extends BaseStockTransform {
  /**
   * 构造函数
   */
  constructor(public code: string, public params: Dictionary<number | string>) {
    super();
  }

  /**
   * 获取代码
   */
  getCode(): string {
    return String(this.code);
  }

  /**
   * 获取名称
   */
  getName(): string {
    return String(this.params.name || this.code);
  }

  /**
   * 获取现价
   */
  getNow(): number {
    return Number(this.params.current);
  }

  /**
   * 获取最低价
   */
  getLow(): number {
    return Number(this.params.low);
  }

  /**
   * 获取最高价
   */
  getHigh(): number {
    return Number(this.params.high);
  }

  /**
   * 获取昨日收盘价
   */
  getYesterday(): number {
    return Number(this.params.last_close);
  }

  /**
   * 获取涨跌
   */
  getPercent(): number {
    return this.getNow() ? this.getNow() / this.getYesterday() - 1 : 0;
  }

  /**
   * 获取股票数据
   */
  getStock(): Stock {
    return {
      code: this.getCode(),
      name: this.getName(),
      percent: this.getPercent(),

      now: this.getNow(),
      low: this.getLow(),
      high: this.getHigh(),
      yesterday: this.getYesterday(),
    };
  }
}

export default XueqiuStockTransform;