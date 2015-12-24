/**
 * Created by Yoli on 15/11/4.
 */
var game =game||{};
game.language = window.location.href.indexOf('bookor')==-1 ? 'en' : 'ch'
game.language = 'ch'


var icon_link = window.document.getElementById('gameico');
icon_link.href ="res/"+game.language+"/favicon.ico"