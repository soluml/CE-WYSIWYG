(function($){

    $.fn.wysiwyg = function(options) {
        
        var settings = $.extend({
            $sel : $('textarea'),
            btns : {
                    html        : true,
                    element     : true,
                    bold        : true,
                    italic      : true,
                    underline   : true,
                    strike      : true,
                    super       : true,
                    sub         : true,
                    quote       : true,
                    numberlist  : true,
                    orderlist   : true,
                    alignleft   : true,
                    alignright  : true,
                    aligncenter : true,
                    alignjustify: true
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
                if(settings.btns[k] === true)
                    html += '<li class="jquery-wysiwyg-'+k+'"></li>';

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