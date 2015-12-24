/**
 * Created by Yoli on 15/12/2.
 */

var Block = cc.Sprite.extend({
    _type: 0,
    _col: 0,
    _row:0,
    _isthunder:false,
    _isOpen:false,
    _isflag:false,

    ctor:function(type,col,row){
        this._super("#"+type+".png");

        this.init(type,col,row);
    },
    init:function(type,col,row){
        this._type = type;
        this._col = col;
        this._row = row;
        this._isOpen = false;

    }
});