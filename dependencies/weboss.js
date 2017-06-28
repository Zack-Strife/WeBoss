$(document).ready(function(){
    $('.title').click(function(e){
        e.preventDefault();

        $('.title-div').hide();
        $('.loader-div').show();
    });

    $('.loader-div').click(function(){
        $('.title-div').show();
        $('.loader-div').hide();
    });
})