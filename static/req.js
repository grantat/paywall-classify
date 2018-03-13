function formatResponse(data){
    // reset label section
    $(".label-sect").html("");
    var html_out = "";

    for(var i in data){
        var image = data[i]["image"];
        // format from: https://github.com/froala/design-blocks/blob/dev/dist/features.html#L176
        var html_row = '<section class=""><div class="container"><div class="row align-items-center"><div class="col-12 col-lg-6 col-xl-5"><p class="text-h3"><a href="'+ data[i]["uri"] +'" target="_blank">'+ data[i]["uri"] +'</a></p><div class="row pt-4 pt-xl-5"><div class="col-12 col-md-5"><h4><strong>Paywall Page</strong></h4><p>'+ data[i]["paywall page"] +'</p></div><div class="col-12 col-md-5 m-auto pt-3 pt-md-0"><h4><strong>Content page</strong></h4><p>' + data[i]["content page"] +'</p></div></div></div><div class="col-12 col-md-8 col-lg-6 m-auto mr-lg-0 ml-lg-auto pt-5 pt-lg-0"><img alt="image" class="img-fluid" src="'+ image +'"></div></div></div></section><hr />';
        html_out += html_row;
    }
    $('.loader').hide();
    $( ".label-sect" ).html(html_out);
    $('input#submitButton, .tarea').prop('disabled', false);
}

$(function() {
    $('input#submitButton').click( function(){
        var formData = JSON.stringify($("#subform").serializeArray());
        $('#submitButton, .tarea').prop('disabled', true);
        $('.loader').show();
        $.ajax({
            url:'/classify',
            type:'post',
            contentType: 'application/json;charset=UTF-8',
            data: formData,
            success: function(d){
                formatResponse(d);
            }
        });
    });
})
