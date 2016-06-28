//USED FOR THE HAMB MENU
$('#hamb-menu').on("click", function(){
    $(this).toggleClass('open');
    $('.overlay').toggleClass('open');
});

$('.redirect').on("click", function(){
    $('#hamb-menu').toggleClass('open');
    $('.overlay').toggleClass('open');
});