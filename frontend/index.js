import { jwtDecode } from "jwt-decode";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE5ODIwMTMzLCJpYXQiOjE3MTk4MTk4MzMsImp0aSI6ImM2YTBjOGY5ZGQwZDQ1Yzc5YWI0MWEwMmE0Y2FlN2M5IiwidXNlcl9pZCI6Mn0.pzwLzMWzOGM6x57D8lMAZSn21Wy04y8UlEGJxlsY-zk"

const data = jwtDecode(token)
const expired = data.exp
const now = Date.now() / 1000

if(expired < now){
    console.log(`token is done for today ${now}`)
}
else{
    console.log("token is still active mn")
}

console.log(data)