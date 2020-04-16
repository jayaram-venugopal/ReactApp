import React from "react";
import "./BuildControls.css";
import BuildControl from "./BuildControl/BuildControl";

const controls = [
  { label: "Meat", type: "meat" },
  { label: "Salad", type: "salad" },
  { label: "Cheese", type: "cheese" },
  { label: "Bacon", type: "bacon" },
];

const buildControls = (props) => {
  return (
    <div className="BuildControls">
      <h2>TotalPrice: Rs. {props.totalPrice}</h2>
      {controls.map((ctrl) => (
        <BuildControl
          key={ctrl.label}
          label={ctrl.label}
          added={() => props.ingredientAdded(ctrl.type)}
          removed={() => props.ingredientRemoved(ctrl.type)}
          disabled={props.disabled[ctrl.type]}
        />
      ))}

      <button
        className="OrderButton"
        disabled={!props.purchaseDisable}
        onClick={props.orderNow}
      >
        ORDER NOW
      </button>
    </div>
  );
};

export default buildControls;
