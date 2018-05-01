// window.scrollTo(0, 1);

// window.addEventListener("load", function() {
//     setTimeout(function(){
//         window.scrollTo(0, 1);
//     }, 0);
// });

// document.body.addEventListener('touchmove', function(event) {
//     event.preventDefault();
// });

const ObjectionStrings = [
    'What is going on with AstraZeneca, are you in the asthma market to stay?',
    'Has AstraZeneca filed the Biologics Licensing Agreement (BLA) with the FDA? And if so, when does AZ plan to launch?',
    'Which drug are you promoting?',
    'Tell me more about the source of the 50% statistic. I don’t believe 50% of my patients with severe asthma have eosinophilic asthma.',
    'Regular use of oral corticosteroids is fine and they’re just part of treating asthma.',
    'Why is it important for me to know the source of my patients’ asthma?',
    'What is the role of natural killer (NK) cells?'
];

$(".btn-objection").on('click', function() {
    var lengthOfObjections = ObjectionStrings.length;
    var randomNumber = Math.floor(Math.random() * lengthOfObjections);
    $(".objection-text").text(ObjectionStrings[randomNumber]);
})

$(".red-btn-div").click(function(){
    imgElement = $(this).children('img')[0];
    if (imgElement.src.split('/').slice(-1)[0] == 'circle.png') {

        $(this).closest('tr').find('td').each(function(index, td) {
            if (index == 0) return;

            tmpImg = $(td).children().first().children('img')[0];
            tmpImg.src = tmpImg.src.replace('circle_down.png', 'circle.png');
        });

        imgElement.src = imgElement.src.replace('circle.png', 'circle_down.png');
    }
    else {
        imgElement.src = imgElement.src.replace('circle_down.png', 'circle.png');
    }
});


$(".bl-btn-reset").click(function(){
    $.each($('.red-btn-div'), function(index, item) {
        imgElement = item.children[0];
        imgElement.src = imgElement.src.replace('circle_down.png', 'circle.png');
    });
});

$('#main-return-btn').on('click', function() {
    window.location.href = "../index.html";
});


/*--------------------------------------   Slider --------------------------------*/

let fixedViewerWidth = 898;
let fixedViewerHeight = 673;
/*
the images preload plugin
*/
    (function($) {
        $.fn.preload = function(options) {
            var opts 	= $.extend({}, $.fn.preload.defaults, options);
            o			= $.meta ? $.extend({}, opts, this.data()) : opts;
            var c		= this.length,
                l		= 0;
            return this.each(function() {
                var $i	= $(this);
                $('<img/>').load(function(i){
                    ++l;
                    if(l == c) o.onComplete();
                }).attr('src',$i.attr('src'));	
            });
        };
        $.fn.preload.defaults = {
            onComplete	: function(){return false;}
        };
    })(jQuery);

    $(function() {
        var $tf_bg				= $('#tf_bg'),
            $tf_bg_images		= $tf_bg.find('img'),
            $tf_bg_img			= $tf_bg_images.eq(0),
            $tf_thumbs			= $('#tf_thumbs'),
            total				= $tf_bg_images.length,
            current				= 0,
            $tf_content_wrapper	= $('#tf_content_wrapper'),
            $tf_next			= $('#tf_next'),
            $tf_prev			= $('#tf_prev'),
            $tf_loading			= $('#tf_loading');
        
        //preload the images				
        $tf_bg_images.preload({
            onComplete	: function(){
                $tf_loading.hide();
                init();
            }
        });
        
        //shows the first image and initializes events
        function init(){
            //get dimentions for the image, based on the windows size
            var dim	= getImageDim($tf_bg_img);
            //set the returned values and show the image
            $tf_bg_img.css({
                width	: 898,
                height	: 673,
                left	: 0,
                top		: 0
            }).fadeIn();
        
            //resizing the window resizes the $tf_bg_img
            $(window).bind('resize',function(){
                var dim	= getImageDim($tf_bg_img);
                $tf_bg_img.css({
                    width	: dim.width,
                    height	: dim.height,
                    left	: dim.left,
                    top		: dim.top
                });
            });
           
            //click the arrow down, scrolls down
            $tf_next.bind('click',function(){
                if($tf_bg_img.is(':animated'))
                    return false;
                scroll('tb');
            });
            
            //click the arrow up, scrolls up
            $tf_prev.bind('click',function(){
                if($tf_bg_img.is(':animated'))
                    return false;
                scroll('bt');
            });

            //Initially disable the prev button
            $tf_prev.addClass('tf-nextprev-inactive');

            //Check if next is available
            if (total <= 1) $tf_next.addClass('tf-nextprev-inactive');
            else $tf_next.addClass('tf-nextprev-active');
        }
        
        //show next / prev image
        function scroll(dir){
            //if dir is "tb" (top -> bottom) increment current, 
            //else if "bt" decrement it
            current	= (dir == 'tb')?current + 1:current - 1;
            
            // if(current == total) current = 0;
            // else if(current < 0) current = total - 1;
            if(current + 1 >= total) $tf_next.addClass('tf-nextprev-inactive').removeClass('tf-nextprev-active');
            else $tf_next.addClass('tf-nextprev-active').removeClass('tf-nextprev-inactive');

            if(current - 1 < 0) $tf_prev.addClass('tf-nextprev-inactive').removeClass('tf-nextprev-active');
            else $tf_prev.addClass('tf-nextprev-active').removeClass('tf-nextprev-inactive');
            
            //we get the next image
            var $tf_bg_img_next	= $tf_bg_images.eq(current),
                //its dimentions
                dim				= getImageDim($tf_bg_img_next),
                //the top should be one that makes the image out of the viewport
                //the image should be positioned up or down depending on the direction
                top	= (dir == 'tb')?fixedViewerHeight + 'px':-parseFloat(dim.height,10) + 'px';
                    
            //set the returned values and show the next image	
                $tf_bg_img_next.css({
                    width	: dim.width,
                    height	: dim.height,
                    left	: dim.left,
                    top		: top
                }).show();
                
            //now slide it to the viewport
                $tf_bg_img_next.stop().animate({
                    top 	: dim.top
                },1000);
                
            //we want the old image to slide in the same direction, out of the viewport
                var slideTo	= (dir == 'tb')?-$tf_bg_img.height() + 'px':fixedViewerHeight + 'px';
                $tf_bg_img.stop().animate({
                    top 	: slideTo
                },1000,function(){
                //hide it
                    $(this).hide();
                //the $tf_bg_img is now the shown image
                    $tf_bg_img	= $tf_bg_img_next;
                //show the description for the new image
                    $tf_content_wrapper.children()
                                        .eq(current)
                                        .show();
        });
            //hide the current description	
                $tf_content_wrapper.children(':visible')
                                    .hide()
        
        }
        
        //animate the image to fit in the viewport
        function resize($img){
            var w_w	= fixedViewerWidth,//$(window).width(),
                w_h	= fixedViewerHeight,//$(window).height(),
                i_w	= $img.width(),
                i_h	= $img.height(),
                r_i	= i_h / i_w,
                new_w,new_h;
            
            if(i_w > i_h){
                new_w	= w_w;
                new_h	= w_w * r_i;
                
                if(new_h > w_h){
                    new_h	= w_h;
                    new_w	= w_h / r_i;
                }
            }	
            else{
                new_h	= w_w * r_i;
                new_w	= w_w;
            }
            
            $img.animate({
                width	: new_w + 'px',
                height	: new_h + 'px',
                top		: '0px',
                left	: '0px'
            },350);
        }
        
        //get dimentions of the image, 
        //in order to make it full size and centered
        function getImageDim($img){
            var w_w	= fixedViewerWidth,//$(window).width(),
                w_h	= fixedViewerHeight,//$(window).height(),
                r_w	= w_h / w_w,
                i_w	= $img.width(),
                i_h	= $img.height(),
                r_i	= i_h / i_w,
                new_w,new_h,
                new_left,new_top;
            
            if(r_w > r_i){
                new_h	= w_h;
                new_w	= w_h / r_i;
            }
            else{
                new_h	= w_w * r_i;
                new_w	= w_w;
            }


            return {
                width	: new_w + 'px',
                height	: new_h + 'px',
                left	: (w_w - new_w) / 2 + 'px',
                top		: (w_h - new_h) / 2 + 'px'
            };
            }
    });