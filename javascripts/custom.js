// Scroll index page
$(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
        $('#navbar.floating').fadeIn().addClass('fixed');
    } else {
        $('#navbar.floating').removeClass('fixed')
    }
});

$(function () {
    $('#contact').on('submit', function (event) {
        event.preventDefault();
        var nameForm = $('input#name').val();
        var emailForm = $('input#email').val();
        var messageForm = $('textarea#message').val();
        $.ajax({
            url: '/contacts',
            type: 'post',
            dataType: 'json',
            data: {email_form: emailForm, name_form: nameForm, message_form: messageForm},
            success: function (result) {
                $('.name-error, .email-error, .message-error').empty();
                $('.form-field').removeClass('error');
                if (result.falture) {
                    if (result.errors.name) {
                        $('.name').addClass('error');
                        $('.name-error').html(result.errors.name);
                    }
                    if (result.errors.email) {
                        $('.email').addClass('error');
                        $('.email-error').html(result.errors.email);
                    }
                    if (result.errors.content) {
                        $('.message').addClass('error');
                        $('.message-error').html(result.errors.content);
                    }
                } else {
                    $('#name, #email, #message').val('');
                    var button = $('#submit');
                    button.removeClass('btn-primary').addClass('btn-success').html(button.data('send'));
                }
            }
        });
    });

    // Scroll
    $('body').scrollspy({target: '.navbar', offset: 70});
    $('a[href*=#]:not([href=#])').click(function(e) {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            e.preventDefault();
            var target = $(this.hash);
            var id = target.attr('id');
            target.removeAttr('id');
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').stop().animate({
                    scrollTop: target.offset().top - 50
                }, 500);
                window.location.hash = this.hash.replace('#', '');
                target.attr('id', id);
            }
        }
    });

    // Map
    var $map = $('#map');
    if ($map.length) {
        var coordinates = new google.maps.LatLng($map.data('lat'), $map.data('lng'));
        var myOptions = {
            zoom: 16,
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false,
            center: coordinates,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        var map = new google.maps.Map($map.get(0), myOptions);
        new google.maps.Marker({
            map: map,
            position: coordinates
        });
        var timeout = null;
        $(window).resize(function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                map.setCenter(coordinates);
            }, 100);
        })
    }
});
