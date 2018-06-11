/**
 * lunr对中文分词的支持
 */
;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else if (typeof exports === 'object') {
    /**
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    factory()(root.lunr);
  }
}(this, function() {
  /**
   * Just return a value to define the module export.
   * This example returns an object, but the module
   * can return a function as the exported value.
   */
  return function(lunr) { 
    /* throw error if lunr is not yet included */
    if ('undefined' === typeof lunr) {
      throw new Error('Lunr is not present. Please include / require Lunr before this script.');
    }

    /* throw error if lunr stemmer support is not yet included */
    if ('undefined' === typeof lunr.stemmerSupport) {
      throw new Error('Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.');
    }

    /*
    Thai tokenization is the same to Japanense, which does not take into account spaces.
    So, it uses the same logic to assign tokenization function due to different Lunr versions.
    */
    var isLunr2 = lunr.version[0] == "2";

    /* register specific locale function */
    lunr.zhcn = function() {
        this.pipeline.reset();
        this.pipeline.add(
            lunr.zhcn.trimmer
        );

        if (isLunr2) { // for lunr version 2.0.0
            this.tokenizer = lunr.zhcn.tokenizer;
        } else {
            if (lunr.tokenizer) { // for lunr version 0.6.0
                lunr.tokenizer = lunr.zhcn.tokenizer;
            }
            if (this.tokenizerFn) { // for lunr version 0.7.0 -> 1.0.0
                this.tokenizerFn = lunr.zhcn.tokenizer;
            }
        }
    };

    /* lunr trimmer function */
    lunr.zhcn.isChineseChar = function(str){
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;  
        return reg.test(str); 
    }
    lunr.zhcn.trimmer = function(token){
        if(lunr.zhcn.isChineseChar(token)){
            return token;
        }
        return token.replace(/^\W+/, '').replace(/^\W+$/, '');
    }
    lunr.Pipeline.registerFunction(lunr.zhcn.trimmer, 'trimmer-zhcn');

    lunr.zhcn.tokenizer = function (obj) {
        if (!arguments.length || obj == null || obj == undefined) return []
        if (Array.isArray(obj)) return obj.map(function (t) { return lunr.utils.asString(t).toLowerCase() }) 
        var str = obj.toString().replace(/^\s+/, '')
      
        for (var i = str.length - 1; i >= 0; i--) { //这里需要用标点符号进行分隔
          if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1)
            break
          }
        }
       
      
        var rs = str
          .split(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\uFE30-\uFFA0|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]+/)
          .map(function (token) {
            var t = token.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\uFE30-\uFFA0|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, '').toLowerCase()
            
            return t;
          });
      
        // TODO: This exists so that the deprecated property lunr.tokenizer.seperator can still be used. By
        // default it is set to false and so the correctly spelt lunr.tokenizer.separator is used unless
        // the user is using the old property to customise the tokenizer.
        //
        // This should be removed when version 1.0.0 is released.
        var separator = lunr.tokenizer.seperator || lunr.tokenizer.separator
      
        return obj.toString().trim().toLowerCase().split(separator); 
    }
  };
}))