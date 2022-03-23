import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [expression, setExpression] = useState(''); // The mathematical expression to be evaluated.
  const [result, setResult] = useState('0');  // on every button press, we assess the result
  const [done, setDone] = useState(false);  //me. after pressing =, I want to restart the calculation if a number or point(.) is entered, so set done=true and to continue calculation from the result if an operator is pressed, setDone(false).
  const operators = ['*', '/','+', '-', '**'];  
  const digits = ['0','1','2','3','4','5','6','7','8','9'];
  const points = ['.'];  // floating point
  const groupingOps = ['(', ')'];


  useEffect(() => {
    calculate();
  }, [expression]);


  // create buttons for digits
  const createDigits = () => {
    let buttons = [];
    for(let i = 1; i < 10; i++){
      buttons.push(<button type="button" key={i} onClick={() => btnClick(i.toString())}>{i}</button>); 
    }
    return buttons;
  }


  const btnClick = (btnText) => {
    switch(true){
      case (btnText === "DEL"):
        handleDelete();
        break;

      case (btnText === "="):
        handleEqual();
        break;

      case (operators.includes(btnText)):
        handleOperators(btnText);
        break;

      case (digits.includes(btnText)):
        handleDigits(btnText);
        break;

      case (points.includes(btnText)):
        handlePoint();
        break;

      case (groupingOps.includes(btnText)):
        handleGroupingOps(btnText);
        break;  

      default:
        break;
      }
    }


  const handleDigits =  (digitInput) => {
    if(done){
      setExpression(digitInput);
      setDone(false);
    }else{
      setExpression(expression + digitInput);
    }
  }


  const handleOperators = (operatorInput) => {
    if(done) setDone(false);
    if(expression.length !== 0){
      if(operators.includes(expression.slice(-1))){
        setExpression(expression.slice(0,-1).concat(operatorInput));
      }else{
        setExpression(expression + operatorInput);
      }
    }
  }


  const handleEqual = () =>{
    if(operators.includes(expression.slice(-1))){
      return;
    }
    setExpression(result.toString());
    setDone(true);
  }


  // useful if the user enters input by a keyboard. To prevent entering any character.
  const inputCharValidation = (e) => {
   const newInput = e.target.value;
   const newChar = e.target.value.slice(-1);
   if(operators.concat(digits, points, groupingOps).includes(newChar) ||
   newInput === ''){
      setExpression(newInput);
   }else{
     return;
   }
  }

  const handleGroupingOps = (pare) => {
    setExpression(expression + pare);
  }

 // 1- Only one point in a number. 2- point is preceded by zero at if we are at the beginning of a number. 3- After pressing = and displaying the result, if we enter '.' , the refresh should be refreshed. 4- The second '.' is allowed only if there is an operator after the last point.
  const handlePoint = () => {
    const lastPointIndx = expression.lastIndexOf('.');
    const operatorAfterLastPointExist = [...operators].some(operator => expression.lastIndexOf(operator) > lastPointIndx);
    if(done){
      setExpression('0.');
      setDone(false);
    }else{
       if(lastPointIndx === -1 || operatorAfterLastPointExist){
          if(expression.slice(-1) === '' || !digits.includes(expression.slice(-1))){
              setExpression(expression + '0' + '.');
          }else{
            setExpression(expression + '.');
          }
        }
    }
  }

 
  // If the expression is not empty, delete the last character unless there is power operator, '**' for which the last 2 characters should be removed. 
const handleDelete = () => {
  if(expression.length){
    const newExpression = (expression.slice(-1) === '*') ?
    (
      expression.slice(-2, -1) === '*' ? expression.slice(0, -2) : expression.slice(0, -1)
    )  : 
    expression.slice(0, -1);
     setExpression(newExpression);
  }
}

  // On expression change, evaluate the recent one. If there is an operator at the end of the expression, ignore it and set the result accordingly. If the last operator is power, omit the last 2 characters and then evaluate the expression.
  const calculate = () => {
    try{
      if(expression.slice(-2) === '**'){
        setResult(eval(expression.slice(0,-2)));
      }else if(operators.includes(expression.slice(-1))){ 
        setResult(eval(expression.slice(0,-1)));
      }else{
        setResult(eval(expression));
      }
    }catch(err){
      console.log('err = ', err)
    }
  }


  return (
    <div className="container">
      <div id="calculator-container">
        <input id="display" type="text" placeholder="0" value={expression} onChange={inputCharValidation}/>
        <div id="resultDiv">{result}</div>

        <div id="upper-panel-2">
          <button type="button" onClick={() => btnClick('**')}>x<sup>y</sup></button>
          <button type="button" onClick={() => btnClick('(')}>(</button>
          <button type="button" onClick={() => btnClick(')')}>)</button>
          <button type="button" id="clear" onClick={() => setExpression('')}>C</button>
          <button type="button" onClick={() => btnClick('DEL')}>DEL</button>
        </div>

        <div id="upper-panel-1">
          <button type="button" onClick={() => btnClick('/')}>/</button>
          <button type="button" onClick={() => btnClick('*')}>*</button>
          <button type="button" onClick={() => btnClick('+')}>+</button>
          <button type="button" onClick={() => btnClick('-')}>-</button>
        </div>

        <div id="lower-panel">
          {createDigits()}
          <button type="button" onClick={() => btnClick('0')}>0</button>
          <button type="button" onClick={() => btnClick('.')}>.</button>
          <button type="button" id="equal" onClick={() => btnClick('=')}>=</button>
      </div>
      </div>
    </div>
  );
}

export default App;
