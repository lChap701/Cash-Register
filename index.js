function checkCashRegister(price, cash, cid) {
  var change = cash - price;
  let units = [];
  let total = cid.reduce((tot, amt) => {
      tot += amt[1]; 
      return tot;
    }, 0
  );

  if (change > Math.round(total * 100) / 100) {
    return {status: "INSUFFICIENT_FUNDS", change: []};    
  } else if (change === Math.round(total * 100) / 100) {
    units = unit(cid, change, "CLOSED");

    if (units.length == 0) {
      return {status: "INSUFFICIENT_FUNDS", change: []};    
    }

    return {status: "CLOSED", change: units}
  }

  units = unit(cid, change);

  if (units.length == 0) {
    return {status: "INSUFFICIENT_FUNDS", change: []};    
  }

  return {status: "OPEN", change: units};
}

function unit(cid, change, status = "OPEN") {
  let changeUnits = [];
  let units = [
    {"PENNY": 0.01}, 
    {"NICKEL": 0.05}, 
    {"DIME": 0.1},
    {"QUARTER": 0.25},
    {"ONE": 1},
    {"FIVE": 5},
    {"TEN": 10},
    {"TWENTY": 20},
    {"ONE HUNDRED": 100}
  ];
  let curVal = 0;

  if (status == "CLOSED") {
    for (let i = 0; i < cid.length; i++) {
      let times = 1;

      while (curVal < cid[i][1]) {
        change -= units[i][cid[i][0]];
        change = Math.round(change * 100) / 100;
        curVal = units[i][cid[i][0]] * times;
        times++;
      }

      changeUnits.push([cid[i][0], curVal])
      curVal = 0;
    }
  } else {
    for (let i = 8; i >= 0; i--) {
      if (change >= units[i][cid[i][0]]) {
        let times = 1;

        while (change >= units[i][cid[i][0]] && curVal < cid[i][1]) {
          change -= units[i][cid[i][0]];
          change = Math.round(change * 100) / 100;
          curVal = units[i][cid[i][0]] * times;
          times++;
        }

        changeUnits.push([cid[i][0], curVal])
        curVal = 0;
      }
    }
  }

  if (change == 0) { 
    return changeUnits;
  } else {
    return "";
  }
}

console.log(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));