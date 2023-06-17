import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { EventContext } from '../context/EventContext';
import { QueryContext } from '../context/QueryContext';
import EventChart from '../charts/EventChart';

interface EventContainerProps {
  sizing: string;
  colourGenerator: Function;
}

interface Params {
  service: string;
}

const EventContainer: React.FC<EventContainerProps> = React.memo(props => {
  const { eventData } = useContext(EventContext);
  const { selectedMetrics } = useContext(QueryContext);
  const { service } = useParams<keyof Params>() as Params;
  // eventChartsArr contains all charts of all metrics
  const [eventChartsArr, setEventChartsArr] = useState<JSX.Element[]>([]);

  


  /*
  Chronos11 -- Unfortunately, eventData is not in a good place for UI/UX purposes.
  The eventData object has a key of 'Event' and a value of an object with hundreds of keys as metric names 
  with their associated values and timestamps due to the way kubernetes metrics are being tracked/logged in the database. 
  These metrics are scraped and generated by Prometheus, and should be sent to a Grafana instance
  to be displayed with a Grafana dashboard, but we didn't realize this until we were too close to launch to fix it.
  For now, the 'selectedMetrics' array is still an array with one object on it with a key of 'event', and a value of an array with
  the hundreds of metric names as strings inside. The eventData is an object with the key of event, and a value of an object with
  the hundreds of metrics as keys, and their values as the metrics and timestamps.
  It would be wonderful if a future iteration could manipulate the prometheus configuration in the kubernetes example to send its data
  to an instance of Grafana, and integrate Grafana's dashboard into Chronos to visualize the data.
  */

  const filterSelectedEventMetricsandData = () => {
    const filteredEventData = {};
    // there's only one element in the selected metrics array for now...
    // selectedMetrics is... [{Event: ['hundreds', 'of', 'metric', 'names', 'as', 'strings']}]
    // use this array of selected metrics to filter the eventData down to only the metrics we want to see
    const selectedArr = selectedMetrics[0].Event;
    // only one service... 'Event'
    for (const service in eventData) {
      filteredEventData[service] = {};
      // define the object of all the metrics
      const serviceMetricsObject = eventData[service];
      // iterate through all the metrics
      for (const metricName in serviceMetricsObject) {
        // if the metric name matches a string in the selectedArr, we add it to our filtered object
        if (selectedArr.includes(metricName)) {
          filteredEventData[service][metricName] = serviceMetricsObject[metricName]
        }
      }
    }
    return filteredEventData;
  }

  const generateEventCharts = () => {
    
  }

  useEffect(() => {
    const temp: JSX.Element[] = [];
    filterSelectedEventMetricsandData();
    // if (eventData && eventDataList.length > 0 && eventTimeList.length > 0) {
    //   let selectedMetricsList: string[] = [];
    //   selectedMetrics.forEach(element => {
    //     if (Object.keys(element)[0] === 'Event') {
    //       selectedMetricsList = element['Event'];
    //     }
    //   });

    //   eventDataList.forEach((element, id) => {
    //     const metric: string = Object.keys(element)[0];
    //     const valueList: any = Object.values(element)[0];
    //     if (selectedMetricsList.includes(metric)) {
    //       const newEventChart = (
    //         <EventChart
    //           key={`Chart${id}`}
    //           metric={metric}
    //           timeList={getSingleTimeList(metric)}
    //           valueList={valueList}
    //           sizing={props.sizing}
    //           colourGenerator={props.colourGenerator}
    //         />
    //       );

    //       temp.push(newEventChart);
    //     }
    //   });
    //   setEventChartsArr(temp);
    // }
  }, [eventData, service]);

  // const getSingleTimeList = (metricName: string) => {
  //   let lst = [];
  //   for (let metric of eventTimeList) {
  //     if (Object.keys(metric)[0] === metricName) {
  //       lst = metric[metricName];
  //       break;
  //     }
  //   }
  //   return lst;
  // };

  return (
    <div>
      {service.includes('kafkametrics') || service.includes('kubernetesmetrics')
        ? eventChartsArr
        : []}
    </div>
  );
});

export default EventContainer;