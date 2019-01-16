//
// Nathan Tucker
// To run in Firefox
// Acknowledgements: http://alignedleft.com/tutorials/d3/scales
//                   http://chamilo2.grenet.fr/inp/main/document/showinframes.php?cidReq=ENSIMAG5MMCOD&id_session=0&gidReq=0&origin=&id=4623
//

function InitiateChart(dataset, xName, yObject, axisLables) {
    
    var chartObj = {};
    var color = d3.scale.category10();
    
    chartObj.xAxisLable = axisLables.xAxis;
    chartObj.yAxisLable = axisLables.yAxis;
    
    chartObj.data = dataset;
    chartObj.margin = {top: 15, right: 60, bottom: 30, left: 50};
    chartObj.width = 650 - chartObj.margin.left - chartObj.margin.right;
    chartObj.height = 480 - chartObj.margin.top - chartObj.margin.bottom;

    chartObj.xFunct = function(d){return d[xName]};

    function getYFn(column) {
        return function (d) {
            return d[column];
        };
    }

    chartObj.yFuncts = [];
    for (var y  in yObject) {
        yObject[y].name = y;
        yObject[y].yFunct = getYFn(yObject[y].column);
        chartObj.yFuncts.push(yObject[y].yFunct);
    }
    
    // Format
    chartObj.formatAsNumber = d3.format(".0f");
    chartObj.formatAsDecimal = d3.format(".2f");
    chartObj.formatAsCurrency = d3.format("$.2f");
    chartObj.formatAsFloat = function (d) {
        if (d % 1 !== 0) {
            return d3.format(".2f")(d);
        } else {
            return d3.format(".0f")(d);
        }
    };

    chartObj.xFormatter = chartObj.formatAsNumber;
    chartObj.yFormatter = chartObj.formatAsFloat;

    chartObj.bisectYear = d3.bisector(chartObj.xFunct).left;

    // Scale 
    chartObj.xScale = d3.scale.linear().range([0, chartObj.width]).domain(d3.extent(chartObj.data, chartObj.xFunct));
    
    chartObj.max = function (fn) {
        return d3.max(chartObj.data, fn);
    };
    chartObj.yScale = d3.scale.linear().range([chartObj.height, 0]).domain([0, d3.max(chartObj.yFuncts.map(chartObj.max))]);

    // Axis Declaration
    chartObj.xAxis = d3.svg.axis().scale(chartObj.xScale).orient("bottom").tickFormat(chartObj.xFormatter);

    chartObj.yAxis = d3.svg.axis().scale(chartObj.yScale).orient("left").tickFormat(chartObj.yFormatter);

    function getYScaleFn(yObj) {
        return function (d) {
            return chartObj.yScale(yObject[yObj].yFunct(d));
        };
    }
    for (var yObj in yObject) {
        yObject[yObj].line = d3.svg.line().interpolate("cardinal").x(function (d) {
            return chartObj.xScale(chartObj.xFunct(d));
        }).y(getYScaleFn(yObj));
    }

    chartObj.svg;

    chartObj.update_svg_size = function () {
        chartObj.width = parseInt(chartObj.chartDiv.style("width"), 10) - (chartObj.margin.left + chartObj.margin.right);

        chartObj.xScale.range([0, chartObj.width]);
        chartObj.yScale.range([chartObj.height, 0]);
        
        return chartObj;
    };

    chartObj.bind = function (selector) {
        chartObj.mainDiv = d3.select(selector);
        
        chartObj.mainDiv.append("div").attr("class", "inner-wrapper").append("div").attr("class", "outer-box").append("div").attr("class", "inner-box");
        chartSelector = selector + " .inner-box";
        chartObj.chartDiv = d3.select(chartSelector);
        d3.select(window).on('resize.' + chartSelector, chartObj.update_svg_size);
        chartObj.update_svg_size();
        return chartObj;
    };

    // Render
    chartObj.render = function () {
        chartObj.svg = chartObj.chartDiv.append("svg").attr("class", "chart-area").attr("width", chartObj.width + (chartObj.margin.left + chartObj.margin.right)).attr("height", chartObj.height + (chartObj.margin.top + chartObj.margin.bottom)).append("g").attr("transform", "translate(" + chartObj.margin.left + "," + chartObj.margin.top + ")");

        for (var y  in yObject) {
            yObject[y].path = chartObj.svg.append("path").datum(chartObj.data).attr("class", "line").attr("d", yObject[y].line).style("stroke", color(y)).attr("data-series", y).on("mouseover", function () {
                focus.style("display", null);
            }).on("mouseout", function () {
                focus.transition().delay(700).style("display", "none");
            }).on("mousemove", mousemove);
        }
        
        chartObj.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + chartObj.height + ")").call(chartObj.xAxis).append("text").attr("class", "label").attr("x", chartObj.width / 2).attr("y", 30).style("text-anchor", "middle").text(chartObj.xAxisLable);

        chartObj.svg.append("g").attr("class", "y axis").call(chartObj.yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", -42).attr("x", -chartObj.height / 2).attr("dy", ".71em").style("text-anchor", "middle").text(chartObj.yAxisLable);

        var focus = chartObj.svg.append("g").attr("class", "focus").style("display", "none");

        for (var y  in yObject) {
            yObject[y].tooltip = focus.append("g");
            yObject[y].tooltip.append("circle").attr("r", 5);
            yObject[y].tooltip.append("rect").attr("x", 8).attr("y","-5").attr("width",22).attr("height",'0.75em');
            yObject[y].tooltip.append("text").attr("x", 9).attr("dy", ".35em");
        }

        focus.append("text").attr("class", "focus year").attr("x", 5).attr("y", 5);
       
        
        var legend = chartObj.mainDiv.append('div').attr("class", "legend");
        for (var y  in yObject) {
            series = legend.append('div');
            series.append('div').attr("class", "series-marker").style("background-color", color(y));
            series.append('p').text(y);
            yObject[y].legend = series;
        }

        chartObj.svg.append("rect").attr("class", "overlay").attr("width", chartObj.width).attr("height", chartObj.height).on("mouseover", function () {
            focus.style("display", null);
        }).on("mouseout", function () {
            focus.style("display", "none");
        }).on("mousemove", mousemove);

        return chartObj;
        function mousemove() {
            var x0 = chartObj.xScale.invert(d3.mouse(this)[0]), i = chartObj.bisectYear(dataset, x0, 1), d0 = chartObj.data[i - 1], d1 = chartObj.data[i];
            try {
                var d = x0 - chartObj.xFunct(d0) > chartObj.xFunct(d1) - x0 ? d1 : d0;
            } catch (e) { return;}
            minY = chartObj.height;
            for (var y  in yObject) {
                yObject[y].tooltip.attr("transform", "translate(" + chartObj.xScale(chartObj.xFunct(d)) + "," + chartObj.yScale(yObject[y].yFunct(d)) + ")");
                yObject[y].tooltip.select("text").text(chartObj.yFormatter(yObject[y].yFunct(d)));
                minY = Math.min(minY, chartObj.yScale(yObject[y].yFunct(d)));
            }
            
            focus.select(".focus.year").text(chartObj.xFormatter(chartObj.xFunct(d)));
        }
    };
    
    return chartObj;
    
}