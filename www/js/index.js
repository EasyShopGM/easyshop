//Multiple
$(document).ready(function() {
  $('ul.block-grid-5 li.size').on('click', function(){
    $(this).toggleClass('active');
  });
});

//Single
$(document).ready(function() {
  $('ul.block-grid-20 li.size').on('click', function(){
    $('ul.block-grid-20 li.size').not(this).removeClass('active');    
    $(this).toggleClass('active');
  });
});