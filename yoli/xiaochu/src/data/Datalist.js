/**
 * Created by Yoli on 15/12/5.
 */
var Constant = {
    MAP_WIDHT:10,
    MAP_HEIGH:14,
    SPRITE_WIDHT:45,
    SPRITE_HEIGH:45
};

var Variables = {
    bDebug:true,
    bFirst:false,
    nScore:0,
    level:1,
    nBestScore:0,
    canClick : false

};
fRectWithRectCollsion = function (rect1,rect2) {

    var ballBox = rect1.getBoundingBox();
    var catBox  = rect2.getBoundingBox();
    if(cc.rectIntersectsRect(ballBox,catBox)){
        return true;
    }

    return false;
};

