import React, {useState, useEffect} from 'react'
import{ Bar } from 'react-chartjs-2'
import numeral from "numeral"


const options ={
  legend:{
    display: false
  },
  maintainAspectRatio:false,
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
}

const LineGraph = ({casesType="cases", ...props}) => {

    const [data, setData] = useState({})

    // https://disease.sh/v3/covid-19/historical/all?lastday=120
    const buildChartData = (data, casesType='cases') =>{
        const chartData = []
        let lastDataPoint;
    
        for(let date in data.cases){
            if(lastDataPoint){
            let newDataPoint = {
                    x:date,
                    y:data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date]
        }
        return chartData
    }



    useEffect(() => {
        const fetchData = async () => {
          await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              console.log(data)
              let chartData = buildChartData(data, casesType);
              setData(chartData);
              console.log(chartData);
              // buildChart(chartData);
            });
        };
    
        fetchData();
    }, [casesType])

    const axesX = (data)=>{  //faire apparaitre la date 
      const retour = [];
      for(let i=0; i<data.length; i++){
        //console.log(d)
        retour.push(data[i].x)
      }
      return retour 
    }



    return (
        <div className={props.className}>
          {data?.length > 0 && (
            <Bar
              data={{
                labels: axesX(data),
                datasets:[{
                  data:data,
                  //label:'Some visible data',
                  backgroundColor:'red',
                  borderColor:'#CC1034',
                  borderWidth:1
            
                }]
              }}
              options={options}
            />
          
        
          )}
        </div>
      );
    }
    

export default LineGraph
