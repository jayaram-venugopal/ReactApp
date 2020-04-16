import React, { Component } from "react";
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControl from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummery from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axiosConfig";
import Spinner from "../../components/UI/Spinner/Spinner";
import errorHandler from "../../hoc/ErrorHandler/ErrorHandler";

const INGREDIENTS_PRICE = {
  salad: 0.5,
  meat: 1.2,
  cheese: 0.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 2.4,
    purchase: false,
    purchasing: false,
    loading: false,
  };

  addIngredients = (type) => {
    const oldCount = this.state.ingredients[type];
    const updateIngredients = {
      ...this.state.ingredients,
    };
    const currentPrice = parseFloat(this.state.totalPrice);

    updateIngredients[type] = oldCount + 1;
    const newPrice = (currentPrice + INGREDIENTS_PRICE[type]).toFixed(2);
    const updatePurchaseStatus = newPrice > 2.4;

    this.setState({
      totalPrice: newPrice,
      ingredients: updateIngredients,
      purchase: updatePurchaseStatus,
    });
  };

  removeIngredients = (type) => {
    const oldCount = this.state.ingredients[type];
    const currentPrice = parseFloat(this.state.totalPrice);
    const updateIngredients = {
      ...this.state.ingredients,
    };

    if (oldCount <= 0) {
      return;
    }

    updateIngredients[type] = oldCount - 1;
    const newPrice = (currentPrice - INGREDIENTS_PRICE[type]).toFixed(2);

    const updatePurchaseStatus = newPrice > 2.4;

    this.setState({
      totalPrice: newPrice,
      ingredients: updateIngredients,
      purchase: updatePurchaseStatus,
    });
  };

  handlePurchase = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandle = () => {
    this.setState({ purchasing: false });
  };

  continuePurchaseHandler = () => {
    // alert('You continue!');

    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(
        encodeURIComponent(i) +
          "=" +
          encodeURIComponent(this.state.ingredients[i])
      );
    }
    queryParams.push("price=" + this.state.totalPrice);
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/checkout",
      search: "?" + queryString,
    });
  };

  // continuePurchaseHandler = () => {
  //   const order = {
  //     ingredients: this.state.ingredients,
  //     price: this.state.totalPrice,
  //     customerDetails: {
  //       name: "Jayaram",
  //       address: {
  //         street: "Kanuvai",
  //         city: "Coimbatore",
  //         state: "TamilNadu",
  //         zipCode: 641108,
  //       },
  //       email: "psgjai@gmail.com",
  //       deliveryType: "fast",
  //     },
  //   };

  //   this.setState({ loading: true });
  //   axios
  //     .post("/orders.json", order)
  //     .then((response) => {
  //       this.setState({ loading: false, purchasing: false });
  //     })
  //     .catch((error) => {
  //       this.setState({ loading: false, purchasing: false });
  //     });
  // };

  componentDidMount() {
    axios.get("/ingredients.json").then((response) => {
      this.setState({ ingredients: response.data });
    });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients,
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = <Spinner />;
    let orderSummary = null;

    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControl
            ingredientAdded={this.addIngredients}
            ingredientRemoved={this.removeIngredients}
            totalPrice={this.state.totalPrice}
            disabled={disabledInfo}
            purchaseDisable={this.state.purchase}
            orderNow={this.handlePurchase}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummery
          ingredients={this.state.ingredients}
          purchaseCanceled={this.purchaseCancelHandle}
          purchaseContinue={this.continuePurchaseHandler}
          price={this.state.totalPrice}
        />
      );
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandle}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default errorHandler(BurgerBuilder, axios);
