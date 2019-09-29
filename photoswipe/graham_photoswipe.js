(function($) {
    var $pswp = $('.pswp')[0];
    var image = [];

    $('.picture').each( function() {
        var $pic     = $(this),
            getItems = function() {
                var items = [];
                $pic.find('a').each(function() {
                    var $href   = $(this).attr('href'),
                        $size   = $(this).data('size').split('x'),
                        $width  = $size[0],
                        $height = $size[1],
						$title   = $(this).data('title');
						$index = parseInt($(this).data('index'));

                    var item = {
                        src : $href,
                        w   : $width,
                        h   : $height,
						title: $title,
						index: $index 
                    }

                    items.push(item);
                });
                return items.sort((a, b) => (a.index > b.index) ? 1 : -1);
            }

        var items = getItems();

        $.each(items, function(index, value) {
            image[index]     = new Image();
            image[index].src = value['src'];
        });

        $pic.on('click', 'figure', function(event) {
            event.preventDefault();

            var $index = parseInt(this.children[0].getAttribute('data-index'))
            var options = {

                index: $index,
                bgOpacity: 0.7,
                showHideOpacity: true,


				// Function builds caption markup
				addCaptionHTMLFn: function(item, captionEl, isFake) {
					// item      - slide object
					// captionEl - caption DOM element
					// isFake    - true when content is added to fake caption container
					//             (used to get size of next or previous caption)

					if(!item.title) {
						captionEl.children[0].innerHTML = '';
						return false;
					}
					captionEl.children[0].innerHTML = item.title;
					return true;
				},


            }

			// initialise as usual
			var gallery = new PhotoSwipe( $pswp, PhotoSwipeUI_Default, items, options);

			// create variable that will store real size of viewport
			var realViewportWidth,
				useLargeImages = false,
				firstResize = true,
				imageSrcWillChange;

			// beforeResize event fires each time size of gallery viewport updates
			gallery.listen('beforeResize', function() {
				// gallery.viewportSize.x - width of PhotoSwipe viewport
				// gallery.viewportSize.y - height of PhotoSwipe viewport
				// window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
				//                          1 (regular display), 2 (@2x, retina) ...


				// calculate real pixels when size changes
				realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;

				// Code below is needed if you want image to switch dynamically on window.resize

				// Find out if current images need to be changed
				if(useLargeImages && realViewportWidth < 1000) {
					useLargeImages = false;
					imageSrcWillChange = true;
				} else if(!useLargeImages && realViewportWidth >= 1000) {
					useLargeImages = true;
					imageSrcWillChange = true;
				}

				// Invalidate items only when source is changed and when it's not the first update
				if(imageSrcWillChange && !firstResize) {
					// invalidateCurrItems sets a flag on slides that are in DOM,
					// which will force update of content (image) on window.resize.
					gallery.invalidateCurrItems();
				}

				if(firstResize) {
					firstResize = false;
				}

				imageSrcWillChange = false;

			});


			// Note that init() method is called after gettingData event is bound
			gallery.init();

            //var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
            //lightBox.init();
        });
    });
})(jQuery);