///new
let recieve = () => {
  let values = localStorage.getItem("user-data");
  if (values) {
    values = JSON.parse(values);
  } else {
    values = [];
  }
  return values;
};

let data = recieve();

let disp = () => {
  const values = recieve();
  let tablevel = values
    .map((valx) => {
      let namet = `<td>${valx.name}</td>`;
      let emailt = `<td>${valx.mail}</td>`;
      let passwdt = `<td>${valx.passwd}</td>`;
      let dateofbirtht = `<td>${valx.dateofbirth}</td>`;
      let termsandcondt = `<td>${valx.termsandcond}</td>`;
      let row = `<tr>${namet} ${emailt} ${passwdt} ${dateofbirtht} ${termsandcondt}</tr>`;
      return row;
    })
    .join("\n");

  let table = `<table>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Dob</th>
            <th>Accepted Terms?</th>
        </tr>${tablevel}
    </table>`;
  let det = document.getElementById("x-data");
  det.innerHTML = table;
};

let checkage = (valueofage) => {
  let x;
  if (valueofage >= 18 && valueofage <= 55) {
    x = true;
  } else {
    alert("You are not in valid age it ranges between 15 to 55");
    x = false;
  }
  return x;
};

let mustcheck = (passwd) => {
  let letters = /^[A-Z]+$/;
  let num = /^[0-9]+$/;
  let sym = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  let x;

  if (passwd.length < 6) {
    alert("It should contain more than 6 characters");
    x = false;
  }
  if (passwd.length > 6) {
    if (passwd.match(letters)) {
      alert("It should contain any Uppercase letter");
      x = false;
    } else if (passwd.match(num) | passwd.match(sym)) {
      alert("It should contain any number or special character");
      x = false;
    } else {
      x = true;
    }
    return x;
  }
};

let form = document.getElementById("form");

let savedata = (op) => {
  op.preventDefault();
  let name = document.getElementById("name").value;
  let mail = document.getElementById("email").value;
  let passwd = document.getElementById("password").value;
  let dateofbirth = document.getElementById("dob").value;
  let termsandcond = document.getElementById("check").checked;

  //age validation
  let d = new Date(dateofbirth);
  let time = Date.now() - d.getTime();
  let age = new Date(time);
  let tval = Math.abs(age.getUTCFullYear() - 1970);
  let m = mustcheck(passwd);
  let cage = checkage(tval);

  if (m === true && cage === true) {
    const valx = {
      name,
      mail,
      passwd,
      dateofbirth,
      termsandcond,
    };
    data.push(valx);
    localStorage.setItem("user-data", JSON.stringify(data));
    disp();
  }
};

form.addEventListener("submit", savedata);
disp();

