

    let weatherMap=new Map();
    const weather = ["晴", "多云", "阴","雾","阵雨","小雨","雷阵雨","小雪","中雨","中雪","大雨","大雪",];
    const correct_order={晴:1, 多云:2,阴:3,雾:4 ,阵雨:5, 小雨:6,雷阵雨:7, 小雪:8,中雨:9,中雪:10,大雨:11,大雪:12,};
    const cities=["北京","上海","广州","深圳","南京","杭州","成都"];
    let viewCities=[...cities];
    let currentScore=0;
    const weathercolors={
        "晴":"linear-gradient(45deg, #1accf0, orange)",
        "多云":"linear-gradient(45deg, rgb(207, 219, 227), #1ac3e5)",
        "阴":"linear-gradient(45deg, #7f8c8d, rgb(207, 219, 227))",
        "雾":"linear-gradient(180deg, #7f8c8d, rgb(207, 219, 227))",     
        "阵雨":"linear-gradient(180deg, #3498db, #8dc2e4)",
        "小雨":"linear-gradient(180deg, #3498db, #2980b9)",
        "雷阵雨":"linear-gradient(180deg, #0a3453, #8dc2e4)",
        "小雪":"linear-gradient(180deg, #a4d8f0, #85c1e9)",
        "中雨":"linear-gradient(180deg, #2980b9, #1c5380)",
        "中雪":"linear-gradient(180deg, #7fb3d5, #3498db)",
        "大雨":"linear-gradient(180deg, #1f618d, #154360)",
        "大雪":"linear-gradient(180deg, #5499c7, #2980b9)",
    }




    async function fetchWeather(){
        const ins=axios.create({
            baseURL:'https://api.seniverse.com/v3/weather'
        })
        const key="SWJEEWD_M17tT3zGk";
        
        try{
            render();
            const promises=cities.map(city=>{
                return ins.get(`/now.json?key=${key}&location=${encodeURIComponent(city)}&language=zh-Hans&unit=c`);
            });
            const results = await Promise.all(promises);
            results.forEach((res,i)=>{
                const r=res.data.results[0];
                weatherMap.set(cities[i],{
                    city:r.location.name,
                    weather:r.now.text,
                    temperature:parseInt(r.now.temperature,10)
                });
            });
            if(currentScore){
                setorder(currentScore);
            }
            else{
                render();
            }
        } catch (err) {
            console.error("fail to gain data",err);
        }
    }
    
    // function setorder(dir){
    //     sortDir=dir;
    //     viewCities=[...cities].sort((a,b)=>{
    //         const da=weatherMap.get(a);
    //         const db=weatherMap.get(b);
    //         if(!da&&!db) return 0;
    //         if(!da) return 1;
    //         if(!db) return -1;
    //         return dir*(da.temperature-db.temperature)
    //             || (correct_order[da.weather]??999)-(correct_order[db.weather]??999);
    //     });
    //     render();
    // }

    function score1(city){
        const c=weatherMap.get(city);
        if(!c) return NaN;
        return c.temperature+(correct_order[c.weather]??999)*0.01;
    }

    function score2(city){
        const c=weatherMap.get(city);
        if(!c) return NaN;
        return -(c.temperature+(correct_order[c.weather]??999)*0.01);
    }

    function setorder(getScore){
        currentScore=getScore;
        viewCities=[...cities].sort((a,b)=>{
            const sa=getScore(a);
            const sb=getScore(b);
            const aOk=Number.isFinite(sa);
            const bOk=Number.isFinite(sb);
            if(!aOk&&!bOk) return 0;
            if(!aOk) return 1;
            if(!bOk) return -1;
            return sa-sb;
        });
        render();
    }

     function render(){
        viewCities.forEach((city, index) => {
             const container=document.getElementById(`weather-box${index+1}`);
             const weatherData = weatherMap.get(city);
             if (weatherData) {
                 container.innerHTML = `${weatherData.city}<br>${weatherData.weather}<br>${weatherData.temperature}°C`;
                 container.style.background = weathercolors[weatherData.weather] || "linear-gradient(45deg, #20b7d5, orange)";
             }
             else{
                 container.innerHTML = "Loading...";
                 container.style.background = "";
             }

        });
    }

   

    window.onload = function(){
        // document.querySelector("#ascend").addEventListener("click",()=>setorder(1));
        // document.querySelector("#descend").addEventListener("click",()=>setorder(-1));
        document.querySelector("#ascend").addEventListener("click",()=>setorder(score1));
        document.querySelector("#descend").addEventListener("click",()=>setorder(score2));
        fetchWeather();
    }
    // prveBtn.addEventListener('click',function(){
    //     items[index].className='';
    //     if(index==0){
    //         index=items.length;
    //     }
    //     index--;
    //     items[index].className='active';
    // })
    

    //1.求api
    //2.转数组
    //3.转卡片
    //4.排序