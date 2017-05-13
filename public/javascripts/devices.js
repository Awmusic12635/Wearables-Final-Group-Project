
    $('#removeDevice').click(function(event) {
        console.log('yo');
        event.preventDefault(); // Stops browser from navigating away from page

        var data;
        var id = $('#removeDevice').val();
        console.log(id);
        var url = '/devices/remove/' + id;

        $.post(url, data, function(response) {
           window.location.reload();
        });
    });

