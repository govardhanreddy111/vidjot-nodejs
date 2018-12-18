if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI : 'mongodb://govardhan:weyvtest1@ds051645.mlab.com:51645/vidjot-prod'
    }
}else{
    module.exports = {
        mongoURI: 'mongodb://localhost:27017/vidjot-dev'
    }
}