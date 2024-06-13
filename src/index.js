import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";

// function Test() {
//   const [extRating, setExtRating] = useState(0);
//   return (
//     <div>
//       <StarRating color="blue" onSetRating={setExtRating} />
//       <p>This movie has {extRating} star rating...</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      message={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating color="red" size={32} />
    <StarRating defaultRating={3} />
    <Test /> */}
  </React.StrictMode>
);
