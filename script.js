'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-17T17:17:17.194Z',
    '2022-05-16T23:36:17.929Z',
    '2022-05-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-04-25T18:49:59.371Z',
    '2022-05-20T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelSumIn = document.querySelector('.summary__value--in');
const labelBalance = document.querySelector('.balance__value');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date.getDate()}`.padStart(2, 0);
  return new Intl.DateTimeFormat(locale).format(date);
};

const displayMovements = function (acc, sort) {
  //????????????

  containerMovements.innerHTML = '';
  //textContent????????????????????????
  // containerMovements.textContent = 0;
  //??????sort????????????????????? ???????????????slice????????????????????????????????? COOL
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>
    `;
    //NICE solution to create elements  afterbegin????????????????????? ??????????????????html
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  //forEach()?????????????????????????????????????????????????????????
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        //map???????????????????????????
        return word[0];
      })
      .join('');
  });
};
//??????????????????????????????????????????
createUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  let time = 120;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    //??????????????? ?????????????????????????????????
    labelTimer.textContent = `${min}:${sec}`;
    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time--;
  };
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////////////////////////
//Event handler

let currentAccount, timer;

//FAKE Always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//Experimenting API

///////////////////////////////////////////////////////////////
btnLogin.addEventListener('click', function (e) {
  //???????????????????????????????????????????????? ???????????? NICE
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  //this value will always be string
  //(currentAccount? )if currentAccount is not undefined and then (.pin ) COOL
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      // month: 'long',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // //???????????????????????????
    // const local = navigator.language;
    // console.log(local);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${year}/${month}/${day}, ${hour}:${min}`;

    //Clear input fileds
    inputLoginUsername.value = inputLoginPin.value = '';
    //loss its focus NICE
    inputLoginPin.blur();
    //timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    //Doing the tansfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    //Resrt timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  //floor ????????????????????????????????????  ?????????-?????????
  const amount = Math.floor(inputLoanAmount.value);
  //????????????????????????????????????????????????10%

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //Add movment
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);
    }, 2500);

    //Resrt timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    //???????????? ??????find ???????????????true or false ???????????????????????????????????????????????????
    //???????????????????????????????????????????????? ????????????.indexOf()
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
//?????????????????? ??????????????? ???????????????????????????
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// console.log(createUsernames('Steven curry'));

// console.log(containerMovements.textContent);
// console.log(containerMovements.innerHTML);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
//true
console.log(23 === 23.0);

//false
//0.1?????????????????????????????????  ??????3/10???????????????????????????
console.log(0.1 + 0.2 === 0.3);

//Conversion
console.log(Number('23'));
//+????????????
console.log(+'23');

//Parsing
//????????????????????????????????????10????????????
//23
console.log(Number.parseInt('23px', 10));
//NaN
console.log(Number.parseInt('e23'));
//parseInt ??????????????????
console.log(Number.parseInt('  2.5rem '));
//???????????????2 ???????????????????????????
console.log(Number.parseInt('2e3'));
console.log(Number.parseFloat(' 2.5rem'));

//Check if value is NaN
// ??????????????? isNaN() ?????????Number.isNaN() ??????????????????????????????????????????????????????????????? NaN ??????????????????????????? true???
console.log(Number.isNaN(NaN));
console.log(Number.isNaN(23));
console.log(Number.isNaN('23'));
console.log(Number.isNaN(+'e23'));
//10/0 Infinite
console.log(Number.isNaN(10 / 0));

// Checking a value is Number
//isFinite ??????????????????????????????????????????????????????
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(10 / 0));

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23.01));
console.log(Number.isInteger(23.0 / 0));
*/

/*
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
//??????????????????????????????
console.log(8 ** (1 / 3));

console.log(Math.max(2, 1, 3, 5, 0));
//NaN
console.log(Math.max(2, 1, 3, '5px', 0));

console.log(Math.min(2, 3, 1, 4, 5, 32, 0));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

//min=0 max=6
console.log(Math.trunc(Math.random() * 6) + 1);
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

//1...max-min--->min...max
//(10,20]
// console.log(randomInt(10, 20));



//Rouding integers
console.log(Math.trunc(23.3));
console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.floor(23.3));

//floor????????? NICE
console.log(Math.floor(-23.3)); //-24
console.log(Math.trunc(-23.3)); //-23

//Rounding decimals
//toFixed ???????????????
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.35).toFixed(1));
//+ ???????????????????????????
console.log(+(2.35).toFixed(1));
*/

//The Remainder Operator
/* 
const isEven = n => n % 2 === 0;
console.log(isEven(23));
console.log(isEven(24));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});
*/
//////////////
/*
//Numeric Separators
//287,460,000,000
const diameter = 287_460_000_000;
console.log(diameter);
*/
/*
//BigInt
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 52 + 1);
//??????????????????
console.log(2 ** 52 + 1);
console.log(2 ** 52 + 1);
console.log(241564684555555544454444462222213n);
console.log(BigInt(211455));

//OPeration
console.log(1000n + 1000n);
console.log(2146545165762132133n * 4545121123n);

// console.log(Math.sqrt(16n));
console.log(23n > 11);
//false
console.log(23n === 23);
//true
console.log(23n == 23);
console.log(typeof 23n);

//Division
console.log(10n / 3n);
console.log(10 / 3);
*/
/*
//Crate a date
const now = new Date();
// const now = new Date('Mon May 23 2022 16:54:50');
console.log(now);
console.log(new Date('December 24,2022'));
console.log(new Date(2027, 12, 33, 17, 23, 11));

console.log(new Date(0));
//?????????????????????3???
console.log(new Date(3 * 24 * 60 * 60 * 1000));

//Working with dates
const future = new Date(2037, 10, 19, 8, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
//?????????
console.log(future.getDate());
//?????????
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());

//???????????????????????? ??????????????????????????????8?????????
///2037-11-19T00:23:00.000Z
console.log(future.toISOString());

//????????????1970.1.1 00???00???00 (??????????????????)???????????? Thu Jan 01 1970 08:00:00 GMT+0800 (??????????????????)
console.log(future.getTime());
console.log(new Date(2142202980000));

//??????????????????????????????
console.log(Date.now());
console.log(new Date(1653362894345));

future.setFullYear(2040);
console.log(future);
*/
/////??????????????????????????????
// const future = new Date(2037, 10, 19, 15, 23);
//???????????????
// console.log(+future);
const num = 3884764.23;
const options = {
  style: 'currency',
  unit: 'percent',
  currency: 'EUR',
};
console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));
console.log('US:', new Intl.NumberFormat('en-US', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);

//
const nums = [1, 2];
const [num1, num2] = [...nums];
console.log(num1, num2);
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => {
    console.log(`Here is your pizza with ${ing1} and ${ing2}`);
  },
  3000,
  ...ingredients
);
console.log('Waiting...');
if (ingredients.includes('spanish')) clearTimeout(pizzaTimer);

//SetInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 3000);
