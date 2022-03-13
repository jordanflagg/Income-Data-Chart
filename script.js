 /* 
Author: Jordan Flagg
Date: 10/19/2021
MGT 3745 B Fall 2021
Homework 6
*/

////////////// Table Code ///////////////////
function dataGen() {
  // Clears tablea and chart for reset button
  document.querySelector("#Chart").innerHTML = '<canvas id="myChart"></canvas>';
  document.querySelector("#Table").innerHTML = '<div class="tab-pane fade show active" id="Table" role="tabpanel" aria-labelledby="Table-tab"><table id="table"></table> </div>';


  TABLESIZE = 60
  MINSALARY = 70000
  MAXSALARY = 250000
  // Not sure why object literals do not work when dropped into chance.integer below 
  // Creates object blueprint for data
  const personData = () => {
    return {
      name: chance.name(),
      domain: chance.domain(),
      handle: chance.twitter(),
      income: chance.integer({min: 70000, max:250000 })
    }
  }
  // Generates "TABLESIZE" instances of personData to populate the table
  const tableData = Array.from({length:`${TABLESIZE}`},personData)

  // Grabs Income column from generated JS Object data for chart data calculations below
  let income = []
  for(i = 0; i < `${TABLESIZE}`; i++){
    income[i] = tableData[i].income
  }

  // Appends $ to income column for table display
  for(i = 0; i < `${TABLESIZE}`; i++){
    tableData[i].income = `$${tableData[i].income}` 
  }

  // Populates table 
  tableContent =  $('#table').bootstrapTable({
    columns: [{
      field: 'name',
      title: 'Name'
    }, {
      field: 'domain',
      title: 'Domain'
    }, {
      field: 'handle',
      title: 'Handle'
    }, {
      field: 'income',
      title: 'Income'
    }],
    data: tableData
  })

  ////////////// Chart Code //////////////////
  // Chart Columns and Range of Display Data
  NUMBER_OF_COLUMNS = 5
  MAX_VALUE = 220000
  MIN_VALUE = 100000
  DIFF = (MAX_VALUE-MIN_VALUE)/(NUMBER_OF_COLUMNS-1)

  let testincome = []
  let lowData = []
  let highData = []
  let indexes = []
  sum = 0

  // Function for returning indexes within income range
  function incomeCheck(money) {
    return money >= low && money < high;
  }

  lowValue = MIN_VALUE
  // sets up 2 arrays where the ith index gives the upper and lower bound of the income inetrval
  for(i = 0; i < `${NUMBER_OF_COLUMNS}`; i++){
    lowData[i] = lowValue
    highData[i] = lowValue+DIFF-1

    lowValue = lowValue+DIFF
  }

  // uses the income check function along with the previusly set up income search intervals to return # of people per category 
  for(i = 0; i < `${NUMBER_OF_COLUMNS}`; i++){
    low = lowData[i]
    high = highData[i]
    indexes[i] = income.filter(incomeCheck).length
  }

  // Object blueprint for chart data
  function Data(x,y){
    this.x = x;
    this.y = y
  }

  chartData = []
  // Places object data into the chartData list
  for(i = 0; i < `${NUMBER_OF_COLUMNS}`; i++){
  
    if (i == NUMBER_OF_COLUMNS-1){
      label = `$${lowData[i]}+`
    } else {
      label = `$${lowData[i]}-$${highData[i]}`
    }
  
    chartData[i] = new Data(label,indexes[i])
  }

  // Chart title and color of graphs 
  TITLE = '# of people per income category'
  RGB_BACK  = 'rgba(255,0,0,0.25)'
  RGB_OUT   = 'rgba(255,0,0,10)'
  BORDER_WIDTH = 2
  BACKCOLOR = []
  OUTCOLOR = []

  for(i = 0; i < `${NUMBER_OF_COLUMNS}`; i++){
    BACKCOLOR[i] = RGB_BACK
    OUTCOLOR[i] = RGB_OUT
  }

  let ctx = $("#myChart")
  ctx.attr({"height":"200px"})
  let type = 'bar'               
  var myChart       

  function buildChart(title,data){
 
  myChart = new Chart(ctx, {
      type: type, 
      data: {
          datasets: [{
            label: title,
            data: data,
            backgroundColor: BACKCOLOR,
            borderColor: OUTCOLOR,
            borderWidth: BORDER_WIDTH
        }]
      }
    })
  }
  chartContent = buildChart(TITLE,chartData)

  const content = {
    "Table": tableContent,
    "Chart": chartContent
  }

  for (navItem in content){
    $(`#${navItem}`).html(content[navItem])
  }
}

  let button = $("#button")
  button.click(function(){
    dataGen()
  });

dataGen()

