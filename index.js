
//import required modules
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import moment from "moment";
//create instance of express
const app= express();
//set port number
const PORT = 1920;
//configure middlewares
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
//date and time function
function dateAndTimePicker(){
    var arr=[];
    var date=new Date();
    var day=date.getDay();
    var dayName=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var month=date.getMonth();
    var monthName=['January','February','March','April','May','June','July','August','September','October','November','December'];
    var year=date.getFullYear();

    const hours=date.getHours()
    const minutes=date.getMinutes()
    const seconds=date.getSeconds()
    const time=(`${hours}:${minutes}:${seconds}`)
    arr[0]=dayName[day]
    arr[1]=date.getDate();
    arr[2]=monthName[month]
    arr[3]=year;
    arr[4]=time;
    return arr;
}
app.get("/",(req,res)=>{
    res.render("index.ejs")
})
app.post("/weather",async (req,res)=>{
    const city=req.body.cityName;
    const ApiKey='22f9195b8d16a2662703f6b660300912';
    const ApiURL= `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${ApiKey}`
    var dateAndTime= dateAndTimePicker()
    try{
        const response=await axios.get(ApiURL)
        const data=response.data;
        const sunriseTime=moment.utc(data.sys.sunrise,'X').add(data.timezone,'seconds').format('HH:mm');
        const sunsetTime=moment.utc(data.sys.sunset,'X').add(data.timezone,'seconds').format('HH:mm');
        res.render("weather.ejs",{
            weatherData: data,
            date: dateAndTime,
            sunrise: sunriseTime,
            sunset:sunsetTime,
        })
    }catch(error){
        console.error("Error:",error.message)
        res.render("weather.ejs",{
            weatherData: null,
            date: dateAndTime,
            error:("Oops! Unable to fetch weather data: ",error.message)
        })
    }
})
app.listen(PORT,()=>{
    console.log("Server is running on the port no: ",+ PORT)
})
