import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./private.routes";
import Login from "../pages/login";
import Home from "../pages/home";
import Products from "../pages/products";
import Cart from "../pages/cart";
import About from "../pages/about";
import Contact from "../pages/contact";
import Profile from "../pages/profile";
import Wishlist from "../pages/wishlist";
import Orders from "../pages/orders";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/user/cart"
          element={<PrivateRoute routeName={<Cart />} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/user/profile"
          element={<PrivateRoute routeName={<Profile />} />}
        />
        <Route
          path="/user/wishlist"
          element={<PrivateRoute routeName={<Wishlist />} />}
        />
        <Route
          path="/user/orders"
          element={<PrivateRoute routeName={<Orders />} />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
