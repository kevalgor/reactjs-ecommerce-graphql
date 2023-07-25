import { useEffect, ChangeEvent, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import CustomCard from "../../components/customCard";
import CustomTitle from "../../components/customTitle";
import { GET_PRODUCTS } from "../../graphql/queries";
import { fetchProducts } from "../../redux/actions";
import CustomDropdown from "../../components/customDropdown";
import CustomSearch from "../../components/customSearch";

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: any) => 
    state.productReducer.products
  );
  const [dummy, setdummy] = useState([]);

  const [getProductsQuery, { loading: getProductsLoading }] = useLazyQuery(
    GET_PRODUCTS,
    {
      onCompleted: (result) => {
        dispatch(fetchProducts(result?.getProducts));
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    }
  );

  useEffect(() => {
    getProductsQuery();
    console.log('first')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setdummy(products);
    console.log('second')
  }, [products])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    const searchProducts = products.filter((product: any) => {
      return product?.title.includes(searchValue) === true
    })
    setdummy(searchValue ? searchProducts : products)
  };

  return (
    <Box sx={{ margin: "90px auto", maxWidth: 1560 }}>
      <CustomTitle title="Products" />
      <div className="flex justify-between mx-10 flex-wrap">
        <CustomSearch onChange={handleChange} />
        <CustomDropdown />
      </div>
      {dummy && dummy.length ? (
        <Box className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 place-items-center">
          {dummy.map((product: any) => {
            return (
              <Box key={product?._id}>
                <CustomCard productListType={0} product={product} />
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography className="text-center" variant="body1">
          No records
        </Typography>
      )}
    </Box>
  );
};

export default Products;
