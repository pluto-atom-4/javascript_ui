(function(){
    var menu = document.getElementById('tab_menu');
    var inner = document.getElementById('tab_content_inner');
    var menus = menu.getElementsByTagName('a');
    var current;
    for (var i = 0, l = menus.length; i < l; i++) {
        tab_init( menus[i], i );
    }
    
    function tab_init( link, index ) {
        if (!current) {
            current = {menu:link, index:index};
            link.className = 'active';
        }    
        link.onclick = function() {
            current.menu.className = '';
            link.className = 'active';
            current.menu = link;
            new MiniTweener(inner.style, {
              left:{
                from: current.index * -450,
                to: -450 * index,
                suffix:'px'
              }
            }, {duration:300});
            current.index = index;
            return false;
        };
    }
})();
