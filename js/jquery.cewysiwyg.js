(function($){

    $.fn.wysiwyg = function(options) {
        
        var settings = $.extend({
            $sel   : $('textarea'),
            boldnum: 600,
            btns   : {
                      html        : {'use':true, 'char':'h', pressed:false, 'title':'HTML View', 'func':function(p, $sel) {
                                    }},
                      element     : {'use':true, 'char':'e', pressed:false, 'title':'Insert Element'},
                      bold        : {'use':true, 'char':'b', pressed:false, 'title':'Bold', 'func':function(p, $sel) {
                                    }},
                      italic      : {'use':true, 'char':'i', pressed:false, 'title':'Italic'},
                      underline   : {'use':true, 'char':'u', pressed:false, 'title':'Underline'},
                      strike      : {'use':true, 'char':'s', pressed:false, 'title':'Strikethrough'},
                      sup         : {'use':true, 'char':'+', pressed:false, 'title':'Superscript'},
                      sub         : {'use':true, 'char':'-', pressed:false, 'title':'Subscript'},
                      quote       : {'use':true, 'char':'q', pressed:false, 'title':'Quote'},
                      numberlist  : {'use':true, 'char':'n', pressed:false, 'title':'Numbered List'},
                      orderlist   : {'use':true, 'char':'o', pressed:false, 'title':'Ordered List'},
                      alignleft   : {'use':true, 'char':'l', pressed:false, 'title':'Align Left'},
                      alignright  : {'use':true, 'char':'r', pressed:false, 'title':'Align Right'},
                      aligncenter : {'use':true, 'char':'c', pressed:false, 'title':'Align Center'},
                      alignjustify: {'use':true, 'char':'j', pressed:false, 'title':'Align Justified'}
            }
        }, options);

        //Validate Settings
        settings.boldnum = parseInt(settings.boldnum, 10);
        if(isNaN(settings.boldnum) || settings.boldnum < 100 || settings.boldnum > 900 || settings.boldnum % 100 != 0) settings.boldnum = 600;

        //Remove any pre-existing wysiwyg's
        $(this).find('.jquery-wysiwyg').remove();

        //Build out 
        $(this).find(settings.$sel).each(function() {
            var $t   = $(this), //Reference for original element we're replacing with WYSIWYG
                $s,             //Reference to parent .jquery-wysiwyg <div>
                k,              //Key var in for loop used to build WYSIWYG btns
                sel  = null,    //Current selection object
                $pn  = null,    //Parent node for sel object
                $ul  = null,    //List of buttons supported for this WYSIWYG
                $btn = {},      //Object for $ul button selectors
                $in  = null,    //DOM Tree Display
                html = '<ul>';  //HTML string to insert after $t

            //Build <ul> buttons and append to HTML string
            for(k in settings.btns)
                if(settings.btns[k].use === true)
                    html += '<li data-wysiwyg-type="'+k+'" title="'+settings.btns[k].title+'">'+settings.btns[k].char+'</li>';

            //Finish HTML string and insert after $t.  Should now have complete WYSIWYG
            html += '</ul><div class="jquery-wysiwyg-contenteditable" contenteditable="true">'+$t.val()+'</div><ins>&nbsp;</ins>';
            $s = $('<div class="jquery-wysiwyg"></div>').insertAfter($t).html(html);

            //Set $ul object for this WYSIWYG
            $ul = $s.find('> ul');
            $ul.find('> li').each(function() {
                $btn[$(this).attr('data-wysiwyg-type')] = $(this);
            });

            //Set display object for WYSIWYG
            $in = $s.find('> ins');
            
            //Set Event Handlers For WYSIWYG
            $s.find('.jquery-wysiwyg-contenteditable').blur(function() {
                //Set original textarea to value
                $(this).parent('.jquery-wysiwyg').prev('textarea').html($(this).html());
            })
            .keyup(function() { hightlightBtns(); })
            .click(function() { hightlightBtns(); });

            function hightlightBtns() {
                var p; //Property
                sel = getSelectionHtml();
                $pn = getSelectionParent();
                $in.html(returnDomTree($pn));

                //Bold
                if(settings.btns.bold) {
                    p = $pn.css("font-weight");
                    if(p == 'bold' || p >= settings.boldnum) {
                        settings.btns.bold.pressed = true;
                        $btn.bold.addClass('pressed');
                    }
                    else {
                        settings.btns.bold.pressed = false;
                        $btn.bold.removeClass('pressed');
                    }
                }

                //Italic
                if(settings.btns.italic) {
                    p = $pn.css('font-style');
                    if(p == 'italic') {
                        settings.btns.italic.pressed = true;
                        $btn.italic.addClass('pressed')
                    }
                    else {
                        settings.btns.italic.pressed = false;
                        $btn.italic.removeClass('pressed');
                    }
                }

                //Text-decorations are not as "inherited" as font properties.  Have to check element and parent styles
                if(settings.btns.underline || settings.btns.strike) {
                    p = getAllTextDecoration($pn); // returns spaced separated list

                    //Underline
                    if(settings.btns.underline) {
                        if(p.indexOf(' underline ') != -1) {
                            settings.btns.underline.pressed = true;
                            $btn.underline.addClass('pressed');
                        } else {
                            settings.btns.underline.pressed = false;
                            $btn.underline.removeClass('pressed');
                        }
                    }

                    //Strike
                    if(settings.btns.strike) {
                        if(p.indexOf(' line-through ') != -1) {
                            settings.btns.strike.pressed = true;
                            $btn.strike.addClass('pressed');
                        } else {
                            settings.btns.strike.pressed = false;
                            $btn.strike.removeClass('pressed');
                        }
                    }
                }                

                //Superscript
                if(settings.btns.sup) {
                    if(hasParentTag($pn,'sup')) {
                        settings.btns.sup.pressed = true;
                        $btn.sup.addClass('pressed');
                    } else {
                        settings.btns.sup.pressed = false;
                        $btn.sup.removeClass('pressed');
                    }
                }

                //Subscript
                if(settings.btns.sub) {
                    if(hasParentTag($pn,'sub')) {
                        settings.btns.sub.pressed = true;
                        $btn.sub.addClass('pressed');
                    } else {
                        settings.btns.sub.pressed = false;
                        $btn.sub.removeClass('pressed');
                    }
                }



                

                

            }

            function getAllTextDecoration($pn, p) {
                if(!p) p = ' ';
                p += $pn.css('text-decoration').toLowerCase() + ' ';

                if($pn.is('body')) return p;
                else return getAllTextDecoration($pn.parent(), p);
            }

            function hasParentTag($pn, tag) {
                if($pn.is(tag)) return true;
                else if($pn.hasClass('jquery-wysiwyg-contenteditable')) return false;
                else return hasParentTag($pn.parent(), tag);
            }

            function returnDomTree($pn, add) {
                if(!$pn.hasClass('jquery-wysiwyg-contenteditable')) {
                    var p = (add ? $pn[0].nodeName.toLowerCase() + ' &raquo; ' : $pn[0].nodeName.toLowerCase());
                    p = returnDomTree($pn.parent(), true) + p;
                    return p;
                } else return '';
            }






            $s.find('ul > li').mousedown(function() {
                var t = $(this).attr('data-wysiwyg-type'),
                    p = false;

                if($(this).hasClass('pressed')) {
                    $(this).removeClass('pressed');
                } else {
                    p = true;
                    $(this).addClass('pressed');
                }

                //Call function attached to button.
                if(typeof settings.btns[t].func === 'function') settings.btns[t].func(p, $(this));
            });

            $t.hide();
        });


        function getSelectionHtml() {
            var t = '';

            if(window.getSelection) t = window.getSelection();
            else if(document.getSelection) t = document.getSelection();
            else if(document.selection) t = document.selection.createRange();

            return t;
        }

        function getSelectionParent() {
            if(window.getSelection) return $(window.getSelection().anchorNode).parent();
            else if(document.getSelection) return $(document.getSelection().anchorNode).parent();
            else if(document.selection) return $(document.selection.createRange().parentElement());

            alert('This browser may not be supported! Please check out the CE-WYSIWYG Github page at https://github.com/soluml/CE-WYSIWYG');
            return null;
        }
    };
}(jQuery));