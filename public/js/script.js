//here all vue stuff

Vue.component('big-image', {
    props: ['image'], //what this function expects
    data: function() {

        return {
            title: '',
            description: '',
            comments:''


        }
    },
    mounted: function() { //the html is ready
        console.log("vue.component:", this.image);
        const selectedImageId = this.image
        axios.get('/bigImage/' + selectedImageId)
            .then(response => {
                console.log("response:",response);
            })
            .catch(err => console.log("error in mounted", err))
    },
});

const app = new Vue({
            el: '#main', //attach the vue instance to the main id tag
            data: {
                images: [],
                formStuff: {
                    title: '',
                    description: '',
                    username: '',
                    file: '',

                },
                currentSelectedImage: ''
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
                showImage : function(imageId) {
                    this.currentSelectedImage = imageId
                    console.log("image id:", imageId);  // gives us the id of the image that was selected
                },

                chooseFile: function(e) {
                    console.log("chooseFile running")
                    this.formStuff.file = e.target.files[0] //user chose a file
                }

            },

            mounted: function() {  //html done uploading
                const vueInstance = this;
                axios.get('/images')
                    .then(response => {
                        vueInstance.images = response.data.images
                        console.log("vueInstance.images", vueInstance.images);
                    })
                    .catch(err => console.log("error in mounted", err))

            },


        });
