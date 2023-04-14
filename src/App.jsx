import "./App.css";
import { Route, useHistory } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Homepage from "./pages/Homepage/Homepage";
import Navbar from "./components/Customer/Navbar/Navbar";
import Footer from "./components/Customer/Footer/Footer";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile.jsx";
import UpdateAddress from "./pages/UpdateAddress/UpdateAddress";
import UpdatePassword from "./pages/UpdatePassword/UpdatePassword";
import Checkout from "./pages/Checkout/Checkout";
import { useContext, useState, useEffect } from "react";
import StoreAllProducts from "./components/Store/StoreAllProducts/StoreAllProducts";
import AddProduct from "./components/Store/AddProduct/AddProduct";
import UpdateProduct from "./components/Store/UpdateProduct/UpdateProduct";
import StoreLeftbar from "./components/Store/StoreLeftbar/StoreLeftbar";
import StoreNavbar from "./components/Store/StoreNavbar/StoreNavbar";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import SearchResult from "./components/Customer/SearchResult/SearchResult";
import Store from "./components/Customer/Store/Store";
import StoreAllOrders from "./components/Store/StoreAllOrders/StoreAllOrders";
import NoInternet from "./images/no-internet.png";
import Order from "./pages/Order/Order";
import AdminNavbar from "./components/Admin/AdminNavbar/AdminNavbar";
import AdminLeftbar from "./components/Admin/AdminLeftbar/AdminLeftbar";
import AdminAllUsers from "./components/Admin/AdminAllUsers/AdminAllUsers";
import AdminAllProducts from "./components/Admin/AdminAllProducts/AdminAllProducts";

function App() {
  const { role, currentUser, BACKEND_URL, config } = useContext(AuthContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState(false);
  const history = useHistory();
  const fetchPreviewCart = async () => {
    if (role === "CUSTOMER" && currentUser) {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/customer/preview-cart`,
          config
        );
        setCartProducts(data.data);
        setError(false);
      } catch (error) {
        setError(true);
      }
    }
  };
  useEffect(() => {
    fetchPreviewCart();
  }, [history]);
  useEffect(() => {
    if (role === "CUSTOMER") {
      document.title = " BazaarBay";
    } else if (role === "STORE") {
      document.title = " BazaarBay | Store";
    } else if (role === "ADMIN") {
      document.title = "BazaarBay | Admin";
    } else {
      document.title = "BazaarBay | Delivery";
    }
  }, [role]);
  return (
    <div className="app">
      {error && (
        <div className="noInternet">
          <img src={NoInternet} alt="" />
          <div className="buttonContainer">
            <button className="button" onClick={() => fetchPreviewCart()}>
              Try again
            </button>
          </div>
        </div>
      )}
      {role === "CUSTOMER" && !error && (
        <>
          <Navbar
            fetchPreviewCart={fetchPreviewCart}
            cartProducts={cartProducts}
            setCartProducts={setCartProducts}
          />
          <div className="appBody">
            <Route path="/" exact component={Homepage} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route
              path="/product/:productId"
              render={(props) => (
                <Product {...props} fetchPreviewCart={fetchPreviewCart} />
              )}
            />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/search" component={SearchResult} />
            <Route path="/store/:storeId" component={Store} />
            <Route path="/account/address" component={UpdateAddress} />
            <Route path="/account/profile" component={UpdateProfile} />
            <Route path="/account/password" component={UpdatePassword} />
            <Route path="/account/order/:status" component={Order} />
          </div>
        </>
      )}
      {role === "STORE" && !error && (
        <>
          <StoreNavbar />
          <div className="storeAppBody">
            <StoreLeftbar />
            <div className="storeAppContent">
              <Route
                path="/store/order/:status"
                exact
                component={StoreAllOrders}
              />
              <Route
                path="/store/product/:status"
                exact
                component={StoreAllProducts}
              />

              <Route path="/store/new/product" exact component={AddProduct} />
              <Route
                path="/store/product/update/:productId"
                exact
                component={UpdateProduct}
              />
              <Route path="/cart" component={Cart} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/account/profile" component={UpdateProfile} />
              <Route path="/account/password" component={UpdatePassword} />
            </div>
          </div>
        </>
      )}
      {role === "ADMIN" && !error && (
        <>
          <AdminNavbar />
          <div className="adminAppBody">
            <AdminLeftbar />
            <div className="adminAppContent">
              <Route path="/admin/users/:userType" exact component={AdminAllUsers} />
              <Route path="/admin/products" exact component={AdminAllProducts} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
