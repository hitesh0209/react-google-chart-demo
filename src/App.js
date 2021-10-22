import { useState } from "react";
import { Chart } from "react-google-charts";
import "./App.css";
import axios from "axios";

function App() {
  const [data, setdata] = useState([]);
  const [res, setRes] = useState();

  const show = () => {
    axios.get(`http://localhost:8080/show`).then((response) => {
      var io = response.data.map((item) => [
        item.productName,
        parseInt(item.quantityOrdered),
        parseInt(item.quantityInStock),
      ]);
      const sumArray = (array) => {
        const q = [];
        array.forEach((sub) => {
          sub.forEach((num, index) => {
            if (q[index]) {
              q[index] += num;
            } else {
              q[index] = num;
            }
          });
        });
        return q;
      };
      const total = sumArray(io);
      const result = (total[1] / total[2]) * 100;
      setRes(result.toFixed(2));
      // console.log(result);
      const newArray = [
        ["Prices", `Total Sell: ${total[1]}`, `Total Iventory: ${total[2]}`],
      ].concat(io);
      const qhalf = Math.ceil(newArray.length / 10);
      const Half = newArray.slice(0, qhalf);
      setdata(Half);
      // setdata(newArray);
    });
  };

  return (
    <div className="App">
      <button onClick={show}>show</button>
      <p> total selling in this month : {res} </p>

      {/* <button onClick={showdata}>showdta</button> */}

      <Chart
        height={800}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        // data={[
        //   ["Sales", "2010 Sales", "2000 Sales"],
        //   ["Produrct 1", 8175000, 8008000],
        //   ["Produrct 2", 3792000, 3694000],
        //   ["Produrct 3", 2695000, 2896000],
        //   ["Product 4", 2099000, 1953000],
        //   ["Product  5", 1526000, 1517000],
        // ]}
        data={data}
        options={{
          title: "Products Sales",
          chartArea: { width: "80%" },
          hAxis: {
            title: "Total Products",
            minValue: 0,
          },
          vAxis: {
            title: "Product in Unites",
          },
        }}
        legendToggle
      />
    </div>
  );
}

export default App;
