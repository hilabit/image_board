//here all vue stuff

Vue.component('big-image', {
    props: ['imageid'], //what this function expects
    data: function() {
        return {
            image: null, //accepts an entire image object
            comments: null,
            formField: {
                username:'',
                text:'',

            }
        }
    },
    methods:{
        submitComment: function() {

            axios.post('/inputField', {
            "username":this.formField.username,
            "text":this.formField.text,
            "imageid":this.imageid
            }).then(response => {
                console.log("username:", username);
                addCommentToDatabase(comment, imageid)
            })
        }
    },

    template: '#comments',

    mounted: function() { //the html is ready
        console.log("vue.component:", this.imageid);
        const selectedImageId = this.imageid
        const component = this; //the component loses its scope, we'd have to define it
        axios.get('/bigImage/' + selectedImageId)
            .then(response => { //the query results
                console.log("response:",response);
                component.image = response.data.image
                console.log("component.image:",component.image);
            })
            .catch(err => console.log("error in mounted", err))
    }

}); //END of VUE.COMPONENT

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
