$.fn.toggleClick = function(){
			var methods = arguments, // store the passed arguments for future reference
				count = methods.length; // cache the number of methods 

			//use return this to maintain jQuery chainability
			return this.each(function(index, item){
				index = 0; 
				$(item).click(function(){ 
					return methods[index++ % count].apply(this,arguments); // that when called will apply the 'index'th method to that element
					// the index % count means that we constrain our iterator between 0 and (count-1)
				});
			});
		};
		$('.show_ad').click(function(){
			$('.ad').removeClass('hide');
		
		});
		//size
		function update_width(){
			var $width = $('#size_width').val();
			$('.ad').css('width', $width);
			$('.td_size_width').text('Width: '+$width+'px');
		
		}
		function update_height(){
			var $height = $('#size_height').val();
			$('.ad').css('height', $height);
			$('.td_size_height').text('Height: '+$height+'px');
		}
		
		//position type
		function update_pos_type(obj) {
				
			var type = obj.value;
			if(type !== 'relative'){
				$('.pos_val_panel').css({'height':'45px', 'opacity': 1});
			} else {
				$('.pos_val_panel').css({'height':'0', 'opacity': 0});
			}
			$('.ad').css('position', type);
			$('.td_pos_type').text('Position Type: '+type);
		}
	
		//pos 
		function update_top(){
			var $top = $('#pos_top').val();
			$('.ad').css('top', $top+'px');
			$('.td_pos_top').text('Top: '+$top+'px');
		
		}
		function update_left(){
			var $left = $('#pos_left').val();
			$('.ad').css('left', $left+'px');
			$('.td_pos_left').text('Left: '+$left+'px');
		}
		
		//closable
		function update_closable(obj){
			var closable = obj.value;
			if(closable === 'true') {
				$('.ad').append('<div class="icon js-close cls absolute cls_corner"></div>');
				$('.js-close').click(function(){
					$(this).parent('.ad').addClass('hide');
				});
				$('.td_closable').text('Closable: Yes');
					
			} else if(closable === 'false') {
				if($('.ad .icon').hasClass('js-close')){
					$('.ad .icon').remove('.js-close');
				}
				$('.td_closable').text('Closable: No');
			}	
		}
	
		//fold-able
		function update_foldable(obj){
			var foldable = obj.value;
			if(foldable === 'true') {
				$('.ad').append('<div class="icon js-fold fold absolute fold_corner"></div>');
				var cur_height = $('.ad').height();
				$('.js-fold').toggleClick(function(){
					$(this).parent('.ad').addClass('folded trans');
					
					//$(this).parent('.ad').css({'height':'32px','fontSize':0, 'color':'transparent'});
				},
				function(){
					//$(this).parent('.ad').css({'height':cur_height+'px','fontSize':'20px', 'color':'#333'});
					$(this).parent('.ad').removeClass('folded trans');
				});
				$('.td_foldable').text('Foldable: Yes');
					
			} else if(foldable === 'false') {
				if($('.ad .icon').hasClass('js-fold')){
					$('.ad .icon').remove('.js-fold');
				}
				$('.td_foldable').text('Foldable: No');
			}	
		}
	
		//setTime
		function update_timer(obj) {
			var timer = obj.value;
			if(timer === 'true'){
				
				$('.timer_panel').css({'height':'50px', 'opacity': 1});
				$('.ad').append('<div class="icon js-timer timer absolute timer_corner"></div>');
				$('.js-timer').click(function(){
					var setTime = $('.setTime').val(), self = $(this);//setTimeout refer to global scope.
					setTimeout(function(){
						self.parent('.ad').addClass('hide');
					}, setTime);
				});
			} else {
				$('.timer_panel').css({'height':'0', 'opacity': 0});
				$('.ad .icon').remove('.js-timer');
			}
			
			$('.td_action').text('setTimer: '+timer);
		}
		
		function update_time(){
			var $setTime = $('.setTime').val();
			$('.td_time').text('Time: '+$setTime+'ms');
		
		}