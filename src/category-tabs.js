/*
  * category-tabs
  * https://github.com/wheresrhys/jquery.category-tabs
  *
  * Copyright (c) 2013 Rhys Evans
  * Licensed under the MIT license.
  */




(function($) { 
    $.fn.categoryTabs = function(options) {

        function getClassList(list) {
            var classArray = [];
            $('li', list).each(function() {
                classArray = classArray.concat($(this).attr('class').split(/\s+/));
            });
            var hash = {}, result = [];
            for ( var i = 0, l = classArray.length; i < l; ++i ) {
                if ( !hash.hasOwnProperty(classArray[i]) && classArray[i] !== '' ) {
                    hash[ classArray[i] ] = true;
                    result.push(classArray[i]);
                }
            }
            return result;
        }
    
        
        function refine(classArray) {
            var ignoreObj = {};
            var titleObj = pars.titleList || {};
            var i, il;
            pars.ignoreList = pars.ignoreList.concat(['ui-widget-content','ui-helper-reset', 'ui-category-tabs', 'ui-tabs-panel', 'ui-corner-bottom']);
            if(pars.ignoreList || pars.excludeList) {
                var noNavList = pars.ignoreList.concat(pars.excludeList);
                for(i=0, il = noNavList.length;i<il;i++) {
                    ignoreObj[noNavList[i]] = noNavList[i];
                }
            }
            for(i=0, il=classArray.length; i<il;i++)
            {
                if(ignoreObj[classArray[i]]) {
                    classArray.splice(i, 1);
                    i--;
                    il--;
                } else {
                    if(titleObj[classArray[i]]) {
                        classArray[i] = {cssClass:classArray[i], title:titleObj[classArray[i]]};
                    } else {
                        classArray[i] = {cssClass:classArray[i], title:classArray[i]};
                    }
                }
            }
            if(pars.sort &&(pars.sort === 'asc' || pars.sort === 'desc')) {
                classArray = classArray.sort(function(a,b) {
                    var testArray = [a.title, b.title]; 
                    testArray = testArray.sort();
                    if(testArray[0] === a.title) {
                        return -1;
                    } else {
                        return 1;
                    } 
                });
                if (pars.sort === 'desc') {
                    classArray.reverse();
                }
            }
            if(pars.includeShowAll)
            {
                classArray.unshift({cssClass:'', title:'Show all'});
            }
            return classArray;
        }
    

        var that = this;
        this.defaults = {
            includeList : null,
            ignoreList :[],
            excludeList :null,
            titleList : null,
            includeShowAll : true,
            initialView : '',
            sort: ''
        };    
    
        
        var pars = $.extend({}, that.defaults, options);
    
        
        return this.each(function() {

            function setInitialView () {
                if(pars.excludeList) {
                    var classString = '.' + pars.excludeList.join(' .'); 
                    $(classString, container).addClass('ui-helper-hidden');
                }
                if(pars.initialView && catListContains(pars.initialView)) {
                    $('>ul.ui-widget-header li a[href="#' + pars.initialView + '"]',container).click();
                } else {
                    $('>ul.ui-widget-header li a[href="#"]',container).click();
                }
            }
      
            
            function catListContains(classString) {
                for(var i=0, il = categoryArray.length;i<il;i++) {
                    if (categoryArray[i].cssClass === classString) {
                        return true;
                    }
                }
                return false;
            }
      
            
            function addListeners() {
                $('>ul.ui-widget-header a', container).click(function() {
                    var li = $(this).parent();
                    if (li.not('.ui-state-active')) {       
                        li.addClass('ui-state-active ui-tabs-selected').siblings().removeClass('ui-state-active ui-tabs-selected');
                        var filter = $(this).attr('href');
                        if (filter.length>1) {
                            if (filter.indexOf('#') === 0) {
                                filter = filter.substr(1);
                            } else { //ie gives the full URL
                                filter = filter.split('/').reverse()[0].split('#').reverse()[0];
                            }
                            $('>:not(".ui-widget-header")>li', container).each(function() {
                                if($(this).hasClass(filter)) {
                                    $(this).removeClass('ui-tabs-hide');
                                } else {
                                    $(this).addClass('ui-tabs-hide');
                                }
                            });
                        } else {
                            $('>:not(".ui-widget-header")>li', container).removeClass('ui-tabs-hide');
                        }
                    } 
                    return false;
                }).hover(function(){
                    $(this).parent().addClass('ui-state-hover');
                }, function(){
                    $(this).parent().removeClass('ui-state-hover');
                });
            }
      
            
            function createNav() { 
                var nav = '<ul class="ui-widget-header ui-helper-reset ui-helper-clearfix ui-hover-state ui-corner-all ui-tabs-nav">';
                for(var i=0, il=categoryArray.length;i<il;i++) {
                    nav += '<li class="ui-state-default ui-corner-top"><a href="#' + categoryArray[i].cssClass + '">' + categoryArray[i].title + '</a></li>';
                }
                nav += '</ul>';
                container.prepend(nav);
            }     

            $(this).addClass("ui-helper-reset").children().addClass('ui-tabs-panel ui-widget-content').end().wrap('<div class="ui-widget ui-widget-content ui-tabs ui-corner-all">');
            var container = $(this).parent();
            var classArray = pars.includeList || getClassList(this);
            var categoryArray = refine(classArray);
            createNav();
            addListeners();
            setInitialView(); 

        });
    
    };
    
})(jQuery);
  

  

