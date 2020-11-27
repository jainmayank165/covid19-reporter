
import React,{useState,useEffect} from 'react'
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';
const options={
legend:{
    display:false,
    labels: {
        fontColor: 'orange'
       }
},
    elements:{
        point:{
            radius:0,
        },
    },
    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect:false,
        callback:{
            
            label:function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0.0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    format:"MM/DD/YY",
                    tooltipFormat:"ll",
                    
                },
                ticks: {
                    beginAtZero:true,
                    fontColor: '#e0e1dd'
                },
            },
        ],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
            ticks:{
                fontColor: '#e0e1dd',
            callback:function(value,index,values){
                return numeral(value).format("0a");
            }
            }
        }
        ]
            
    }
}
function Graph({casesType="cases",...props}) {
    const [data,setData]=useState({});
    useEffect(()=>
    {   const fetchData=async()=>{
        await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((Response)=>Response.json())
        .then((data)=>{
            console.log(data);
            const chartData=buildChartData(data,casesType);
            setData(chartData);
        })
      }
      fetchData();  
    },[casesType]);
    const buildChartData=(data,casesType)=>{
        const chartData=[];
        let lastDataPoint;
        for(let date in data.cases){
          if(lastDataPoint)
          {
            const newDataPoint={
              x:date,
              y:data[casesType][date]-lastDataPoint
            }
           chartData.push(newDataPoint);
          }
          lastDataPoint=data[casesType][date];
        };
        return chartData;
      }

    return (
        <div className={props.className}>
            {data?.length>0&&(
                 <Line options={options}
                 data={{
                     datasets:[{
                         data:data,
                         borderColor:"#e0e1dd",
                         backgroundColor:"#4ecdc4"
                     }]
                 }}/>
            )}
           
        </div>
    )
}

export default Graph
