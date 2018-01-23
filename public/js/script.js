//here all vue stuff

const app = new Vue({
    el: '#main',  //attach the vue instance to the main id tag
    data: {
        formStuff: {
            title: '',
            description: '',

        },
        images: []
    },
    mounted: function() {
        const vueInstance = this
        axios.get('/images')
            .then(response => {
                vueInstance.images = response.data.images
                console.log("vueInstance.images",vueInstance.images);
            })
            .catch(err => console.log("error in mounted", err))
    }
});
