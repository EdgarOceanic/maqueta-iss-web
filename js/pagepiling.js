( function($) {
  'use strict';

	/*-------------------------------------------------------------------------------
	  Cambio de página full screen 
	-------------------------------------------------------------------------------*/



    if ($('.pagepiling').length > 0){

      	$('.pagepiling').pagepiling({
    		scrollingSpeed: 280,
		    loopBottom:true,
		    anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7'],
		    afterLoad: function(anchorLink, index){
	            if ( $('.pp-section.active').scrollTop() > 0 ){
	            	$('.navbar').removeClass('navbar-white');
	            }
	            else{
	            	$('.navbar').addClass('navbar-white');
	            }
	            
  			}
		});
    } 

})(jQuery);
