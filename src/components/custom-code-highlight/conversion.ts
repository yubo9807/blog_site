interface ConversionOption {
  keywords?: string[]
  reg?: {
    [key in string]?: RegExp
  }
}

const defaultOption: ConversionOption = {
  // 关键字
  keywords: ['rule', 'end', 'knowledgebase', 'knowledge', 'reg', 'require', 'prohibit', 'and', 'or', 'in', 'true', 'false'],

  // 正则
  reg: {
    // 多行注释
    multiRowComment: /\/\*.*?\*\//gs,
    
    // 单行注释
    singleLineComment: /\/\/[^\n]+\n/g,
    
    // 换行字符串
    
    // 字符串
    string: /"[^"]*"|'[^']*'/g,

    // 数字
    number: /\d*\.?\d+/g,

    // 方法
    methods: /\w+(?=\()/g,

    // 对象
    object: /\w*\./sg,
  }
}

export default function(text: string, option: ConversionOption = {}) {
  option = Object.assign({}, defaultOption, option);
  const { reg } = option;
  
  class Conversion {

    textList: any[]
    constructor(text) {
      this.textList = [{ content: text + ' ' }];
    }

    /**
     * 公共方法，截断匹配到的正则，处理后重新赋值给 this.textList
     * @param {RegExp} reg 匹配正则
     * @param {String} className 添加类名
     * @param {Null | Array} splice 长度为3的数组，对匹配后的值进行修改（与数组方法 splice 一致）
     */
    commonDealWith(reg, className = '', splice = null) {
      const arr = Object.assign([], this.textList);
      const record = [];
      arr.forEach((val, index) => {
        if (val.delaWith) return;
        
        const noMatching = val.content.split(reg).map(val => ({ content: val }));
        const matching = val.content.match(reg);
        if (!matching) return;

        let insert = 1;
        matching.forEach(val => {
          const content = `<span class="${className}">${splice ? val.slice(splice[0], splice[1]): val}</span>${splice ? splice[2] : ''}`;
          noMatching.splice(insert, 0, { delaWith: true, content });
          insert += 2;
        })

        record.push([index, noMatching.length, noMatching]);
      })
      record.forEach((val, index, self) => {
        if (index > 0) {
          const len = self[index - 1][1] - 1;
          val[0] = val[0] + len;
          val[1] = val[1] + len;
        }
        arr.splice(val[0], 1, ...val[2]);
      })
      this.textList = arr;
      return this;
    }
  
    /**
     * 处理关键字
     */
    keyword(words) {
      const arr = Object.assign([], this.textList);
      const record = [];
      arr.forEach((val, index) => {
        if (val.delaWith) return;
        
        const reg = eval(`/(${words.join('|')})(?=\\s)/g`);
        const newArr = val.content.split(reg);
        newArr.forEach((val, index) => words.includes(val) && newArr.splice(index, 1));
        const noMatching = newArr.map(val => ({ content: val }));
  
        const matching = val.content.match(reg);
        if (!matching) return;

        let insert = 1;
        matching.forEach(val => {
          noMatching.splice(insert, 0, { delaWith: true, content: `<span class="keyword">${val}</span>` });
          insert = insert + 2;
        })

        record.push([index, noMatching.length, noMatching]);
      })
      record.forEach((val, index, self) => {
        if (index > 0) {
          const len = self[index - 1][1] - 1;
          val[0] = val[0] + len;
          val[1] = val[1] + len;
        }
        arr.splice(val[0], 1, ...val[2]);
      })

      this.textList = arr;
      return this;
    }


    /**
     * 合并成html
     */
    merge() {
      const html = this.textList.map(val => val.content).join('');
      return `<code class="code-container">${html}</code>`;
    }
    
  }
  
  const conversion = new Conversion(text);
  try {
    return conversion.commonDealWith(reg.multiRowComment, 'block-comment')
                     .commonDealWith(reg.singleLineComment, 'line-comment')
                     .commonDealWith(reg.string, 'string')
                     .commonDealWith(reg.number, 'number')
                     .keyword(option.keywords)
                     .commonDealWith(reg.methods, 'methods')
                     .commonDealWith(reg.object, 'object')
                     .merge();
  } catch (error) {
    console.error(error);
    return text;
  }
}