import axios from "axios";
import eventBus from "../utils/bus";

const network = {
    namespaced: "network",

    state: {
        apiKey: "9e53516286fe4f61d4ff891dd6d5750c",
        baseUrl: "https://api.themoviedb.org/3",
        requests: [],
    },

    actions: {
        createHeader() {
            return {}
        },

        convertFormData(context, data) {
			if(data instanceof FormData) return data;

			const formData = new FormData();
			
			for(let [key, value] of Object.entries(data)) {
				formData.append(key, value);
			}

			return formData;
		},

        //get방식 파라미터 생성
        makeGetParameter (context, params) {
            var value = "";
            
            for (var key in params) {
                value += `&${key}=${params[key]}`;
            }

            return value;
        },

        async request({state, dispatch, commit}, payload) {
            const { id, method, url, data, header, isPreviousCancel } = payload;
            
            let parameter = "";

            try {
                eventBus.$emit("start:spinner");

                if('get' === method) parameter = await dispatch('makeGetParameter', data);

                const requestParameters = {
                    method: method,
                    url: `${state.baseUrl}${url}?api_key=${state.apiKey}${parameter}&language=ko-KR|en-US`,
                    headers: header ? Object.assign(await dispatch("createHeader"), header) : await dispatch("createHeader"),
                    data: data ? await dispatch("convertFormData", data) : null,
                }

                const result = await axios(requestParameters);

                if (result && result.status && result.status == 200) return result.data;
                else throw({ message: result.statusText });
            }

            catch(ex) {
                console.error("network exception", ex);   
            }

            finally {
                setTimeout(() => {
                    eventBus.$emit("end:spinner");
                }, 200)
            }
        },
    },

    mutations: {

    },

    getters: {
        // requests: state => (id, url) => {
        //     return state.requests[`${id}-${url}`] || [];
        // }
    },
}

export default network;