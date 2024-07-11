import { 母到清濁, 母到組, 母到音, 韻到攝 } from './拓展音韻屬性';
import { 呼韻搭配, 所有, 等韻搭配, 鈍音母 } from './音韻屬性常量';

const 所有音 = [...'脣舌齒牙喉'] as const;
const 所有攝 = [...'通江止遇蟹臻山效果假宕梗曾流深咸'] as const;
const 所有組 = [...'幫端知精莊章見影'] as const;

const 檢查 = { 母: 所有.母, 等: 所有.等, 類: 所有.類, 韻: 所有.韻, 音: 所有音, 攝: 所有攝, 組: 所有組, 聲: 所有.聲 };

const 輕脣韻 = [...'東鍾微虞廢文元陽尤凡'] as const;
const 次入韻 = [...'祭泰夬廢'] as const;
const 陰聲韻 = [...'支脂之微魚虞模齊祭泰佳皆夬灰咍廢蕭宵肴豪歌麻侯尤幽'] as const;

const 鈍音組 = [...'幫見影'] as const;

const pattern = new RegExp(`^([${所有.母}])([${所有.呼}]?)([${所有.等}]?)([${所有.類}]?)([${所有.韻}])([${所有.聲}])$`, 'u');

// TODO support lazy error message
function assert(value: unknown, error: string): asserts value {
  if (!value) throw new Error(error);
}

type Falsy = '' | 0 | false | null | undefined;
export type 規則<T = unknown> = [unknown, T | 規則<T>][];

export type 音韻屬性 = Partial<Pick<音韻地位, '母' | '呼' | '等' | '類' | '韻' | '聲'>>;

/**
 * 《切韻》音系音韻地位。
 *
 * 可使用字串 (母, 呼, 等, 類, 韻, 聲) 初始化。
 *
 * | 音韻屬性 | 中文名稱 | 英文名稱 | 可能取值 |
 * | :- | :- | :- | :- |
 * | 母<br/>組 | 聲母<br/>組 | initial<br/>group | **幫**滂並明<br/>**端**透定泥<br/>來<br/>**知**徹澄孃<br/>**精**清從心邪<br/>**莊**初崇生俟<br/>**章**昌常書船<br/>日<br/>**見**溪羣疑<br/>**影**曉匣云<br/>以<br/>（粗體字為組，未涵蓋「來日以」） |
 * | 呼 | 呼 | rounding | 開口<br/>合口 |
 * | 等 | 等 | division | 一二三四 |
 * | 類 | 類 | TODO: en | ABC |
 * | 韻<br/>攝 | 韻母<br/>攝 | rhyme<br/>class | 通：東冬鍾<br/>江：江<br/>止：支脂之微<br/>遇：魚虞模<br/>蟹：齊祭泰佳皆夬灰咍廢<br/>臻：眞臻文欣元魂痕<br/>山：寒刪山先仙<br/>效：蕭宵肴豪<br/>果：歌<br/>假：麻<br/>宕：陽唐<br/>梗：庚耕清青<br/>曾：蒸登<br/>流：尤侯幽<br/>深：侵<br/>咸：覃談鹽添咸銜嚴凡<br/>（冒號前為攝，後為對應的韻） |
 * | 聲 | 聲調 | tone | 平上去入<br/>仄<br/>舒 |
 *
 * 音韻地位六要素：母、呼、等、類、韻、聲。
 *
 * 「呼」和「類」可為 `null`，其餘四個屬性不可為 `null`。
 *
 * 當聲母為脣音，或韻母為「東冬鍾江模尤侯」（開合中立的韻）之一時，「呼」須為 `null`。
 * 在其他情況下，「呼」須取 `開` 或 `合`。
 *
 * 當聲母為脣牙喉音（不含以母），且為三等韻時，「類」須取 `A`、`B`、`C` 之一。
 * 在其他情況下，「類」須為 `null`。
 *
 * **注意**：元韻置於臻攝而非山攝。
 *
 * 依切韻韻目，用殷韻不用欣韻；亦不設諄、桓、戈韻，分別併入真、寒、歌韻。
 *
 * 不支援異體字，請自行轉換：
 *
 * * 音 唇 → 脣
 * * 母 娘 → 孃
 * * 母 荘 → 莊
 * * 母 谿 → 溪
 * * 母 群 → 羣
 * * 韻 餚 → 肴
 * * 韻 眞 → 真
 */
export class 音韻地位 {
  /**
   * 聲母
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.母;
   * '幫'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.母;
   * '羣'
   * ```
   */
  readonly 母: string;

  /**
   * 呼
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.呼;
   * null
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.呼;
   * '開'
   * ```
   */
  readonly 呼: string | null;

  /**
   * 等
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.等;
   * '三'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.等;
   * '三'
   * ```
   */
  readonly 等: string;

  /**
   * 類
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.類;
   * 'C'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.類;
   * 'A'
   * > 音韻地位 = Qieyun.音韻地位.from描述('章開三支平');
   * > 音韻地位.類;
   * null
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫四先平');
   * > 音韻地位.類;
   * null
   * ```
   */
  readonly 類: string | null;

  /**
   * 韻（舉平以賅上去入，唯泰、祭、夬、廢例外）
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.韻;
   * '凡'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.韻;
   * '支'
   * ```
   */
  readonly 韻: string;

  /**
   * 聲調
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.聲;
   * '入'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.聲;
   * '平'
   * ```
   */
  readonly 聲: string;

  /**
   * 初始化音韻地位物件。
   * @param 母 聲母：幫, 滂, 並, 明, …
   * @param 呼 呼：`null`, 開, 合
   * @param 等 等：一, 二, 三, 四
   * @param 類 類：`null`, A, B, C
   * @param 韻 韻母（平賅上去入）：東, 冬, 鍾, 江, …, 祭, 泰, 夬, 廢
   * @param 聲 聲調：平, 上, 去, 入
   * @returns 字串所描述的音韻地位。
   * @example
   * ```typescript
   * > new Qieyun.音韻地位('幫', null, '三', 'C', '凡', '入');
   * 音韻地位 { '幫三C凡入' }
   * > new Qieyun.音韻地位('羣', '開', '三', 'A', '支', '平');
   * 音韻地位 { '羣開三A支平' }
   * > new Qieyun.音韻地位('章', '開', '三', null, '支', '平');
   * 音韻地位 { '章開三支平' }
   * > new Qieyun.音韻地位('幫', null, '四', null, '先', '平');
   * 音韻地位 { '幫四先平' }
   * ```
   */
  constructor(母: string, 呼: string | null, 等: string, 類: string | null, 韻: string, 聲: string) {
    音韻地位.驗證(母, 呼, 等, 類, 韻, 聲);
    this.母 = 母;
    this.呼 = 呼;
    this.等 = 等;
    this.類 = 類;
    this.韻 = 韻;
    this.聲 = 聲;
  }

  /**
   * 清濁（全清、次清、全濁、次濁）
   *
   * 曉母為全清，云以來日母為次濁。
   *
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.清濁;
   * '全清'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.清濁;
   * '全濁'
   * ```
   */
  get 清濁(): string {
    const { 母 } = this;
    return 母到清濁[母];
  }

  /**
   * 音（發音部位：脣、舌、齒、牙、喉）
   *
   * **注意**：
   *
   * * 不設半舌半齒音，來母歸舌音，日母歸齒音
   * * 以母不屬於影組，但屬於喉音
   *
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.音;
   * '脣'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.音;
   * '牙'
   * ```
   */
  get 音(): string {
    const { 母 } = this;
    return 母到音[母];
  }

  /**
   * 攝
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.攝;
   * '咸'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.攝;
   * '止'
   * ```
   */
  get 攝(): string {
    const { 韻 } = this;
    return 韻到攝[韻];
  }

  /**
   * 韻別（陰聲韻、陽聲韻、入聲韻）
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.韻別;
   * '入'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.韻別;
   * '陰'
   * ```
   */
  get 韻別(): string {
    const { 韻, 聲 } = this;
    return 陰聲韻.includes(韻) ? '陰' : 聲 === '入' ? '入' : '陽';
  }

  /**
   * 組
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.組;
   * '幫'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.組;
   * '見'
   * ```
   */
  get 組(): string | null {
    const { 母 } = this;
    return 母到組[母];
  }

  /**
   * 描述
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.描述;
   * '幫三凡入'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.描述;
   * '羣開三A支平'
   * > 音韻地位 = Qieyun.音韻地位.from描述('章開三支平');
   * > 音韻地位.描述;
   * '章開三支平'
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫四先平');
   * > 音韻地位.描述;
   * '幫四先平'
   * ```
   */
  get 描述(): string {
    const { 母, 呼, 等, 類, 韻, 聲 } = this;
    return 母 + (呼 || '') + 等 + (類 || '') + 韻 + 聲;
  }

  /**
   * 最簡描述
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.最簡描述;
   * '幫凡入'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.最簡描述;
   * '羣開A支平'
   * ```
   */
  get 最簡描述(): string {
    const { 母, 韻, 聲 } = this;
    let { 呼, 等, 類 } = this;
    if (呼 != null && 呼韻搭配[呼 as '開' | '合'].includes(韻)) {
      呼 = null;
    }
    if (![...等韻搭配.一三, ...等韻搭配.二三].includes(韻)) {
      等 = null;
    }
    if (類) {
      // TODO 待定
      if (
        類 === 'C' ||
        (韻 === '幽' && 類 === ([...'幫滂並明'].includes(母) ? 'B' : 'A')) ||
        (韻 === '蒸' && 類 === (呼 === '合' || [...'幫滂並明'].includes(母) ? 'B' : 'C')) ||
        ['庚B', '清A'].includes(`${韻}${類}`)
      ) {
        類 = null;
      }
    }
    return 母 + (呼 || '') + (等 || '') + (類 || '') + 韻 + 聲;
  }

  /**
   * 表達式，可用於 [[`屬於`]] 函數
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.表達式;
   * '幫母 開合中立 三等 C類 凡韻 入聲'
   * > 音韻地位 = Qieyun.音韻地位.from描述('羣開三A支平');
   * > 音韻地位.表達式;
   * '羣母 開口 三等 A類 支韻 平聲'
   * ```
   */
  get 表達式(): string {
    const { 母, 呼, 等, 類, 韻, 聲 } = this;
    const 呼字段 = 呼 ? `${呼}口 ` : '開合中立 ';
    const 類字段 = 類 ? `${類}類 ` : '不分類 ';
    return `${母}母 ${呼字段}${等}等 ${類字段}${韻}韻 ${聲}聲`;
  }

  /**
   * 調整該音韻地位的屬性，會驗證調整後地位的合法性，返回新的對象。
   *
   * **注意**：原對象不會被修改。
   *
   * @param 調整屬性 對象，其屬性可為六項基本屬性中的若干項，各屬性的值為欲修改成的值。
   *
   * 不含某屬性或某屬性值為 `undefined` 則表示不修改該屬性。
   *
   * @returns 新的 `音韻地位`，其中會含有指定的修改值。
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三元上');
   * > 音韻地位.調整({ 聲: '平' }).描述
   * '幫三元平'
   * > 音韻地位.調整({ 母: '見', 呼: '合' }).描述
   * '見合三元上'
   * ```
   */
  調整(調整屬性: 音韻屬性): 音韻地位 {
    const { 母 = this.母, 呼 = this.呼, 等 = this.等, 類 = this.類, 韻 = this.韻, 聲 = this.聲 } = 調整屬性;
    return new 音韻地位(母, 呼, 等, 類, 韻, 聲);
  }

  /**
   * 判斷某個小韻是否屬於給定的音韻地位限定範圍。
   *
   * 本方法可使用一般形式（`.屬於('...')`）或標籤模板語法（`` .屬於`...` ``）。
   *
   * 標籤模板語法僅能用於字面值的字串，但寫出來較簡單清晰。在不嵌入參數時，兩者效果相同。建議當表達式為字面值時使用標籤模板語法。
   *
   * @param 表達式 描述音韻地位的字串
   *
   * 字串中音韻地位的描述格式：
   *
   * * 音韻地位六要素：
   *   * `……母`, `……等`, `……韻`, `……聲`
   *   * 呼：`開口`, `合口`, `開合中立`
   *   * 類：`A類`, `B類`, `C類`, `不分類`（其中 ABC 可組合書寫，如 `AC類`）
   * * 拓展音韻地位：
   *   * `……組`, `……音`, `……攝`
   *   * 清濁：`全清`, `次清`, `全濁`, `次濁`, `清音`, `濁音`
   *   * 韻別：`陰聲韻`, `陽聲韻`, `入聲韻`
   * * 其他表達式：
   *   * `輕脣韻`：東鍾微虞廢文元陽尤凡韻三等（僅判斷韻與等，不判斷聲母）
   *   * `次入韻`：祭泰夬廢韻
   *   * `仄聲`：上去入聲
   *   * `舒聲`：平上去聲
   *   * `鈍音`：幫見影組
   *   * `銳音`：鈍音以外聲母
   *
   * 支援的運算子：
   *
   * * AND 運算子：`且`, `and`, `&`, `&&`
   * * &ensp; OR 運算子：`或`, `or`, `|`, `||`
   * * NOT 運算子：`非`, `not`, `~`, `!`
   * * 括號：`(……)`, `（……）`
   *
   * 各表達式及運算子之間以空格隔開。
   *
   * AND 運算子可省略。
   *
   * 如 `(端精組 且 入聲) 或 (以母 且 四等 且 去聲)` 與 `端精組 入聲 或 以母 四等 去聲` 同義。
   * @returns 若描述音韻地位的字串符合該音韻地位，回傳 `true`；否則回傳 `false`。
   * @throws 若表達式為空、不合語法、或限定條件不合法，則拋出異常。
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.屬於`章母`; // 標籤模板語法（表達式為字面值時推荐）
   * false
   * > 音韻地位.屬於('章母'); // 一般形式
   * false
   * > 音韻地位.屬於`一四等`;
   * false
   * > 音韻地位.屬於`幫組 或 陽韻`;
   * true
   * ```
   */
  屬於(表達式: string): boolean;

  /**
   * 判斷某個小韻是否屬於給定的音韻地位限定範圍（標籤模板語法）。
   *
   * 嵌入的參數可以是：
   *
   * * 函數：會被執行；若其傳回值為字串，會遞迴套用至 [[`音韻地位.屬於`]] 函數，否則會檢測其真值
   * * 字串：會遞迴套用至 [[`音韻地位.屬於`]] 函數
   * * 其他：會檢測其真值
   *
   * **注意**：
   *
   * * 該語法僅能用於字面值模板串，不能用於如 [[`.判斷`]] 等
   * * `` .屬於`${...}` `` 和 `` .屬於(`${...}`) `` 不同，只有前者支持上述嵌入參數，後者的模板串會先被求值為普通字串。
   *
   * @param 表達式 描述音韻地位的模板字串列表。
   * @param 參數 要嵌入模板的參數列表。
   * @returns 若描述音韻地位的字串符合該音韻地位，回傳 `true`；否則回傳 `false`。
   * @throws 若表達式為空、不合語法、或限定條件不合法，則拋出異常。
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三凡入');
   * > 音韻地位.屬於`一四等 或 ${音韻地位.描述 === '幫三凡入'}`;
   * true
   * ```
   */
  屬於(表達式: readonly string[], ...參數: unknown[]): boolean;

  屬於(表達式: string | readonly string[], ...參數: unknown[]): boolean {
    if (typeof 表達式 === 'string') 表達式 = [表達式];

    /** 普通字串 token 求值 */
    const { 呼, 等, 類, 韻, 聲, 清濁, 韻別, 組 } = this;
    const evalToken = (token: string): boolean => {
      let match: RegExpExecArray = null;
      const tryMatch = (pat: RegExp) => !!(match = pat.exec(token));
      if (tryMatch(/^(陰|陽|入)聲韻$/)) return 韻別 === match[1];
      if (tryMatch(/^輕脣韻$/)) return 輕脣韻.includes(韻) && 等 === '三';
      if (tryMatch(/^次入韻$/)) return 次入韻.includes(韻);
      if (tryMatch(/^仄聲$/)) return 聲 !== '平';
      if (tryMatch(/^舒聲$/)) return 聲 !== '入';
      if (tryMatch(/^(開|合)口$/)) return 呼 === match[1];
      if (tryMatch(/^開合中立$/)) return 呼 === null;
      if (tryMatch(/^不分類$/)) return 類 === null;
      if (tryMatch(/^(清|濁)音$/)) return 清濁[1] === match[1];
      if (tryMatch(/^[全次][清濁]$/)) return 清濁 === match[0];
      if (tryMatch(/^鈍音$/)) return 鈍音組.includes(組);
      if (tryMatch(/^銳音$/)) return !鈍音組.includes(組);
      if (tryMatch(/^(.+?)([母等類韻音攝組聲])$/)) {
        const values = [...match[1]];
        const check = 檢查[match[2] as keyof typeof 檢查];
        const invalid = values.filter(i => !check.includes(i)).join('');
        assert(!invalid, invalid + match[2] + '不存在');
        return values.includes(this[match[2] as keyof typeof 檢查]);
      }
      throw new Error(`unreconized test condition: ${token}`);
    };

    // 詞法分析，同時給普通運算元求值（惟函數型運算元留待後面惰性求值）
    type Keyword = '(' | ')' | 'not' | 'and' | 'or' | 'end';
    type Token = Keyword | boolean | LazyParameter;
    const KEYWORDS: Keyword[] = ['(', ')', 'not', 'and', 'or'];
    const PATTERNS: RegExp[] = [/^\($/, /^\)$/, /^([!~非]|not)$/i, /^(&+|且|and)$/i, /^(\|+|或|or)$/i];
    const tokens: [Token, string][] = [];
    for (let i = 0; i < 表達式.length; i++) {
      for (const rawToken of 表達式[i].split(/(&+|\|+|[!~()])|\b(and|or|not)\b|\s+/i).filter(i => i)) {
        const match = PATTERNS.findIndex(pat => pat.test(rawToken));
        if (match !== -1) {
          tokens.push([KEYWORDS[match], rawToken]);
        } else {
          tokens.push([evalToken(rawToken), rawToken]);
        }
      }
      if (i < 參數.length) {
        const arg = LazyParameter.from(參數[i], this);
        tokens.push([arg, String(arg)]);
      }
    }
    assert(tokens.length, 'empty expression');

    // 句法分析
    // 由於是 LL(1) 文法，可用遞迴下降法
    // 基本成分：元（boolean | LazyParameter）、非、且、或、'('、')'
    // 文法：
    // - 非項：非* ( 元 | 括號項 )
    // - 且項：非項 ( 且? 非項 )*
    // - 或項：且項 ( 或 且項 )*
    // - 括號項：'(' 或項 ')'
    let cursor = 0;
    const END: [Token, string] = ['end', 'end of expression'];
    const peek = () => (cursor < tokens.length ? tokens[cursor] : END);
    const read = () => (cursor < tokens.length ? tokens[cursor++] : END);

    type Operand = boolean | LazyParameter | SExpr;
    type Operator = 'value' | 'not' | 'and' | 'or';
    type SExpr = [Operator, ...Operand[]];

    const parseOrExpr = (required: boolean): SExpr => {
      const firstAndExpr = parseAndExpr(required);
      if (!firstAndExpr) {
        return null;
      }
      const orExpr: SExpr = ['or', firstAndExpr];
      for (;;) {
        // 或 且項 | END | else
        const [token] = peek();
        if (token === 'or') {
          cursor++;
          orExpr.push(parseAndExpr(true));
        } else {
          return orExpr;
        }
      }
    };

    const parseAndExpr = (required: boolean): SExpr => {
      const firstNotExpr = parseNotExpr(required);
      if (!firstNotExpr) {
        return null;
      }
      const andExpr: SExpr = ['and', firstNotExpr];
      for (;;) {
        // 且? 非項 | END | else
        const [token] = peek();
        if (token === 'and') {
          cursor++;
          andExpr.push(parseNotExpr(true));
        } else {
          const notExpr = parseNotExpr(false);
          if (notExpr) {
            andExpr.push(notExpr);
          } else {
            return andExpr;
          }
        }
      }
    };

    const parseNotExpr = (required: boolean): SExpr => {
      // 非*
      let seenNotOperator = false;
      let negate = false;
      for (;;) {
        const [token] = peek();
        if (token === 'not') {
          seenNotOperator = true;
          negate = !negate;
          cursor++;
        } else {
          break;
        }
      }
      let valExpr: SExpr = [negate ? 'not' : 'value'];
      // 元 | 括號項 | else
      const [token, rawToken] = peek();
      if (typeof token === 'boolean' || token instanceof LazyParameter) {
        valExpr.push(token);
        cursor++;
        return valExpr;
      } else if (token === '(') {
        cursor++;
        const parenExpr = parseOrExpr(true);
        const [rightParen, rawRightParen] = read();
        if (rightParen !== ')') {
          throw new Error(`expect ')', got: ${rawRightParen}`);
        }
        if (negate) {
          valExpr.push(parenExpr);
        } else {
          valExpr = parenExpr;
        }
        return valExpr;
      } else if (seenNotOperator || required) {
        const expected = seenNotOperator ? "operand or '('" : 'expression';
        throw new Error(`expect ${expected}, got: ${rawToken}`);
      } else {
        return null;
      }
    };

    const expr = parseOrExpr(true);
    const [token, rawToken] = read();
    if (token !== 'end') {
      throw new Error(`unexpected token: ${rawToken}`);
    }

    // 求值
    const evalExpr = (expr: SExpr): boolean => {
      const [op, ...args] = expr;
      switch (op) {
        case 'value':
          return evalOperand(args[0]);
        case 'not':
          return !evalOperand(args[0]);
        case 'and':
          return args.every(evalOperand);
        case 'or':
          return args.some(evalOperand);
      }
    };

    const evalOperand = (operand: Operand): boolean =>
      typeof operand === 'boolean' ? operand : operand instanceof LazyParameter ? operand.eval() : evalExpr(operand);

    return evalExpr(expr);
  }

  /**
   * 判斷某個小韻是否符合給定的某個條件，傳回自訂值。
   * @param 規則 `[判斷式, 結果][]` 形式的陣列。
   *
   * 判斷式可以是：
   *
   * * &#x3000;&#x3000;函數：會被執行；若其傳回值為非空字串，會套用至 [[`音韻地位.屬於`]] 函數，若為布林值則直接決定是否跳過本規則，否則規則永遠不會被跳過
   * * 非空字串：描述音韻地位的表達式，會套用至 [[`音韻地位.屬於`]] 函數
   * * &#x3000;布林值：直接決定是否跳過本規則
   * * &#x3000;&#x3000;其他：規則永遠不會被跳過（可用作指定後備結果）
   *
   * 建議使用空字串、`null` 或 `true` 作判斷式以指定後備結果。
   *
   * 結果可以是任意傳回值或遞迴規則。
   * @param error 若為 `true` 或非空字串，在未涵蓋所有條件時會拋出錯誤。
   * @param fallback 若為 `true`，在遞迴子陣列未涵蓋所有條件時會繼續嘗試母陣列的條件。
   * @returns 自訂值，在未涵蓋所有條件且不使用 `error` 時會回傳 `null`。
   * @throws `未涵蓋所有條件`（或 `error` 參數）, `規則需符合格式`, `無效的表達式`, `表達式為空`, `非預期的運算子`, `非預期的閉括號`, `括號未匹配`
   * @example
   * ```typescript
   * > 音韻地位 = Qieyun.音韻地位.from描述('幫三C凡入');
   * > 音韻地位.判斷([
   * >   ['遇果假攝 或 支脂之佳韻', ''],
   * >   ['蟹攝 或 微韻', 'i'],
   * >   ['效流攝', 'u'],
   * >   ['深咸攝', [
   * >     ['舒聲', 'm'],
   * >     ['入聲', 'p']
   * >   ]],
   * >   ['臻山攝', [
   * >     ['舒聲', 'n'],
   * >     ['入聲', 't']
   * >   ]],
   * >   ['通江宕梗曾攝', [
   * >     ['舒聲', 'ng'],
   * >     ['入聲', 'k']
   * >   ]]
   * > ], '無韻尾規則')
   * 'p'
   * ```
   */
  判斷<T, E = undefined>(規則: 規則<T>, error?: E, fallback?: boolean): E extends Falsy ? T | null : T {
    const Exhaustion = Symbol('Exhaustion');
    const loop = (所有規則: 規則<T>): T | typeof Exhaustion => {
      for (const 規則 of 所有規則) {
        assert(Array.isArray(規則) && 規則.length === 2, '規則需符合格式');
        let 表達式 = 規則[0];
        const 結果 = 規則[1];
        if (typeof 表達式 === 'function') 表達式 = 表達式();
        if (typeof 表達式 === 'string' && 表達式 ? this.屬於(表達式) : 表達式 !== false) {
          if (!Array.isArray(結果)) return 結果;
          const res = loop(結果);
          if (res === Exhaustion && fallback) continue;
          return res;
        }
      }
      return Exhaustion;
    };

    const res = loop(規則);
    if (res === Exhaustion) {
      if (!error) return null;
      else throw new Error(typeof error === 'string' ? error : '未涵蓋所有條件');
    }
    return res;
  }

  /**
   * 判斷當前音韻地位是否等於另一音韻地位。
   * @param other 另一音韻地位。
   * @returns 若相等，則回傳 `true`；否則回傳 `false`。
   * @example
   * ```typescript
   * > a = Qieyun.音韻地位.from描述('羣開三A支平');
   * > b = Qieyun.音韻地位.from描述('羣開三A支平');
   * > a === b;
   * false
   * > a.等於(b);
   * true
   * ```
   */
  等於(other: 音韻地位): boolean {
    return this.描述 === other.描述;
  }

  /**
   * 驗證給定的音韻地位六要素是否合法。
   *
   * 母必須為「幫滂並明端透定泥來知徹澄孃精清從心邪莊初崇生俟章昌常書船日
   * 見溪羣疑影曉匣云以」三十八聲類之一。
   *
   * 韻必須為「東冬鍾江支脂之微魚虞模齊祭泰佳皆夬灰咍廢真臻文殷元魂痕
   * 寒刪山先仙蕭宵肴豪歌麻陽唐庚耕清青蒸登尤侯幽侵覃談鹽添咸銜嚴凡」五十八韻之一。
   *
   * 當聲母為脣音，或韻母為「東冬鍾江虞模尤幽」（開合中立的韻）時，呼須為 `null`。
   * 在其他情況下，呼須取「開」或「合」。
   *
   * 當聲母為脣牙喉音（不含以母），且為三等韻時，類須取 `A`、`B`、`C` 之一。
   * 在其他情況下，類須為 `null`。
   * @param 母 聲母：幫, 滂, 並, 明, …
   * @param 呼 呼：`null`, 開, 合
   * @param 等 等：一, 二, 三, 四
   * @param 類 類：`null`, A, B, C
   * @param 韻 韻母（舉平以賅上去入）：東, 冬, 鍾, 江, …, 祭, 泰, 夬, 廢
   * @param 聲 聲調：平, 上, 去, 入
   * @throws 若給定的音韻地位六要素不合法，則拋出異常。
   */
  static 驗證(母: string, 呼: string | null, 等: string, 類: string | null, 韻: string, 聲: string): void {
    // 值驗證
    assert(所有.母.includes(母), `Unexpected 母: ${JSON.stringify(母)}`);
    assert(呼 === null || 所有.呼.includes(呼), `Unexpected 呼: ${JSON.stringify(呼)}`);
    assert(所有.等.includes(等), `Unexpected 等: ${JSON.stringify(等)}`);
    assert(類 === null || 所有.類.includes(類), `Unexpected 類: ${JSON.stringify(類)}`);
    assert(所有.韻.includes(韻), `Unexpected 韻: ${JSON.stringify(韻)}`);
    assert(所有.聲.includes(聲), `Unexpected 聲: ${JSON.stringify(聲)}`);

    // 基本搭配驗證
    // 等韻搭配
    for (const [搭配各等, 搭配各韻] of Object.entries(等韻搭配)) {
      if (搭配各韻.includes(韻)) {
        assert([...搭配各等].includes(等), `Unexpected 等 for ${韻}韻: ${等}`);
      }
    }

    // 調韻搭配
    if ([...陰聲韻].includes(韻)) {
      assert(聲 !== '入', `unexpected 入聲 for ${韻}韻`);
    }

    const 需要呼 = ![...'幫滂並明'].includes(母) && !呼韻搭配.中立.includes(韻);
    if (需要呼) {
      assert(呼 !== null, `Need 呼 for ${韻}韻`);
      for (const 搭配呼 of ['開', '合'] as const) {
        if (呼韻搭配[搭配呼].includes(韻)) {
          assert(呼 === 搭配呼, `Unexpected 呼 for ${韻}韻: ${呼}`);
        }
      }
    } else {
      assert(呼 === null, `呼 should be null for ${母}母${韻}韻`);
    }

    // FIXME 用具體搭配
    const 需要類 = 等 === '三' && 鈍音母.includes(母);
    if (需要類) {
      assert(類 !== null, `Need 類 for ${母}母三等`);
    } else {
      assert(類 === null, `類 should be null for ${母}母${等}等`);
    }

    // TODO 更多搭配限制
  }

  /**
   * 將音韻描述或最簡音韻描述轉換為音韻地位。
   * @param 音韻描述 音韻地位的描述或最簡描述
   * @returns 給定的音韻描述或最簡描述對應的音韻地位。
   * @example
   * ```typescript
   * > Qieyun.音韻地位.from描述('幫三凡入');
   * 音韻地位 { '幫三凡入' }
   * > Qieyun.音韻地位.from描述('羣開三A支平');
   * 音韻地位 { '羣開三A支平' }
   * ```
   */
  static from描述(音韻描述: string): 音韻地位 {
    const match = pattern.exec(音韻描述);

    const 母 = match[1];
    let 呼 = match[2] || null;
    let 等 = match[3] || null;
    let 類 = match[4] || null;
    const 韻 = match[5];
    const 聲 = match[6];

    if (呼 == null && ![...'幫滂並明'].includes(母)) {
      for (const 搭配呼 of ['開', '合'] as const) {
        if (呼韻搭配[搭配呼].includes(韻)) {
          呼 = 搭配呼;
          break;
        }
      }
    }

    if (等 == null) {
      for (const 搭配等 of ['一', '二', '三', '四'] as const) {
        if (等韻搭配[搭配等].includes(韻)) {
          等 = 搭配等;
          break;
        }
      }
    }

    // TODO 填入類
    if (類 === null && 等 === '三' && 鈍音母.includes(母) && !['蒸', '幽'].includes('韻')) {
      類 = 'C';
    }

    return new 音韻地位(母, 呼, 等, 類, 韻, 聲);
  }
}

/**
 * 惰性求值參數，用於 `音韻地位.屬於` 標籤模板形式
 */
class LazyParameter {
  private constructor(
    private inner: unknown,
    private 地位: 音韻地位,
  ) {}

  static from(param: unknown, 地位: 音韻地位): LazyParameter | boolean {
    switch (typeof param) {
      case 'string':
        return 地位.屬於(param);
      case 'function':
        return new LazyParameter(param, 地位);
      default:
        return !!param;
    }
  }

  eval(): boolean {
    if (typeof this.inner === 'function') {
      this.inner = this.inner.call(undefined);
      if (typeof this.inner === 'string') {
        this.inner = this.地位.屬於(this.inner);
      }
    }
    return (this.inner = !!this.inner);
  }

  toString(): string {
    return String(this.inner);
  }
}
