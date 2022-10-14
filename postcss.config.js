module.exports={
    plugins:{
        'postcss-pxtorem': {
            rootValue: 76,
            propList: ['*'],
            exclude: /node_modules/
        }
    }
}