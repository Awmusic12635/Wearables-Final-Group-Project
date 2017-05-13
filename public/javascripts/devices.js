
$('.addToCart').on('click',function(){
    var device_id = $(this).data('id');
    $.get( "/checkout/add/"+device_id);
});
