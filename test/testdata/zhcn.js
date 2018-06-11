module.exports = {
    fields: [
        {
            name: 'title',
            config: { boost: 10 }
        }, {
            name: 'body'
        }
    ],
    documents: [
        {
            "title": "一首歌",
            "body": "汉字的 起源，有 传说中的 仓颉 造字 。我们现在 能够确 认距今约3000多年的甲骨文已经是非常成熟的文字体系，于1899年被发现。可以考证的汉字发展经历了甲骨文、金文、小篆、汉隶、楷书、行书、草书等过程，可以划分为两个大阶段。从甲骨文字到小篆是一个阶段；从秦汉时代的隶书以下是另一个阶段。前者属于古文字的范畴，后者属于近代文字的范畴。",
            "id": 1
        }, {
            "title": "现代",
            "body": "大体说来，从隶书到今 天使用的 现代 汉字 形体 上没有太大的变化。从汉字跟汉语的关系看，汉字是一种语素文字。汉字代表的是汉语里的语素。汉字有独体字与合体字的区别。从构造上讲，合体字比独体字高一个层次 。",
            "id": 2
        }
    ],
    tests: [
        {
            what: "find the word %w",
            search: "变化",
            found: 1
        }, {
            what: "find the word %w",
            search: "一首歌",
            found: 1
        }, {
            what: "never find a word that does not exist, like %w",
            search: "科学家",
            found: 0
        }
    ]
}