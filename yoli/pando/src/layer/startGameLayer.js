/**
 * Created by Yoli on 15/11/10.
 */
var StartGameLayer = cc.Layer.extend({
    ctor:function() {
        this._super();


        var _start = flax.assetsManager.createDisplay(res.Start_plist,"startLayer",{parent:this});
        flax.inputManager.addListener(_start.start,this.startGame,null,this);

        return true;
    },
    startGame:function(){
        cc.log("start Game");
        flax.replaceScene("play");
    }
});