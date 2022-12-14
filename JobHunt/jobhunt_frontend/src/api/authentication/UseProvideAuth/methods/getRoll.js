import { api } from "../../../../config/apiConfig"
import { getLanguage, getToken } from "../../../../utils"
const _getRoll = async function (){
    const response =await api.get('/launch',{
        headers:{
            Lang:getLanguage(),
            Authorization:getToken()
        }
    })
    return  response.data.role || null
}
export {_getRoll}