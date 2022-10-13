const _ = require('lodash');
const { User } = require('./users')
const Enum = require('../common/enum')
//101
exports.wellcome = async (req, res, next) => {
    try {
        req.answer = "Welcome to BE SOLUTIONS";
        req.status = 200;
        next();
    } catch (err) {
        next(err);
    }
};
//array
//bubble sort
exports.sort = async(req,res,next)=>{
    try{
        const array = JSON.parse(req.body.array)
        for( let i = 0; i<array.length; i++){
            for ( let j = i+1; j<array.length; j++ ){
                if( array[i] > array[j] ){
                    array[i] += array[j]
                    array[j] = array[i] - array[j]
                    array[i] = array[i] - array[j]
                }
            }
        }
        req.array = array
        next()
    }catch(err){
        next(err)
    }
}
exports.remove_duplicate = async(req,res,next)=>{
    try {
        const { array } = req
        const resultArray = array.filter((element,index) => array.indexOf(element) == index)
        req.array = resultArray
        next()
    } catch (error) {
        next(error)
    }
}

//users
//get user by id
exports.get_user_by_id = async(req,res,next)=>{
    try {
        const { id } = req.params
        const user = User.find(element => element.Id == id)
        res.json(
            user ? user : {mess:'user not found'}
        )
    } catch (error) {
        next(error)
    }
}
exports.update_user = async(req,res,next)=>{
    try {
        const { id } = req.params
        const data = req.body
        const errArr = []
        for (const key in data) {
            //key trong body phai giong key cua Regex
            Validator(data[key],Enum.Regex[key],errArr,key)
        }
        if(errArr.length){
            res.json({typeErr:errArr})
        }
        const user = User.find(element => element.Id == id)
        user.Name = data.Name
        user.Email = data.Email
        user.Phone = data.Phone
        res.json({mess:'updated',user})
    } catch (error) {
        next(error)
    }
}
function Validator(field,regex,errArr,key){
    if(!regex.test(field) || !field)
        errArr.push(`${key} type error`)
    return  errArr
}