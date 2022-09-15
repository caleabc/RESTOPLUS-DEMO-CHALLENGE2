// libraries
import { useState, useEffect } from "react";
import { Button, SIZE } from "baseui/button";

// connection
import { collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import db from "../connection/connection";

// components
import Spacer from "./spacer";

// css
import "./counter.css";

function Counter() {
  // we need to create a local database in order for us to keep up and track the
  // current value, also it execute faster when storing and retrieving data

  let [value, setValue] = useState(0);

  function handleClickDecrement() {
    let valueCopy = value - 1;
    setValue(valueCopy);

    saveToDatabase(valueCopy);
  }

  function handleClickIncrement() {
    let valueCopy = value + 1;
    setValue(valueCopy);

    saveToDatabase(valueCopy);
  }

  function handleClickReset() {
    setValue(0);
    saveToDatabase(0);
  }

  async function saveToDatabase(val) {
    // localStorage
    localStorage.setItem("val", JSON.stringify(val));

    // communicate to firebase

    let id;
    const querySnapshot = await getDocs(collection(db, "counter"));
    querySnapshot.forEach((doc) => {
      id = doc.id;
    });

    let data = { value: val };

    if (id == undefined) {
      // collection is empty, add document
      await addDoc(collection(db, "counter"), data);
    } else {
      // update document
      await setDoc(doc(db, "counter", id), data);
    }
  }

  useEffect(function () {
    function getCurrentValue() {
      let val = JSON.parse(localStorage.getItem("val"));

      if (val != null) setValue(val);
      else val = 0;

      saveToDatabase(val);
    }
    // call
    getCurrentValue();
  }, []);

  return (
    <div className="main-div">
      <h2 className="application-name">Counter</h2>
      <div>
        <span className="icon" onClick={handleClickDecrement}>
          <i className="bi bi-dash-circle m-0 fs-2"></i>
        </span>
        <span className="value">{value}</span>
        <span className="icon" onClick={handleClickIncrement}>
          <i className="bi bi-plus-circle m-0 fs-2"></i>
        </span>
      </div>
      <Spacer height="1rem" />
      <Button size={SIZE.mini} onClick={handleClickReset}>
        reset
      </Button>
    </div>
  );
}

export default Counter;
