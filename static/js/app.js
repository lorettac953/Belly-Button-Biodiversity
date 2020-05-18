/* data route */

function testPlotly(name) {

  var url2 = '/metadata/' + name;

  var url3 = '/samples/'  + name;

  var url4 = '/WFREQval/' + name;

  var url5 = '/samples2/' + name;

  var url6 = '/samples3/' + name;

  console.log(url6);



  Plotly.d3.json(url2, function (error, metaData) {

      console.log(metaData);

      Plotly.d3.select("tbody")

          .html("")

          .selectAll("tr")

          .data(metaData)

          .enter()

          .append("tr")

          .html(function (d) {

              return `<td>${d.t0}</td><td>${d.t1}</td>`

          });

  }



  );

  // Start Pie Plot 

  Plotly.d3.json(url3, function (error, pieData) {



      var labels0 = pieData['otu_id']



      var values0 = pieData['sample_values']



      var data = [{

          values: values0,

          labels: labels0,

          type: "pie"

      }];



      var layout = {

          height: 500,

          width: 700,

          title: "Germ Diversity Pie Chart",

      };

      Plotly.newPlot("plot1", data, layout);

      

  });

  // End Pie Plot

  

  // Start Scatter

  

  Plotly.d3.json(url5, function (error, pieData) {



      var labels0 = pieData['otu_id']



      var values0 = pieData['sample_values']



      var data = [{

          y: values0,

          x: labels0,

          mode: 'markers',

          marker: {

              color: labels0, colorscale: 'Bluered', colorbar: {

                  title: 'Germ Code',

                  titleside: 'right'}, size: values0, sizeref: 1 },  

          type: 'scatter'

      }];



      var layout = {

          height: 500,

          width: 1000,

          title: "Germ Diversity Scatter Plot",

          xaxis: { range: [0, 4000], dtick: 1000, title: "Germ Code" },

          yaxis: { range: [0, 2600], title: "Germ Count" },

      };

      Plotly.newPlot("plot2", data, layout);

      

  });



  //End Scatter

  

  //Start Bar compare

  

  Plotly.d3.json(url6, function (error, barData) {



      var labels0 = barData['label']



      var values0 = barData['value']



      var data = [{

          y: values0,

          x: labels0,

          type: 'bar'

      }];



      var layout = {

          height: 450,

          width: 450,

          title: "Germ Diversity Stats This Sample vs. Others",

          xaxis: { title: "Stats" },

          yaxis: { title: "Count" },

      };

      Plotly.newPlot("plot3", data, layout);

      

  });



  //End Bar Compare 



  // Guage Plot data 

  Plotly.d3.json(url4, function (error, guageData) {

      var WFREQ = guageData.WFREQ;

      console.log(guageData.WFREQ);

      plotGuage(WFREQ);

  });

  // end Guage plot Data 





}



// Stand alone function to plot Gauge 



function plotGuage(WFREQ) {



  // Enter a speed between 0 and 180

  var level0 = WFREQ;

  var level = level0 * 18



  // Trig to calc meter point

  var degrees = 180 - level,

      radius = .5;

  var radians = degrees * Math.PI / 180;

  var x = radius * Math.cos(radians);

  var y = radius * Math.sin(radians);



  // Path: may have to change to create a better triangle

  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',

      pathX = String(x),

      space = ' ',

      pathY = String(y),

      pathEnd = ' Z';

  var path = mainPath.concat(pathX, space, pathY, pathEnd);



  var data = [{

      type: 'scatter',

      x: [0], y: [0],

      marker: { size: 14, color: '850000' },

      showlegend: false,

      name: 'Washing Frequency',

      text: level0,

      hoverinfo: 'text+name'

  },

  {

      values: [50 / 5, 50 / 5, 50 / 5, 50 / 5, 50 / 5, 50],

      rotation: 90,

      text: ['VERY HIGH!', 'High', 'Average', 'Low',

          'VERY LOW!'],

      textinfo: 'text',

      textposition: 'inside',

      marker: {

          colors: ['rgba(rgba(0, 255, 0, .75)',

              'rgba(200, 255, 150, .75)', 'rgba(255, 255, 42, .75)',

              'rgba(255, 140, 0, .75)', 'rgba(255, 0, 0, .75)',

              'rgba(255, 255, 255, 0)']

      },

      labels: ['more than 9', 'more than 6 to 8', 'more than 4 to 6', 'more than 2 to 4', '0 to 2', ''],

      hoverinfo: 'label',

      hole: .5,

      type: 'pie',

      showlegend: false

  }];



  var layout = {

      shapes: [{

          type: 'path',

          path: path,

          fillcolor: '850000',

          line: {

              color: '850000'

          }

      }],

      title: '<b>Washing Frequency Gauge!</b> <br> Frequency 0-10 times/week ',

      height: 500,

      width: 500,

      xaxis: {

          zeroline: false, showticklabels: false,

          showgrid: false, range: [-1, 1]

      },

      yaxis: {

          zeroline: false, showticklabels: false,

          showgrid: false, range: [-1, 1]

      }

  };



  Plotly.newPlot('plot4', data, layout);







};



// End  --  Stand alone function to plot Guage 





/// Initial code 



//part 1

var url = "/names";

function init() {

  Plotly.d3.json(url, function (error, names) {

      //console.log(names[0]);



      var select = Plotly.d3.select('#selDataset')

          .on("change", function () {

              var name = Plotly.d3.select(this).node().value;

              //console.log(name);

              testPlotly(name);

          });

      select.selectAll('option')

          .data(names)

          .enter()

          .append('option')



          .text(d => d)

          .attr("value", function (d) { return d; })

  }





  );



}



init();