import React from "react";
import { Authenticated, AuditLogProvider, Refine, BaseKey, LogParams } from "@refinedev/core";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
} from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import {
  ShoppingOutlined,
  ShopOutlined,
  DashboardOutlined,
  UserOutlined,
  UnorderedListOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import jsonServerDataProvider from "@refinedev/simple-rest";
import { authProvider } from "./authProvider";

import "dayjs/locale/pt";

import { DashboardPage } from "./pages/dashboard";
import { OrderList, OrderShow } from "./pages/orders";
import { AuthPage } from "./pages/auth";
import { CustomerShow, CustomerList } from "./pages/customers";
import { CourierList, CourierCreate, CourierEdit } from "./pages/couriers";
import {
  ProductList,
  ProductCreate,
  ProductEdit,
  ProductShow,
} from "./pages/products";
import { StoreCreate, StoreEdit, StoreList } from "./pages/stores";
import { CategoryList } from "./pages/categories";
import { useTranslation } from "react-i18next";
import { Header, Title } from "./components";
import { BikeWhiteIcon } from "./components/icons";
import { ConfigProvider } from "./context";
import { useAutoLoginForDemo } from "./hooks";

import "@refinedev/antd/dist/reset.css";


const App: React.FC = () => {
  // This hook is used to automatically login the user.
  // We use this hook to skip the login page and demonstrate the application more quickly.
  const { loading } = useAutoLoginForDemo();

  const API_URL = "https://api.finefoods.refine.dev";
  const dataProvider = jsonServerDataProvider(API_URL);

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

// LOGS
  const auditLogProvider: AuditLogProvider = {
    get: async (params) => {
      const { resource, meta, action, author, metaData } = params;
  
      const response = await fetch(
        `https://example.com/api/audit-logs/${resource}/${meta?.id}`,
        {
          method: "GET",
        }
      );
  
      const data = await response.json();
  
      return data;
    },
    create: function (params: LogParams): Promise<any> {
      throw new Error("Function not implemented.");
    },
    update: function (params: { id: BaseKey; name: string;[key: string]: any; }): Promise<any> {
      throw new Error("Function not implemented.");
    }
  };
  
  
  return (
    <BrowserRouter>
      <ConfigProvider>
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            auditLogProvider={auditLogProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <DashboardOutlined />,
                },
              },
              {
                name: "orders",
                list: "/orders",
                show: "/orders/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <ShoppingOutlined />,
                },
              },
              {
                name: "users",
                list: "/customers",
                show: "/customers/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <UserOutlined />,
                },
              },
              {
                name: "products",
                list: "/products",
                create: "/products/new",
                edit: "/products/:id/edit",
                show: "/products/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <UnorderedListOutlined />,
                },
              },
              {
                name: "categories",
                list: "/categories",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <TagsOutlined />,
                },
              },
              {
                name: "stores",
                list: "/stores",
                create: "/stores/new",
                edit: "/stores/:id/edit",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <ShopOutlined />,
                },
              },
              {
                name: "couriers",
                list: "/couriers",
                create: "/couriers/new",
                edit: "/couriers/:id/edit",
                show: "/couriers/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <BikeWhiteIcon />,
                },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayoutV2 Header={Header} Title={Title}>
                      <div
                        style={{
                          maxWidth: "1200px",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        <Outlet />
                      </div>
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />

                <Route path="/orders">
                  <Route index element={<OrderList />} />
                  <Route path=":id" element={<OrderShow />} />
                </Route>

                <Route
                  path="/customers"
                  element={
                    <CustomerList>
                      <Outlet />
                    </CustomerList>
                  }
                >
                  <Route path=":id" element={<CustomerShow />} />
                </Route>

                <Route
                  path="/products"
                  element={
                    <ProductList>
                      <Outlet />
                    </ProductList>
                  }
                >
                  <Route path="new" element={<ProductCreate />} />
                  <Route path=":id" element={<ProductShow />} />
                  <Route path=":id/edit" element={<ProductEdit />} />
                </Route>

                <Route path="/stores">
                  <Route index element={<StoreList />} />
                  <Route path="new" element={<StoreCreate />} />
                  <Route path=":id/edit" element={<StoreEdit />} />
                </Route>

                <Route path="/categories" element={<CategoryList />} />

                <Route path="/couriers">
                  <Route
                    path=""
                    element={
                      <CourierList>
                        <Outlet />
                      </CourierList>
                    }
                  >
                    <Route path="new" element={<CourierCreate />} />
                  </Route>

                  <Route path=":id/edit" element={<CourierEdit />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      formProps={{
                        initialValues: {
                          email: "demo@refine.dev",
                          password: "demodemo",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AuthPage
                      type="register"
                      formProps={{
                        initialValues: {
                          email: "demo@refine.dev",
                          password: "demodemo",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                    <ThemedLayoutV2 Header={Header} Title={Title}>
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
            <RefineKbar />
          </Refine>
        </RefineKbarProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
