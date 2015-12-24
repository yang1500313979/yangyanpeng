/**
 * Created by Yoli on 15/12/8.
 */
var Body = cc.Sprite.extend({
    _type:0,
    _status:Constant.UP,
    ctor: function (type) {
        this._super("res/body/"+type+".png");

        this.init(type);
    },
    init: function (type) {
        this._type = type;
        this._status = Constant.UP;
    },
    changestatus : function (status) {
        if(1){
            switch (status){
                case Constant.UP:
                    this.setRotation(0);
                    break;
                case Constant.DOWN:
                    this.setRotation(180);
                    break;
                case Constant.LEFT:
                    this.setRotation(-90);
                    break;
                case Constant.RIGHT:
                    this.setRotation(90);
                    break;
                default :break;

            }
            this._status = status;

        }
    }
});

Body.create = function (type) {
    return new Body(type);
};