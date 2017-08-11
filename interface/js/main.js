new Vue({
    el: '#vue',
    data: {
        message: '',
        items: null,
    },
    created: function () {
        this.fetchData();
    },

    methods: {
        fetchData: function () {
            var self = this;
            $.get( '../Ajax/events.json', function( data ) {
                self.items = data;
                console.log(data);
            });
        }
    }
})


