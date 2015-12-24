/**
 * Created by Yoli on 15/12/10.
 */
var Color = cc.Sprite.extend({
    _type:0,
    _col:0,
    _row:0,

    ctor: function (type, col, row) {
        this._super("res/colors/"+(type+1)+".png");
        this.init(type,col,row);
    },

    init: function (type, col, row) {
        this._type = type;
        this._col = col;
        this._row = row;
    }
});

Color.RandomType = function (col, row) {
    return new Color(parseInt(Math.random()*3),col,row);
};