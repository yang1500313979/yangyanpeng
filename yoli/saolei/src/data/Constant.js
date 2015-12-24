/**
 * Created by Yoli on 15/11/10.
 * 存放常量
 */
var Constant = {
    isDebug:true,
    isfrist:true,
    Score:0,
    Level:2,
    Levels:[
        {WIDTH:9,HEGHT:9,NUMS:10,OVERNUMS:0,TIME:999},
        {WIDTH:16,HEGHT:16,NUMS:40,OVERNUMS:0,TIME:999},
        {WIDTH:16,HEGHT:30,NUMS:99,OVERNUMS:0,TIME:999}
    ]
};
randPoint = function(doubleArray,array,num){
    if(doubleArray.length==0){
        cc.log("doubleArray length was 0");
    }else if(doubleArray.length * doubleArray[0].length < num){
        cc.log("please check the num");
    }else{
        while(array.length!=num){
            var col = parseInt(Math.random()* doubleArray.length);
            var row = parseInt(Math.random()* doubleArray[0].length);
            var a = [];
            a.col = col;
            a.row = row;
            if(!pointWasin(array,a)){
                array.push(a);
            }
        }
    }
};
pointWasin = function (array,point) {
    for(var i in array){
        if(array[i].col == point.col && array[i].row==point.row){
            return true;
        }
    }
    return false;
};