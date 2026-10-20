# T6
(一开始没有写md的习惯，这个题写了大半才想起来,也是在梳理自己的思路)<br>
（这个题起步的时候可能有点穷举的意思，写得很史山，走一步算一步，很难梳理）<br>

### 作答思路：

1.接api，得字符串<br>
2.把字符串接到设好的方框里<br>
3.根据字符串信息在方框里渲染<br>
4.写排序<br>

实操还是更喜欢axios和fetch,axios在github上整的。<br>
最大问题：各个函数的写作顺序（毕竟JS是单线程）：onload，异步，render，api字符串转可用数字。<br>


### 对各元素的拆解（city cities都乱得要穷举了）
很乱很乱。<br>
fetch获取数据，传给r（覆盖），然后给map,拿去render,最后走。
### 为什么选择异步编程？

接api用异步编程，总不能让它卡死吧？<br>
但温度转数字必须丢进异步里边，因为它是只有api跑对了才能往下跑，不然只能空转了。<br>
因此render()的位置也没关系，反正异步是后跑的。<br>
windows.onload的理解：<br>
它是等别的东西全解析完了才跑。其实它的位置关系不大。<br>

### 排序难题
用Map弄下来的city和temperature都是字符串形式，带引号的。<br>
weather的话配一个correct_order,把天气跟数字对上，sort处理。<br>
temperature应该在请求完成前parseInt转为整数。<br>
先后顺序？？？<br>
<mark>我有个想法……已知请求到的温度为整数。那么，我给天气变成零点几的小数一起加/减？只用一个数比较？这样简单很多，不用二次循环了。</mark>
感觉有点赖皮，但绝对正确！<br>
sort方法会改变原数组，而数组元素顺序是和卡片绑死的。临时学的。<br>

ds又整了个元组的写法，应该更符合要求。<br>

```JavaScript
    function render(){
    cities.forEach((city, index) => {
             const container=document.getElementById(`weather-box${index+1}`);
             const weatherData = weatherMap.get(city);
             if (weatherData) {
                 container.innerHTML = `${weatherData.city}<br>${weatherData.weather}<br>${weatherData.temperature}°C`;
                 container.style.background = weathercolors[weatherData.weather] || "linear-gradient(45deg, #20b7d5, orange)";
             }
             else{
                 container.innerHTML = "Loading...";
             }

        });
    }
```

### 其它小问题
##### 1
我把JSON理解成了特殊的字符串，把它用map拆掉了。<br>
选择了批量处理，不然分着写七个很头大<br>
##### 2
总是403报错，不是语法问题，让AI改它只会隔离。
