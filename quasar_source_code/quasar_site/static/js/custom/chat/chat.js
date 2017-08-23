$( document ).ready(function() {

    var textbox = $('#chat_input')


    $(document).keypress(function (e) {
        if (e.which == 13) {

            var text = textbox.val()

            if (text.length > 0) {
                $.ajax({
                    type: 'POST',
                    url: 'message',
                    data: {message: text}
                })
            }

            textbox.val('')

            e.stopPropagation()
        }
    })

    window.setInterval(function(){
        $.get( 'get_all_messages', function(data) {

            var obj = jQuery.parseJSON(data)

            // Set up a new list
            var $list = $('<ul></ul>')

            // Loop through the list array, adding an <li> for each list item
            for (var d in obj['data']) {
                $list.append('<li>' + d + '</li>')
            }

            // Replace the old element with the new list
            var $original = $('#basic_chat')
            $original.replaceWith( $list )
        })
    }, 5000)

})
