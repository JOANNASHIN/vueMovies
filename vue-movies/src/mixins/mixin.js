import Vue from "vue";

//prototypes
Vue.prototype.baseImageUrl = "https://image.tmdb.org/t/p/w500";

const mixin = {
    data() {
        return {
        }
    },

    computed: {
    },

    methods: {
        getMultiParams(_selected) {
            let _params = "";

            if (_selected && _selected.length) {
                _selected.forEach((v, index) => {
                    _params += `${v}${index == _selected.length - 1 ? '' : '|'}`
                });
            }
            return _params;
        }
    },

    filters: {
        toUpperCase(value) {
            return value ? value.toUpperCase() : "";
        }
    }
}

export default mixin;