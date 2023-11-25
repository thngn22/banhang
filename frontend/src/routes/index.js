import Cart from "../customer/components/Cart/Cart";
import HomePage from "../customer/pages/HomePage/HomePage"
import ProductDetailPage from "../customer/pages/ProductDetail/ProductDetailPage";
import ProductPage from "../customer/pages/ProductPage/ProductPage";
import NotFoundPage from "../customer/pages/NotFoundPage/NotFoundPage";

export const routes = [
    {
        path:"/",
        page: HomePage,
        isShowHeadAndFoot: true,
    },
    {
        path:"/products",
        page: ProductPage,
        isShowHeadAndFoot: true,
    },
    {
        path:"/productElement",
        page: ProductDetailPage,
        isShowHeadAndFoot: true,
    },
    {
        path:"/cart",
        page: Cart,
        isShowHeadAndFoot: true,
    },
    {
        path:"*",
        page: NotFoundPage
    },
];
