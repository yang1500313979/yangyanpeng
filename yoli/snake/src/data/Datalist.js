/**
 * Created by Yoli on 15/12/5.
 */
var Constant = {
    MAP_WIDHT:12,
    MAP_HEIGH:20,
    SPRITE_WIDHT:40,
    SPRITE_HEIGH:40,
    UP      :1,
    DOWN    :2,
    LEFT    :3,
    RIGHT   :4
};

var Variables = {
    bDebug:true,
    bFirst:true,
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

