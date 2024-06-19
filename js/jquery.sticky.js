(function($) {
  var slice = Array.prototype.slice; 
  var splice = Array.prototype.splice; 

  var lastScrollTop = 0; // Khai báo biến lastScrollTop ở đây

  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: '',
      widthFromWrapper: true, 
      responsiveWidth: false
  },
  $window = $(window),
  $document = $(document),
  sticked = [],
  windowHeight = $window.height(),
  scroller = function() {
      var scrollTop = $window.scrollTop();

      for (var i = 0; i < sticked.length; i++) {
          var s = sticked[i];

          if (scrollTop > lastScrollTop) {
              // Scroll down
              s.stickyElement.removeClass(s.className);
              s.stickyElement.stop().animate({
                  'top': -s.stickyElement.outerHeight() // Dịch chuyển navbar lên ngoài màn hình
              }, 200); // Thời gian animation 200ms

          } else {
              // Scroll up
              s.stickyElement.addClass(s.className);
              s.stickyElement.stop().animate({
                  'top': 0 // Hiển thị navbar trở lại vị trí bình thường
              }, 200); // Thời gian animation 200ms
          }

          lastScrollTop = scrollTop;
      }
  },
  resizer = function() {
      windowHeight = $window.height();

      for (var i = 0; i < sticked.length; i++) {
          var s = sticked[i];
          var newWidth = null;
          if (s.getWidthFrom) {
              if (s.responsiveWidth === true) {
                  newWidth = $(s.getWidthFrom).width();
              }
          } else if(s.widthFromWrapper) {
              newWidth = s.stickyWrapper.width();
          }
          if (newWidth != null) {
              s.stickyElement.css('width', newWidth);
          }
      }
  },
  methods = {
      init: function(options) {
          var o = $.extend({}, defaults, options);
          return this.each(function() {
              var stickyElement = $(this);

              var stickyId = stickyElement.attr('id');
              var stickyHeight = stickyElement.outerHeight();
              var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName
              var wrapper = $('<div></div>')
                  .attr('id', wrapperId)
                  .addClass(o.wrapperClassName);

              stickyElement.wrapAll(wrapper);

              var stickyWrapper = stickyElement.parent();

              if (o.center) {
                  stickyWrapper.css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
              }

              if (stickyElement.css("float") == "right") {
                  stickyElement.css({"float":"none"}).parent().css({"float":"right"});
              }

              stickyWrapper.css('height', stickyHeight);

              o.stickyElement = stickyElement;
              o.stickyWrapper = stickyWrapper;
              o.currentTop    = null;

              sticked.push(o);
          });
      },
      update: scroller,
      unstick: function(options) {
          return this.each(function() {
              var that = this;
              var unstickyElement = $(that);

              var removeIdx = -1;
              var i = sticked.length;
              while (i-- > 0) {
                  if (sticked[i].stickyElement.get(0) === that) {
                      splice.call(sticked,i,1);
                      removeIdx = i;
                  }
              }
              if(removeIdx != -1) {
                  unstickyElement.unwrap();
                  unstickyElement
                      .css({
                          'width': '',
                          'position': '',
                          'top': '',
                          'float': ''
                      })
                  ;
              }
          });
      }
  };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
      window.addEventListener('scroll', scroller, false);
      window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
      window.attachEvent('onscroll', scroller);
      window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
      if (methods[method]) {
          return methods[method].apply(this, slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method ) {
          return methods.init.apply( this, arguments );
      } else {
          $.error('Method ' + method + ' does not exist on jQuery.sticky');
      }
  };

  $.fn.unstick = function(method) {
      if (methods[method]) {
          return methods[method].apply(this, slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method ) {
          return methods.unstick.apply( this, arguments );
      } else {
          $.error('Method ' + method + ' does not exist on jQuery.sticky');
      }
  };
  $(function() {
      setTimeout(scroller, 0);
  });
})(jQuery);

$(document).ready(function(){
  $(".navbar").sticky({ topSpacing: 0 });
});
