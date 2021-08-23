jQuery(document).ready(function(){
    //Datepicker 
   // jQuery('.datepicker').datepicker({ });

    //Home page List Option script
    jQuery('.list-slider-wrapper').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 569,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
    }); 

    // Testimonials Slider Script
    $('.testimonial-slider').slick({
        dots: false,
        infinite: true,
        speed: 500, 
        arrows: true
    });
          

});

