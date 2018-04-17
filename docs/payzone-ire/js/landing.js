
// Nav
$(".landing-nav-ham").on("click", function(){
	$(".landing-nav-ham").toggleClass('open');
	$(".landing-nav").toggleClass('open');
});


// Slider Hero
var swiper = new Swiper('.landing-hero-slider', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});



// Slider Bill Providers
var swiperBillProviders = new Swiper('.landing-bill-providers-slider', {
  	slidesPerView: 6,
  	slidesPerGroup: 6,
  	spaceBetween: 0,
  	navigation: {
    	nextEl: '.swiper-button-next',
    	prevEl: '.swiper-button-prev',
	},
      breakpoints: {
        1100: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 0,
        },
        800: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 0,
        },
        640: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 0,
        }
      }
});


// Pay a bill now dropdown
/*
$("#payBillNow").on("click", function () {
	$(".landing-pay-a-bill-now .landing-button").toggleClass('active');
	$(".landing-pay-a-bill-now-dropdown").toggleClass('open');
});
*/