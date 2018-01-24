//here all vue stuff

const app = new Vue({
            el: '#main', //attach the vue instance to the main id tag
            data: {
                images: [],
                formStuff: {
                    title: '',
                    description: '',
                    username: '',
                    file: null
                }
            },
            methods: {
                uploadFile: function() {
                    console.log("uploadFile running");
                    const formData = new FormData();
                    formData.append('file', this.formStuff.file)
                    formData.append('title', this.formStuff.title)
                    formData.append('description', this.formStuff.description)
                    formData.append('username', this.formStuff.username)

                    axios.post('/upload-image', formData) //should have the same name as my post request
                        .then(result => {
                            console.log("in axios.post", result);
                        });



                },

                chooseFile: function(e) {
                    console.log("chooseFile running")
                    this.formStuff.file = e.target.files[0]
                }

            },

            mounted: function() {
                const vueInstance = this;
                axios.get('/images')
                    .then(response => {
                        vueInstance.images = response.data.images
                        console.log("vueInstance.images", vueInstance.images);
                    })
                    .catch(err => console.log("error in mounted", err))

            }
        });

        Vue.component('big-image', {
    /* data, methods, etc. go here */
});
