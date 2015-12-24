/**
 * Created by Yoli on 15/11/10.
 * 存放常量
 */
var Constant = {
    isDebug:true,
    isfrist:true,
    Score:0,
    bestScore:0,
    color:[
        cc.color(255,255,255),
        cc.color(102,153,  0),
        cc.color(255,102, 51),
        cc.color(153,  0,204),
        cc.color(102,204,255),
        cc.color(255,204,204)
    ],
    level:1,
    levels:[{},
        {limitStep:30,targetScore:10000 ,bestScore:0},
        {limitStep:30,targetScore:15000 ,bestScore:0},
        {limitStep:30,targetScore:20000 ,bestScore:0},
        {limitStep:35,targetScore:30000 ,bestScore:0},
        {limitStep:35,targetScore:35000 ,bestScore:0},
        {limitStep:35,targetScore:40000 ,bestScore:0},
        {limitStep:40,targetScore:45000 ,bestScore:0},
        {limitStep:40,targetScore:50000 ,bestScore:0},
        {limitStep:40,targetScore:55000 ,bestScore:0},
        {limitStep:40,targetScore:60000 ,bestScore:0},
        {limitStep:40,targetScore:60000 ,bestScore:0},
        {limitStep:40,targetScore:70000 ,bestScore:0},
        {limitStep:40,targetScore:80000 ,bestScore:0},
        {limitStep:40,targetScore:90000 ,bestScore:0},
        {limitStep:40,targetScore:100000,bestScore:0},
        {limitStep:40,targetScore:110000,bestScore:0}
    ]
};
