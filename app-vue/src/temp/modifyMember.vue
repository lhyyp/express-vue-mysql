<template>
<div>
    <div class="demo-upload-list" v-for="item in uploadList">
        <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
        </template>
        <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
    </div>
    <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"      
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        action="/api/admin/portrait"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="camera" size="20"></Icon>
        </div>
    </Upload>
    <Modal title="可爱的竹子" v-model="visible" class-name='zIndex'>
        <img :src="'/upload/' + imgName " v-if="visible" style="width: 100%">
    </Modal>

</div>
</template>
<script>
    export default {
        data () {
            return {
                defaultList: [          //默认已上传的文件列表，例如：
                     {
                        'name': 'img.jpg',
                        'url': '/upload/img.jpg'
                    }
                ],
                imgName: '',
                visible: false,
                uploadList: []
            }
        },
        methods: {
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {      //文件上传成功时的钩子，返回字段为 response, file, fileList
                this.uploadList = [];                  //清空上传的uploadList
                this.uploadList.push(file);            //把上传的file文件push进uploadList 数组中
                this.$refs.upload.fileList = this.uploadList ;    //把data中的uploadList赋值给上传组件中的上传记录fileList  
                file.url = '/upload/'+res.src;
                file.name = res.src;
                
            },
            handleFormatError (file) {            //文件格式验证失败时的钩子，返回字段为 file, fileList
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {          //文件超出指定大小限制时的钩子，返回字段为 file, fileList
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleBeforeUpload () {         //上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
               
                return check;
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
    }
</script>
<style>
.zIndex{z-index: 2000}
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
