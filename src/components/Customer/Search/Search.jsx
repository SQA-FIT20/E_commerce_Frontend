import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRef, useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import "./search.css";

const Search = ({ open, setOpen, keyword, setKeyword }) => {
  const search = useRef();
  const [loading, setLoading] = useState(false);

  const { BACKEND_URL, currentUser } = useContext(AuthContext);
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchStores, setSearchStores] = useState([]);
  const history = useHistory();
  const handleSearch = async () => {
    try {
      setLoading(true);
      const response1 = await axios.get(
        `${BACKEND_URL}/api/search-products?keyword=${keyword}`
      );
      const response2 = await axios.get(
        `${BACKEND_URL}/api/search-stores?keyword=${keyword.replace(/\s/g, "")}`
      );
      setSearchProducts(response1.data.data.content);
      setSearchStores(response2.data.data.content);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [keyword]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (search.current && !search.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [search]);
  return (
    <div className={open ? "search open" : "search"} ref={search}>
      <div className="searchContainer">
        {loading && (
          <div className="partialLoading">
            <div className="lds-ring" style={{ paddingTop: "10px" }}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        {!keyword && !loading && currentUser && (
          <div className="recentSearchHeading">
            <span>Recent search</span>
          </div>
        )}

        {keyword &&
          !loading &&
          (searchProducts.length > 0 || searchStores.length > 0) && (
            <div className="searchBody">
              {searchProducts.length > 0 && (
                <ul className="searchProducts">
                  <div className="searchProductHeading">Products</div>

                  {searchProducts.slice(0, 3).map((product) => (
                    <li
                      key={product.id}
                      onClick={() => {
                        history.push(`/product/${product.id}`);
                        setOpen(false);
                        setKeyword("");
                      }}
                    >
                      <div className="searchProductLeft">
                        <img src={product.images[0]} alt="" />
                        <div className="productInfo">
                          <h2>{`${product.name.substring(0, 80)}${
                            product.name.length > 80 ? "..." : ""
                          }`}</h2>
                          <h3>{product.store.name}</h3>
                        </div>
                      </div>
                      <div className="searchProductRight">
                        {/* <FontAwesomeIcon icon={faTimes} /> */}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {searchStores.length > 0 && (
                <ul
                  className="searchStores"
                  style={{ borderTop: "1px solid #ccc", paddingTop: "10px" }}
                >
                  <div className="searchStoreHeading">Stores</div>
                  {searchStores.slice(0, 4).map((store) => (
                    <li key={store.id} onClick={() => {history.push(`/store/${store.id}`); setOpen(false)}}>
                      <div className="searchStoreLeft">
                        <img src={store.avatar} alt="" />
                        <h2>{store.name}</h2>
                      </div>
                      <div className="searchStoreRight">
                        {/* <FontAwesomeIcon icon={faTimes} /> */}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        {keyword &&
          searchProducts.length === 0 &&
          searchStores.length === 0 &&
          !loading && <div className="noResultText">No matching results</div>}
      </div>
    </div>
  );
};

export default Search;
