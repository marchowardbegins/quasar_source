'use strict'

function Owner(username, password, home_world) {
    this.__init__(username, password, home_world)
}

/*
// Solution from https://stackoverflow.com/questions/3818193/how-to-add-number-of-days-to-todays-date
function get_today_with_n_days_offset(n) {
    var date = new Date()

    var result = new Date(date)
    result.setDate(result.getDate() + n)

    var day   = result.getDate()
    var month = result.getMonth() + 1
    var year  = result.getYear()
    return month + '/' + day + '/' + year.toString().replace('117', '2017')
}
*/

Owner.prototype = {

    home_world: null,

    username: null,
    password: null,

    loading_data: null,
    days_to_load: null,
    days_loaded: null,
    day_entities: null,

    days: null,

    // POST calls.
    get_entities_for_day: null,

    __init__: function(username, password, home_world) {
        this.username = username
        this.password = password
        this.home_world = home_world

        this.loading_data = true

        this.get_entities_for_day = new PostHelper('/get_entities_for_day')

        this.days = get_list_of_dates_consisting_of_this_and_next_week()
        for (var i = 0; i < this.days.length; i++) {
            this.get_entities_for_day.perform_post({'username': this.username, 'day': this.days[i]}, this.entities_loaded_for_day.bind(this))
        }

        // Delete once above loop has been found to be working.
        /*
        this.days = []
        this.days_to_load = 14

        // Get the offset so that we start on monday.
        var date = new Date()
        var day_offset = date.getDay()

        for (var i = 0; i < this.days_to_load; i++) {
            //console.log('Loading starting from monday of this week : ' + get_today_with_n_days_offset(i - day_offset + 1))
            this.get_entities_for_day.perform_post({'username': this.username, 'day': get_today_with_n_days_offset(i - day_offset + 1)}, this.entities_loaded_for_day.bind(this))
        }
        */
    },

    entities_loaded_for_day: function(data) {
        this.days_loaded++
        data = JSON.parse(data)

        //console.log('Got the following data back:')
        //console.log(data)

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                //console.log('Adding entity [' + key + ']' + '{' + data[key] + '}')

                var d = data[key]
                if (d.length > 0) {
                    //var entity_array = text.split(',')
                    for (var i = 0; i < d.length; i++) {
                        this.home_world.add_entity(d[i], key)
                    }
                }

            }
        }

        //console.log(' ')
    }

}
