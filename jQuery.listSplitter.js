// ----------------------------------------------------------------------------
// listSplitterSelect - A jQuery Plugin to enable lists to be filtered
// v 0.1, requires jQuery 1.3.2 or later (may work with jQuery 1.3, but untested)
//
// To style use jQuery ui themeroller, http://jqueryui.com/themeroller/, being sure to include stules for ui-tabs  
//
// Dual licensed under the MIT and GPL licenses.
// ----------------------------------------------------------------------------
// Copyright (C) 2009 Rhys Evans
// http://wheresrhys.co.uk/resources/
// ----------------------------------------------------------------------------
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// ----------------------------------------------------------------------------
/* DOCUMENTATION
 To apply the plug-in to a list add the line, eg 

           $('ul.portfolio').listSplitter(); 
  
 The plugin takes 5 optional parameters in JSON form:
 includeList (array) - An array of all the classes you want included as sublists, eg ['design', 'frontEndDev']
						This will override the ignoreList (ie if you tell teh plugin which classes to include 
						it will automatically ignore all others anyway)
 ignoreList (array) - An array of classes to ignore when constructing the sublists, eg ['extraWide', 'blueBG'].
						List items with these classes will be displayed, but the classes will not appear as items in the nav
						If unspecified all classes used in the list will get their own sublist
 excludeList (array) - An array of classes to hide when constructing the sublists, eg ['expired', 'irrelevant'].
						List items with these classes won't be displayed, and the classes will not appear as items in the nav
 titleList (object) - An object which includes titles to display instead of class names in the nav eg {bunnyPhoto: 'Photos of Bunnies'}
						
 includeShowAll (boolean) - Determines whether to include 'Show all' as an item in the nav						
 
 sort (string 'asc', 'desc', default '')  - The order in which to display the nav
											asc - ascending alphabetical order
											desc - descending alphabetical order
											default -  In the order given by either the includeList or in order of appearance in the list
 initialView (string, default '')	- What sublist to show on page load. Defaults to showing the entire list
 */  


// ----------------------------------------------------------------------------

(function($) { 
	$.fn.listSplitter = function(options) {
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
			$(this).addClass("ui-helper-reset").children().addClass('ui-tabs-panel ui-widget-content').end().wrap('<div class="ui-widget ui-widget-content ui-tabs ui-corner-all">');
			var container = $(this).parent();
			var classArray = pars.includeList || getClassList(this);
			var categoryArray = refine(classArray);
			createNav();
			addListeners();
			setInitialView();
			function setInitialView () {
				if(pars.excludeList)
				{
					var classString = '.' + pars.excludeList.join(' .'); 
					$(classString, container).addClass('ui-helper-hidden');
				}
				if(pars.initialView && catListContains(pars.initialView))
				{
					$('>ul.ui-widget-header li a[href="#' + pars.initialView + '"]',container).click();
				} else {
					$('>ul.ui-widget-header li a[href="#"]',container).click();
				}
			}
			
			function catListContains(classString) {
				for(var i=0, il = categoryArray.length;i<il;i++)
				{
					if (categoryArray[i].cssClass ==classString)
					{
						return true;
					}
				}
				return false;
			}
			
			function addListeners() {
				$('>ul.ui-widget-header a', container).click(function() {
					var li = $(this).parent();
					if(li.not('.ui-state-active'));
					{
						
						li.addClass('ui-state-active ui-tabs-selected').siblings().removeClass('ui-state-active ui-tabs-selected');
						var filter = $(this).attr('href');
						if(filter.length>1)
						{
							if(filter.indexOf('#') == 0)
							{
								filter = filter.substr(1);
							} else { //ie gives the full URL
								filter = filter.split('/').reverse()[0].split('#').reverse()[0];
							}
							$('>ul:not(".ui-widget-header")>li', container).each(function() {
								if($(this).hasClass(filter))
								{
									$(this).removeClass('ui-tabs-hide');
								} else {
									$(this).addClass('ui-tabs-hide');
								}
							});
						} else {
							$('>ul:not(".ui-widget-header")>li', container).removeClass('ui-tabs-hide');
						}
					} 
					return false;
				}).hover(function(){$(this).parent().addClass('ui-state-hover');},
						function(){$(this).parent().removeClass('ui-state-hover');});
			}
			
			function createNav() { 
				var nav = '<ul class="ui-widget-header ui-helper-reset ui-helper-clearfix ui-hover-state ui-corner-all ui-tabs-nav">';
				for(i=0, il=categoryArray.length;i<il;i++)
				{
					nav += '<li class="ui-state-default ui-corner-top"><a href="#' + categoryArray[i].cssClass + '">' + categoryArray[i].title + '</a></li>';
				}
				nav += '</ul>';
				container.prepend(nav);
			}			
		});
		
		
		
		function getClassList(list) {
			var classArray = [];
			$('li', list).each(function() {
				classArray = classArray.concat($(this).attr('class').split(/\s+/));
			});
			var hash = {}, result = [];
			for ( var i = 0, l = classArray.length; i < l; ++i ) {
				if ( !hash.hasOwnProperty(classArray[i]) && classArray[i] != '' ) {
					hash[ classArray[i] ] = true;
					result.push(classArray[i]);
				}
			}
			return result;
		}
		
		function refine(classArray) {
			var ignoreObj = {}
			var titleObj = pars.titleList || {};
			pars.ignoreList = pars.ignoreList.concat(['ui-widget-content','ui-helper-reset', 'ui-list-splitter', 'ui-tabs-panel', 'ui-corner-bottom']);
			if(pars.ignoreList || pars.excludeList) {
				var noNavList = pars.ignoreList.concat(pars.excludeList);
				for(var i=0, il = noNavList.length;i<il;i++)
				{
					ignoreObj[noNavList[i]] = noNavList[i]
				}
			}
			for(var i=0, il=classArray.length; i<il;i++)
			{
				if(ignoreObj[classArray[i]]) {
					classArray.splice(i, 1);
					i--;
					il--;
					
					
				} else {
					if(titleObj[classArray[i]])
					{
						classArray[i] = {cssClass:classArray[i], title:titleObj[classArray[i]]};
					} else {
						classArray[i] = {cssClass:classArray[i], title:classArray[i]};
					}
				}
			}
			if(pars.sort &&(pars.sort == 'asc' || pars.sort == 'desc')) {
				
				classArray = classArray.sort(function(a,b) {
					
					var testArray = [a.title, b.title];
				
					testArray = testArray.sort();
					if(testArray[0] == a.title)
					{
				
						return -1;
					} else {
			
						return 1
					} 
				});
				if (pars.sort == 'desc')
				classArray.reverse();
			
			}
		
			if(pars.includeShowAll)
			{
				classArray.unshift({cssClass:'', title:'Show all'});
			}
			return classArray;
		}


	};
})(jQuery);
	
