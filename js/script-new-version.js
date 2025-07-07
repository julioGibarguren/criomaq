// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        var offset = 0;
        if (window.innerWidth >= 768) {
          offset = 89;
        }
        $('html, body').animate({
          scrollTop: target.offset().top - offset
        }, 700, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });


  // Set up HTML elements into variables
var $overlay	= $('<div id="lightboxOverlay"></div>');
var $image		= $('<img>');
var $caption	= $('<h3></h3>');
var $close		= $('<i class="fa fa-times"></i>');

// Just more variables
var imageUrl;
var imageAlt;

// Adding HTML stuff
$('body').append($overlay);		// Add the overlay to the document
$overlay.hide();				// Hide the overlay

// When a user clicks on an image
$('#sliderLightbox img').click(function(){
	imageUrl = $(this).attr('src');		// Find the image URL
	imageAlt = $(this).attr('alt');		// Find the image Alt text

	$overlay.append($image);			// Add the image to the overlay
	$overlay.append($caption);			// Add the image caption to the overlay
	$overlay.append($close);			// Add the close button to the overlay
	$image.attr('src', imageUrl);		// Add the link to the image attribute
	$caption.text(imageAlt);			// Add text to the <p> tag
	$overlay.fadeIn('1000');			// Show the overlay
	$image.fadeIn('1000');
});

// If the users clicks anywhere on the click iccon, hide  the overlay.
$close.click( function() {
	$overlay.fadeOut('1000');
} );

// Set the minimum height for the slider dynamically based on the parent column
var maquinaSliderMinHeight = 0;

function updateMinSliderHeight() {
  var parentCol = $('#maquina-destacada-1').closest('.col-md-6, .col-xs-12');
  if (parentCol.length) {
    maquinaSliderMinHeight = parentCol.height();
  } else {
    maquinaSliderMinHeight = 0;
  }
}

// Simple custom slider for #maquina-destacada-1
$(document).ready(function() {
  var $slider = $('#maquina-destacada-1 .maquina-slider');
  var $slides = $slider.find('li');
  var current = 0;
  var timer;

  function showSlide(idx) {
    $slides.hide().eq(idx).fadeIn(700);
  }

  function nextSlide() {
    current = (current + 1) % $slides.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + $slides.length) % $slides.length;
    showSlide(current);
  }

  function startAuto() {
    timer = setInterval(nextSlide, 10000);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  // Init
  $slides.hide().eq(0).show();
  startAuto();

  $('#maquina-destacada-1 .maquina-slider-next').on('click', function(e) {
    e.preventDefault();
    stopAuto();
    nextSlide();
    startAuto();
  });

  $('#maquina-destacada-1 .maquina-slider-prev').on('click', function(e) {
    e.preventDefault();
    stopAuto();
    prevSlide();
    startAuto();
  });
});

// Set the slider container height to match the sibling content div
function setSliderHeight() {
  // Find the .maquina-description in the first column of the same row
  var $row = $('#maquina-destacada-1').closest('.row');
  var $desc = $row.find('.col-md-6 .maquina-description').first();
  var descH = $desc.outerHeight(true) || 0;
  if (descH > 0) {
    $('#maquina-destacada-1 .maquina-slider-wrapper').height(descH);
  }
  // Optionally, still center images vertically
  var maxH = 0;
  $('#maquina-destacada-1 .maquina-slider img').each(function() {
    var h = $(this).height();
    if (h > maxH) maxH = h;
  });
}

$(window).on('load resize', setSliderHeight);
$('#maquina-destacada-1 .maquina-slider img').on('load', setSliderHeight);

$(document).ready(function() {
  // Custom carousel slider for #sliderLightbox (5 images visible, translateX animation)
  var $slider = $('#sliderLightbox');
  if ($slider.length) {
    var visible = 5;
    var $slides = $slider.find('li');
    var total = $slides.length;
    var current = 0;
    var timer;

    // Wrap li elements in a track div for translation
    if ($slider.find('.slider-track').length === 0) {
      $slider.wrapInner('<div class="slider-track" style="display: flex; transition: transform 0.6s cubic-bezier(.4,0,.2,1);"></div>');
    }
    var $track = $slider.find('.slider-track');

    // Clone first 'visible' slides to the end for infinite loop
    $track.children('li').slice(0, visible).clone(true).appendTo($track);
    total = $track.children('li').length;

    // Set up slider width
    function updateSliderWidth() {
      var slideWidth = 100 / visible;
      $track.children('li').css({
        'flex': '0 0 ' + slideWidth + '%',
        'max-width': slideWidth + '%'
      });
    }
    updateSliderWidth();
    $(window).on('resize', updateSliderWidth);

    // Set initial position
    function setPosition(animate) {
      var slideWidth = $track.children('li').outerWidth(true);
      var moveX = -(current * slideWidth);
      if (animate) {
        $track.css({
          'transition': 'transform 0.6s cubic-bezier(.4,0,.2,1)',
          'transform': 'translateX(' + moveX + 'px)'
        });
      } else {
        $track.css({
          'transition': 'none',
          'transform': 'translateX(' + moveX + 'px)'
        });
      }
    }
    setPosition(false);

    function nextSlide() {
      current++;
      setPosition(true);
      if (current === total - visible + 1) {
        setTimeout(function() {
          $track.css('transition', 'none');
          current = 0;
          setPosition(false);
        }, 650);
      }
    }

    function prevSlide() {
      if (current === 0) {
        $track.css('transition', 'none');
        current = total - visible;
        setPosition(false);
        setTimeout(function() {
          current--;
          setPosition(true);
        }, 20);
      } else {
        current--;
        setPosition(true);
      }
    }

    function startAuto() {
      timer = setInterval(nextSlide, 4000);
    }
    function stopAuto() {
      clearInterval(timer);
    }

    // Chevrons
    

    $slider.parent().on('click', '.sliderLightbox-next', function(e) {
      e.preventDefault();
      stopAuto();
      nextSlide();
      startAuto();
    });
    $slider.parent().on('click', '.sliderLightbox-prev', function(e) {
      e.preventDefault();
      stopAuto();
      prevSlide();
      startAuto();
    });

    $slider.on('mouseenter', function() { stopAuto(); });
    $slider.on('mouseleave', function() { startAuto(); });

    startAuto();
  }
});

// Simple Before & After Slider
$(function() {
  $('.before-after-slider').each(function() {
    var $container = $(this);
    var $before = $container.find('img').eq(0);
    var $after = $container.find('img').eq(1);
    $container.css({position: 'relative', overflow: 'hidden'});
    $before.css({position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2});
    $after.css({position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1});
    var $bar = $('<div class="before-after-bar"></div>').css({
      position: 'absolute',
      top: 0,
      left: '50%',
      width: '4px',
      height: '100%',
      background: '#003C6E',
      zIndex: 3,
      cursor: 'ew-resize',
      borderRadius: '2px',
      boxShadow: '0 0 8px rgba(0,0,0,0.15)'
    });
    var $chevronLeft = $('<span class="before-after-chevron before-after-chevron-left" aria-hidden="true">&#x2039;</span>').css({
      position: 'absolute',
      left: '-18px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '22px',
      color: '#003C6E',
      zIndex: 4,
      pointerEvents: 'none',
      userSelect: 'none',
      fontWeight: 'bold',
      textShadow: '0 1px 4px #fff'
    });
    var $chevronRight = $('<span class="before-after-chevron before-after-chevron-right" aria-hidden="true">&#x203A;</span>').css({
      position: 'absolute',
      right: '-18px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '22px',
      color: '#003C6E',
      zIndex: 4,
      pointerEvents: 'none',
      userSelect: 'none',
      fontWeight: 'bold',
      textShadow: '0 1px 4px #fff'
    });
    $bar.append($chevronLeft, $chevronRight);
    var $label = $('<div class="before-after-label"></div>').css({
      position: 'absolute',
      left: '10px',
      bottom: '10px',
      color: '#fff',
      background: 'rgba(0,60,110,0.85)',
      padding: '4px 14px',
      borderRadius: '4px',
      fontWeight: 'bold',
      fontSize: '1.1em',
      zIndex: 10,
      pointerEvents: 'none',
      userSelect: 'none',
      letterSpacing: '1px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
    });
    $container.append($bar, $label);
    var dragging = false;
    var containerOffset, containerWidth;
    function setReveal(x) {
      var percent = Math.max(0, Math.min(1, x / containerWidth));
      $bar.css('left', (percent * 100) + '%');
      $before.css('clip-path', 'inset(0 ' + (100 - percent * 100) + '% 0 0)');
      // Show label
      if (percent > 0.6) {
        $label.text('Antes').show();
      } else if (percent < 0.4) {
        $label.text('Despues').show();
      } else {
        $label.hide();
      }
    }
    function startDrag(e) {
      dragging = true;
      containerOffset = $container.offset().left;
      containerWidth = $container.width();
      $(document).on('mousemove.beforeafter touchmove.beforeafter', onDrag);
      $(document).on('mouseup.beforeafter touchend.beforeafter', stopDrag);
    }
    function onDrag(e) {
      if (!dragging) return;
      var pageX = e.pageX || (e.originalEvent.touches && e.originalEvent.touches[0].pageX);
      var x = pageX - containerOffset;
      setReveal(x);
    }
    function stopDrag() {
      dragging = false;
      $(document).off('.beforeafter');
    }
    $bar.on('mousedown touchstart', startDrag);
    // Set initial position (50% reveal)
    $container.imagesLoaded ? $container.imagesLoaded(function(){
      containerWidth = $container.width();
      setReveal(containerWidth / 2);
    }) : setTimeout(function(){
      containerWidth = $container.width();
      setReveal(containerWidth / 2);
    }, 100);
    // Responsive
    $(window).on('resize', function() {
      containerWidth = $container.width();
      setReveal($bar.position().left);
    });
  });
});