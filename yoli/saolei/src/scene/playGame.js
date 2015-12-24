/**
 * Created by Yoli on 15/11/10.
 */

var PlayGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        cc.spriteFrameCache.addSpriteFrames(res.Play_plist);

        var layer = new PlayGameLayer();
        this.addChild(layer);


    }
});


