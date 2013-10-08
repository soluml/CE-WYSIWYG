(function($){

    $.fn.wysiwyg = function(options) {
        
        var settings = $.extend({
            $sel : $('textarea'),
            btns : {
                    html        : {'use':true, 'char':'h', 'title':'HTML View'},
                    element     : {'use':true, 'char':'e', 'title':'Insert Element'},
                    bold        : {'use':true, 'char':'b', 'title':'Bold'},
                    italic      : {'use':true, 'char':'i', 'title':'Italic'},
                    underline   : {'use':true, 'char':'u', 'title':'Underline'},
                    strike      : {'use':true, 'char':'s', 'title':'Strikethrough'},
                    super       : {'use':true, 'char':' ', 'title':'Superscript'},
                    sub         : {'use':true, 'char':' ', 'title':'Subscript'},
                    quote       : {'use':true, 'char':'q', 'title':'Quote'},
                    numberlist  : {'use':true, 'char':' ', 'title':'Numbered List'},
                    orderlist   : {'use':true, 'char':' ', 'title':'Ordered List'},
                    alignleft   : {'use':true, 'char':'l', 'title':'Align Left'},
                    alignright  : {'use':true, 'char':'r', 'title':'Align Right'},
                    aligncenter : {'use':true, 'char':'c', 'title':'Align Center'},
                    alignjustify: {'use':true, 'char':'j', 'title':' Align Justified'}
            }
        }, options);

        //Remove any pre-existing wysiwyg's
        $(this).find('.jquery-wysiwyg').remove();

        //Build out 
        $(this).find(settings.$sel).each(function() {
            var $t   = $(this),
                $s,
                k,
                html = '<ul>';

            for(k in settings.btns)
                if(settings.btns[k].use === true)
                    html += '<li class="jquery-wysiwyg-'+k+'" title="'+settings.btns[k].title+'">'+settings.btns[k].char+'</li>';

            html += '</ul><div class="jquery-wysiwyg-contenteditable" contenteditable="true">'+$t.val()+'</div>';
            $s = $('<div class="jquery-wysiwyg"></div>').insertAfter($t).html(html);
            
            //Set Event Handler For WYSIWYG
            $s.find('.jquery-wysiwyg-contenteditable').blur(function(){
                $(this).parent('.jquery-wysiwyg').prev('textarea').html($(this).html());
            });

            $t.hide();
        });

    };

}(jQuery));