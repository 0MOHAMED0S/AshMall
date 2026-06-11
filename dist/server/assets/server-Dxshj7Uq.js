import { AsyncLocalStorage } from "node:async_hooks";
import { H3Event, toResponse } from "h3-v2";
import { rootRouteId, parseRedirect, isRedirect, defaultSerovalPlugins, makeSerovalPlugin, createRawStreamRPCPlugin, invariant, isNotFound, resolveManifestAssetLink, getStylesheetHref, createSerializationAdapter, isResolvedRedirect, executeRewriteInput } from "@tanstack/router-core";
import { toCrossJSONStream, fromJSON, toCrossJSONAsync } from "seroval";
import { createMemoryHistory } from "@tanstack/history";
import { mergeHeaders } from "@tanstack/router-core/ssr/client";
import { getNormalizedURL, getOrigin, attachRouterServerSsrUtils } from "@tanstack/router-core/ssr/server";
import "react";
import { RouterProvider } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
import { defineHandlerCallback, renderRouterToStream } from "@tanstack/react-router/ssr/server";
function StartServer(props) {
  return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
  request,
  router,
  responseHeaders,
  children: /* @__PURE__ */ jsx(StartServer, { router })
}));
var GLOBAL_EVENT_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
  return typeof value.then === "function";
}
function getSetCookieValues(headers) {
  const headersWithSetCookie = headers;
  if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
  const value = headers.get("set-cookie");
  return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
  if (response.ok) return;
  const eventSetCookies = getSetCookieValues(event.res.headers);
  if (eventSetCookies.length === 0) return;
  const responseSetCookies = getSetCookieValues(response.headers);
  response.headers.delete("set-cookie");
  for (const cookie of responseSetCookies) response.headers.append("set-cookie", cookie);
  for (const cookie of eventSetCookies) response.headers.append("set-cookie", cookie);
}
function attachResponseHeaders(value, event) {
  if (isPromiseLike(value)) return value.then((resolved) => {
    if (resolved instanceof Response) mergeEventResponseHeaders(resolved, event);
    return resolved;
  });
  if (value instanceof Response) mergeEventResponseHeaders(value, event);
  return value;
}
function requestHandler(handler) {
  return (request, requestOpts) => {
    let h3Event;
    try {
      h3Event = new H3Event(request);
    } catch (error) {
      if (error instanceof URIError) return new Response(null, {
        status: 400,
        statusText: "Bad Request"
      });
      throw error;
    }
    return toResponse(attachResponseHeaders(eventStorage.run({ h3Event }, () => handler(request, requestOpts)), h3Event), h3Event);
  };
}
function getH3Event() {
  const event = eventStorage.getStore();
  if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return event.h3Event;
}
function getRequest() {
  return getH3Event().req;
}
function getResponse() {
  return getH3Event().res;
}
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
async function getStartManifest(matchedRoutes) {
  const { tsrStartManifest } = await import("./_tanstack-start-manifest_v-C9HDk0u1.js");
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let injectedHeadScripts;
  return {
    manifest: {
      inlineCss: startManifest.inlineCss,
      routes: Object.fromEntries(Object.entries(startManifest.routes).flatMap(([k, v]) => {
        const result = {};
        let hasData = false;
        if (v.preloads && v.preloads.length > 0) {
          result["preloads"] = v.preloads;
          hasData = true;
        }
        if (v.assets && v.assets.length > 0) {
          result["assets"] = v.assets;
          hasData = true;
        }
        if (!hasData) return [];
        return [[k, result]];
      }))
    },
    clientEntry: startManifest.clientEntry,
    injectedHeadScripts
  };
}
const manifest = {
  "02d4e7a519bd36241a8e3b58bf299a44228812a5ce879db65dbfe84571dfac79": {
    functionName: "getStoresByIds_createServerFn_handler",
    importer: () => import("./home.functions-0gJsOscT.js")
  },
  "0799ae0b339a07511586b97a94728db79923f64d35ad0560d242b6300d15a313": {
    functionName: "adminGetStoreCredentials_createServerFn_handler",
    importer: () => import("./merchant.functions-CbAstUGb.js")
  },
  "082dbf06af476743390b5a6c3cdff8e0cfa835da67d4e0b87348ea7d02bccda7": {
    functionName: "cancelMyOrder_createServerFn_handler",
    importer: () => import("./orders.functions-ByYj5t6y.js")
  },
  "0b28afb36dfc833476f068d7822248f76a248945b7d20f31d2e85b6c5f4d1370": {
    functionName: "listActiveAds_createServerFn_handler",
    importer: () => import("./ads.functions-B8fHTlAJ.js")
  },
  "0c12dbcfc68bb0ba76488ec4eea1f9a9460356fa48c8599715398da27a322a44": {
    functionName: "adminDeleteSection_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "0ddf57ac23192120a1e98e48f57343c6fe83e8a1ddcf5df54be83354a1f768ad": {
    functionName: "adminDeleteProduct_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "0fef55eef71c739ff5d1ff5eec14fae3da02f5043becd1efa3bd5aa829859cd8": {
    functionName: "listFavorites_createServerFn_handler",
    importer: () => import("./favorites.functions-DqfMNz6Q.js")
  },
  "154b8633eea94111b40f7036631572cb49e5f458d27dce468c3338ae0c0dc0db": {
    functionName: "deleteProduct_createServerFn_handler",
    importer: () => import("./products.functions-D0gshHT9.js")
  },
  "154da85bc7e5915df5164155bbb68a97441082079312d44aab513dabc82f59c3": {
    functionName: "adminSetRole_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "15f2e75a66daeb3bb02995a6ec9720c2223d751ece39bd60c1b92546d4e5e485": {
    functionName: "adminListReviews_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "16adcae68f7f6ee62a1f2c605455af763ee11cf325960f90579e35d6bc275907": {
    functionName: "adminListCategories_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "18bf852c2c44b492ae1aef921e610b96e97ded65ecc99a6c42a2e28e8095049c": {
    functionName: "listReviews_createServerFn_handler",
    importer: () => import("./reviews.functions-De8DOJKh.js")
  },
  "19e69e5bce95f87fda3cd79d3cde7fd938ff089c492831ab05f10fa3c8e23bb8": {
    functionName: "getMerchantDashboard_createServerFn_handler",
    importer: () => import("./merchant.functions-CbAstUGb.js")
  },
  "1a4b43bcd61dce3ff71704a09ed8a697bc102b9662df3f6552a0d82a3e8d60f9": {
    functionName: "listFeaturedNearbyStores_createServerFn_handler",
    importer: () => import("./home.functions-0gJsOscT.js")
  },
  "1cd54dfd63c87639b15ad0645f45822214af342b65becc8c492194ae8dc7a3db": {
    functionName: "adminUpsertSiteSettings_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "1e8d50f0220d5ea834db928ef182466fbaf4c738ee3d823bc2d36b348f43fa3f": {
    functionName: "deliveryUpdateRequest_createServerFn_handler",
    importer: () => import("./delivery.functions-7XJkTzky.js")
  },
  "1f5f256e0d8083b161df4663cdedf6327bf5f10d38ca14d0a1e45c967bf60e55": {
    functionName: "listPopularProducts_createServerFn_handler",
    importer: () => import("./home.functions-0gJsOscT.js")
  },
  "2218ae7e549bdb42cbe227b4909ac2dfe0643e28a4eb9192228c9486574032c1": {
    functionName: "adminCreateDelivery_createServerFn_handler",
    importer: () => import("./delivery.functions-7XJkTzky.js")
  },
  "22d81b800568f4d49051ac9242f417f88c7a9e5a16a9b92c2a35d355e9d48cf3": {
    functionName: "adminUpsertExtra_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "2576c001784b19098cb445ec218013bd519c248827eee8b4a72a49f12490214b": {
    functionName: "adminDeleteDelivery_createServerFn_handler",
    importer: () => import("./delivery.functions-7XJkTzky.js")
  },
  "26ce8044fbf2d5dd1dcad5d9ea4595d5825d39de12a5fc08d8553087f6d25cef": {
    functionName: "listRecentStores_createServerFn_handler",
    importer: () => import("./home.functions-0gJsOscT.js")
  },
  "2951bd39fcb59a048407113c481b15fd695e4a9d3e2f43e52a2e7ab107a2cb63": {
    functionName: "markAllRead_createServerFn_handler",
    importer: () => import("./notifications.functions-DfBKAbXi.js")
  },
  "2c48728010f4471aff8f78d24eed2df8a5b054b8a8af799c6e4eda9f5b59565d": {
    functionName: "listCart_createServerFn_handler",
    importer: () => import("./cart.functions-Cd5cZOIW.js")
  },
  "316e896bf86dae0d4e3059b2b2c7ac20195cb6f62a1d4fd451c27f1a9b5de34b": {
    functionName: "adminGetStoreCatalog_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "3265360dd1bb8505874dca36fc08c120c489507fb549e4925a945a8286e7a79a": {
    functionName: "listMyOrders_createServerFn_handler",
    importer: () => import("./orders.functions-ByYj5t6y.js")
  },
  "3337831eabcbeff783b9046181bf907f45a0e670191e3c1928ea84e3f9e97c0a": {
    functionName: "adminBroadcast_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240": {
    functionName: "adminListUsers_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "385e76cdf807dd53711b6f969d894db85cf9b0ca7a6373bb34c6352adedccb64": {
    functionName: "markNotificationRead_createServerFn_handler",
    importer: () => import("./notifications.functions-DfBKAbXi.js")
  },
  "3b590ebaf77d258dc6bb4087c32f0c07113405d98fff037d23dcaeefe3b49c7a": {
    functionName: "merchantUpdateOrderStatus_createServerFn_handler",
    importer: () => import("./merchant.functions-CbAstUGb.js")
  },
  "42c0af1650050adbde682e7452bfce2ce235c6bfa6abeac7937c1efb0b95a74a": {
    functionName: "adminToggleDelivery_createServerFn_handler",
    importer: () => import("./delivery.functions-7XJkTzky.js")
  },
  "42de0c8cb8ebcb7de3efb34f033c04a87a31e15f24797cb312b022900f84859d": {
    functionName: "adminResetMerchantPassword_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "49030d49072c92cf9dabe52828662d781f3ac1cc11445593f8a488151e2c8f07": {
    functionName: "applyForStore_createServerFn_handler",
    importer: () => import("./stores.functions-nHOK-474.js")
  },
  "4d172b19c0763e2d8fd96561556b6cc25d083064f5c5defbfa4404fbac8625a0": {
    functionName: "toggleFavorite_createServerFn_handler",
    importer: () => import("./favorites.functions-DqfMNz6Q.js")
  },
  "573be2cdf3c95bfa88f6bb3d2080ff0b0c620db545ac53f2f5a039a50348d737": {
    functionName: "adminListOrders_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "5a00ccb4e9933b86dd232a13a10cd00ece386fbea93819af04017667a80f6ef7": {
    functionName: "adminUpsertVariant_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "5a04121677d3e65ffa270b8996711c244063b84471f0f9b4ab84f840ae1fb9f9": {
    functionName: "adminUpdateStore_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "5db9e87d549a71479f0b60d9157e9d2b2071c70442f321ca27f8084bbb8e47cb": {
    functionName: "adminListDelivery_createServerFn_handler",
    importer: () => import("./delivery.functions-7XJkTzky.js")
  },
  "605c0e783f06a410abf97ec27974b61fe90c878cfeb4f75058ef327e6ba5bace": {
    functionName: "adminUpsertProduct_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "6098d7c545fd04a6b8c0631e0de77760fe299c6ba31834ee9696d393e18e17ee": {
    functionName: "adminDeleteMerchant_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "632229d5d7624c31770859dad5c3cec4e7f8ab7cef2042ddf2abf85fe8f3b874": {
    functionName: "replaceCartAndAdd_createServerFn_handler",
    importer: () => import("./cart.functions-Cd5cZOIW.js")
  },
  "65dbdd42678d4cf3348f8143806993df600c6d6e2d11eded1594324413609a95": {
    functionName: "adminOverview_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "69329ca9e2ea9d8fedfa436e83190e53f00dd8a9ad23912e6fa18af9afd9441f": {
    functionName: "adminCreateStore_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "6bada778c941c28d8f4bb5693567682fcc0a8cc5f8e134db94c3d77ba2454fce": {
    functionName: "adminUpsertCategory_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "6e1c851c26039a1e477558b67785ba4bc850b6cd7fffb599cf92eb098ba0b277": {
    functionName: "getSiteSettings_createServerFn_handler",
    importer: () => import("./site-settings.functions-CO3nrvMG.js")
  },
  "70be012ea44ce688beab96ae8c1cf36c639ba53bf34207e89caac6ed540441f5": {
    functionName: "adminUpdateProduct_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "71193263ad6fe16869da2a6db5a7c64cc64998622ac4022c99bfe83df854ac31": {
    functionName: "adminListMerchants_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "7b56f205859d8fb93a1fe62324e635a8a2d99c549e0766896fdf1a658999bc4c": {
    functionName: "searchSuggestions_createServerFn_handler",
    importer: () => import("./suggestions.functions-DbWN_coe.js")
  },
  "84594e55e04dfcaa530832ec8bcbb94e1cdbd57c355b957210000a9e90754da5": {
    functionName: "listMyStores_createServerFn_handler",
    importer: () => import("./stores.functions-nHOK-474.js")
  },
  "853897e326dd61bfc50a155e64353f1d22f1728ed7aa992d071369a5c124ca85": {
    functionName: "adminListAds_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "8571920cee1e1bd25ce5aba7013a1ef30afbdac6d033bf073ec0bcdb5605f50b": {
    functionName: "adminListStoresByCategory_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "8e7d8cf9b5d066566cea70d750fc021a9c6face359f986e6b566c7d5d45a92b0": {
    functionName: "listCategoriesWithCounts_createServerFn_handler",
    importer: () => import("./stores.functions-nHOK-474.js")
  },
  "8ee2877abc326cd4cce0a8c31341bed607d66ac290d21cd8d4f45868e9cf2ed7": {
    functionName: "updateCartItem_createServerFn_handler",
    importer: () => import("./cart.functions-Cd5cZOIW.js")
  },
  "8f27371ce786bca7dd2e87bc5c1736f014bcbfbdc236a42ea3d290e57c50f511": {
    functionName: "claimStoreOwnerRole_createServerFn_handler",
    importer: () => import("./owner.functions-BKQttAI_.js")
  },
  "934342accf617b315aec8af1950863253e71fc5f64df056b1661c282f5284602": {
    functionName: "getCategoryBySlug_createServerFn_handler",
    importer: () => import("./stores.functions-nHOK-474.js")
  },
  "950328abc056627e7020b8ee4af15de2c8185c6b4f0fa341cec497db75a14951": {
    functionName: "adminDeleteCategory_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "9505b54584006d8459dff4f0d9b2b1ccc184fc05200648ce850e9f9f7ee3f723": {
    functionName: "adminUpdateOrderStatus_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "98787e5b2da655fe7409fdd63de3f13493a4fa74a01518d853ae680bb7821f02": {
    functionName: "addToCart_createServerFn_handler",
    importer: () => import("./cart.functions-Cd5cZOIW.js")
  },
  "9932f7d91182148199cbc8b49e99aa83ab2855e0f2166e0d0e38e6c091b587df": {
    functionName: "adminListProducts_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "9c0faecd2b84a861e11a965da878f25e8d4297ddc27c8e650c9fbb2730083cc7": {
    functionName: "getStoreBySlug_createServerFn_handler",
    importer: () => import("./stores.functions-nHOK-474.js")
  },
  "a5e49249b72a1c4a65f74bebe4f19c3e7987e76bb8ff6b8d0c8f3dc6a74c7fcc": {
    functionName: "adminDeleteReview_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "a9ba30adf2430240c88c80b23fac1cbe86400cfa4a9385e5108548c5c5a17240": {
    functionName: "adminDeleteProductFull_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "aa03a3e53a6ea777f9a1686c4b129ba736a41df27c24c4d984b8242d993121c0": {
    functionName: "adminCreateMerchantForStore_createServerFn_handler",
    importer: () => import("./merchant.functions-CbAstUGb.js")
  },
  "abc007195f92a5377b70dde90a4465315a61f009177f5672779e0f24fc7fd1c6": {
    functionName: "removeCartItem_createServerFn_handler",
    importer: () => import("./cart.functions-Cd5cZOIW.js")
  },
  "ac40bde93ee29e7711dec098b29535634e8fccf96b1a40bc5b1ed2566806d5b4": {
    functionName: "listStores_createServerFn_handler",
    importer: () => import("./stores.functions-nHOK-474.js")
  },
  "acc80f592bb436c21cdce6e1d5d6087ef2a2f0e66f3aa25c96c83356a4766324": {
    functionName: "createProduct_createServerFn_handler",
    importer: () => import("./products.functions-D0gshHT9.js")
  },
  "ad0c092d9068302d584e4ee6c929270ef251348f837bd3ea129892db963c741d": {
    functionName: "adminAnalytics_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "ad33e27f962dcec924c42c5da698dcc6f8fa972e85e8b3d98623ab5e69687a68": {
    functionName: "listProductsByStore_createServerFn_handler",
    importer: () => import("./products.functions-D0gshHT9.js")
  },
  "ad9dc4c36d8499f8073c2f99556002920c797a2385e55133782fa2f5af4e07a8": {
    functionName: "merchantRequestDelivery_createServerFn_handler",
    importer: () => import("./merchant.functions-CbAstUGb.js")
  },
  "adf61c7212b1948e5c9e6ed11636e3e5882e1956e31fa4c98543fa951ead7c93": {
    functionName: "adminListStores_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "b78a92e882e36e3fd925546c5017fbc3b870c8c72002d577869e00aed1f0f405": {
    functionName: "getDeliveryDashboard_createServerFn_handler",
    importer: () => import("./delivery.functions-7XJkTzky.js")
  },
  "ba8134f2138ab250650c30c0f838f039ba3ab202f24ef535680b5852675dd7a0": {
    functionName: "adminListStoresLite_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "c017b24a4940a916334ff23b3f3461893d7b3f151e06bac76f968dd27c3f187b": {
    functionName: "listNotifications_createServerFn_handler",
    importer: () => import("./notifications.functions-DfBKAbXi.js")
  },
  "c296ad3bf21b1f415596378993f7a6e9b14cc01e974e606213cfb1acac3bde67": {
    functionName: "adminDeleteExtra_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "c6fd167a4f1f166f4c5cd59a144bcd8b37f1b24147a3dd0a03efdf9df7f7fe0b": {
    functionName: "adminUpsertSection_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "c7fb84471f1ed3c620fa7f14e779f4ce4ede1d66e883ca357ba6cee390bd57c9": {
    functionName: "getProductById_createServerFn_handler",
    importer: () => import("./products.functions-D0gshHT9.js")
  },
  "cba90266c9a7758c97eb8361bbee0e080b445247010a30e61a622d12457b64f7": {
    functionName: "adminDeleteStore_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "ccbb718a7cd4d38f405c6e0242637bd4482ef78d17494679c238bdadfe809387": {
    functionName: "getStoreSmartCatalog_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "cdbad617f7babe1009cf1458c81d2e5d883fdf928195933e3909136eacd9ad87": {
    functionName: "listDiscountProducts_createServerFn_handler",
    importer: () => import("./home.functions-0gJsOscT.js")
  },
  "ce6a536774dc23197ca25305cdef564d67785441a1af7032509a3acafaa472f0": {
    functionName: "submitReview_createServerFn_handler",
    importer: () => import("./reviews.functions-De8DOJKh.js")
  },
  "cfe34a05ba5e852b008f6bec897d2b36fca1ee6c5201253018d2604dac687329": {
    functionName: "smartSearch_createServerFn_handler",
    importer: () => import("./search.functions-a1h8Td9H.js")
  },
  "d3f43b1c7a31820ee274e1b8d6bbf934b29168c957e85bc31b74f7189df0c7aa": {
    functionName: "placeOrdersFromCart_createServerFn_handler",
    importer: () => import("./orders.functions-ByYj5t6y.js")
  },
  "d40176337b963db22a207dc9644bef998ad409ffe9459a127a9a0652b368e22a": {
    functionName: "ensureMerchantShortcut_createServerFn_handler",
    importer: () => import("./merchant-shortcut.functions-CvtYDzdu.js")
  },
  "d8084ea51bce5c31e5323fe1c90745c7c9143261d63f2d671209023a0d9ea1fc": {
    functionName: "adminUpsertAd_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "db83bc6b01fa8e833b8f7e0a912abd2b45f46a03a366e6951704b573371b9d7b": {
    functionName: "adminDeleteAd_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "e5d25d4c9d932efe0e33a86085dce55667d33c751941822355ba609e2ca30ad2": {
    functionName: "adminDeleteVariant_createServerFn_handler",
    importer: () => import("./catalog.functions-Cy-YT77e.js")
  },
  "e7a929967dfa37f7137f73c16030cdccf6661275806e33b9e440f476babedb39": {
    functionName: "isFavorited_createServerFn_handler",
    importer: () => import("./favorites.functions-DqfMNz6Q.js")
  },
  "ef77b1c0232c7304ff62bb9380a5ae2415adc96f0eb603b4ece40932b1a36cf5": {
    functionName: "adminCreateMerchant_createServerFn_handler",
    importer: () => import("./admin.functions-BF3zLGw5.js")
  },
  "f8e44893abf6b8970c5449d351a27065a6072a28330cc7382313a6d683dde0da": {
    functionName: "listMyStoreProducts_createServerFn_handler",
    importer: () => import("./products.functions-D0gshHT9.js")
  },
  "f8ffd6e3c7dd5735d457cd2a439cc9e22142f27ba42701da3537721333fd7849": {
    functionName: "clearCart_createServerFn_handler",
    importer: () => import("./cart.functions-Cd5cZOIW.js")
  }
};
async function getServerFnById(id, access) {
  const serverFnInfo = manifest[id];
  if (!serverFnInfo) {
    throw new Error("Server function info not found for " + id);
  }
  const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
  if (!fnModule) {
    throw new Error("Server function module not resolved for " + id);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    throw new Error("Server function module export not resolved for serverFn ID: " + id);
  }
  return action;
}
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
var FrameType = {
  JSON: 0,
  CHUNK: 1,
  END: 2,
  ERROR: 3
};
var FRAME_HEADER_SIZE = 9;
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
function isSafeKey(key) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
function safeObjectMerge(target, source) {
  const result = /* @__PURE__ */ Object.create(null);
  if (target) {
    for (const key of Object.keys(target)) if (isSafeKey(key)) result[key] = target[key];
  }
  if (source && typeof source === "object") {
    for (const key of Object.keys(source)) if (isSafeKey(key)) result[key] = source[key];
  }
  return result;
}
function createNullProtoObject(source) {
  if (!source) return /* @__PURE__ */ Object.create(null);
  const obj = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(source)) if (isSafeKey(key)) obj[key] = source[key];
  return obj;
}
var GLOBAL_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return context;
}
var getStartOptions = () => getStartContext().startOptions;
var getStartContextServerOnly = getStartContext;
var createServerFn = (options, __opts) => {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
  const res = {
    options: resolvedOptions,
    middleware: (middleware) => {
      const newMiddleware = [...resolvedOptions.middleware || []];
      middleware.map((m) => {
        if (TSS_SERVER_FUNCTION_FACTORY in m) {
          if (m.options.middleware) newMiddleware.push(...m.options.middleware);
        } else newMiddleware.push(m);
      });
      const res2 = createServerFn(void 0, {
        ...resolvedOptions,
        middleware: newMiddleware
      });
      res2[TSS_SERVER_FUNCTION_FACTORY] = true;
      return res2;
    },
    inputValidator: (inputValidator) => {
      return createServerFn(void 0, {
        ...resolvedOptions,
        inputValidator
      });
    },
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      const newOptions = {
        ...resolvedOptions,
        extractedFn,
        serverFn
      };
      const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
      extractedFn.method = resolvedOptions.method;
      return Object.assign(async (opts) => {
        const result = await executeMiddleware$1(resolvedMiddleware, "client", {
          ...extractedFn,
          ...newOptions,
          data: opts?.data,
          headers: opts?.headers,
          signal: opts?.signal,
          fetch: opts?.fetch,
          context: createNullProtoObject()
        });
        const redirect = parseRedirect(result.error);
        if (redirect) throw redirect;
        if (result.error) throw result.error;
        return result.result;
      }, {
        ...extractedFn,
        method: resolvedOptions.method,
        __executeServer: async (opts) => {
          const startContext = getStartContextServerOnly();
          const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
          return await executeMiddleware$1(resolvedMiddleware, "server", {
            ...extractedFn,
            ...opts,
            serverFnMeta: extractedFn.serverFnMeta,
            context: safeObjectMerge(opts.context, serverContextAfterGlobalMiddlewares),
            request: startContext.request
          }).then((d) => ({
            result: d.result,
            error: d.error,
            context: d.sendContext
          }));
        }
      });
    }
  };
  const fun = (options2) => {
    return createServerFn(void 0, {
      ...resolvedOptions,
      ...options2
    });
  };
  return Object.assign(fun, res);
};
async function executeMiddleware$1(middlewares, env, opts) {
  let flattenedMiddlewares = flattenMiddlewares([...getStartOptions()?.functionMiddleware || [], ...middlewares]);
  if (env === "server") {
    const startContext = getStartContextServerOnly({ throwIfNotFound: false });
    if (startContext?.executedRequestMiddlewares) flattenedMiddlewares = flattenedMiddlewares.filter((m) => !startContext.executedRequestMiddlewares.has(m));
  }
  const callNextMiddleware = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) return ctx;
    try {
      if ("inputValidator" in nextMiddleware.options && nextMiddleware.options.inputValidator && env === "server") ctx.data = await execValidator(nextMiddleware.options.inputValidator, ctx.data);
      let middlewareFn = void 0;
      if (env === "client") {
        if ("client" in nextMiddleware.options) middlewareFn = nextMiddleware.options.client;
      } else if ("server" in nextMiddleware.options) middlewareFn = nextMiddleware.options.server;
      if (middlewareFn) {
        const userNext = async (userCtx = {}) => {
          const result2 = await callNextMiddleware({
            ...ctx,
            ...userCtx,
            context: safeObjectMerge(ctx.context, userCtx.context),
            sendContext: safeObjectMerge(ctx.sendContext, userCtx.sendContext),
            headers: mergeHeaders(ctx.headers, userCtx.headers),
            _callSiteFetch: ctx._callSiteFetch,
            fetch: ctx._callSiteFetch ?? userCtx.fetch ?? ctx.fetch,
            result: userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : ctx.result,
            error: userCtx.error ?? ctx.error
          });
          if (result2.error) throw result2.error;
          return result2;
        };
        const result = await middlewareFn({
          ...ctx,
          next: userNext
        });
        if (isRedirect(result)) return {
          ...ctx,
          error: result
        };
        if (result instanceof Response) return {
          ...ctx,
          result
        };
        if (!result) throw new Error("User middleware returned undefined. You must call next() or return a result in your middlewares.");
        return result;
      }
      return callNextMiddleware(ctx);
    } catch (error) {
      return {
        ...ctx,
        error
      };
    }
  };
  return callNextMiddleware({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || createNullProtoObject(),
    _callSiteFetch: opts.fetch
  });
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware, depth) => {
    if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
    middleware.forEach((m) => {
      if (m.options.middleware) recurse(m.options.middleware, depth + 1);
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares, 0);
  return flattened;
}
async function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = await validator["~standard"].validate(input);
    if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) return validator.parse(input);
  if (typeof validator === "function") return validator(input);
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    "~types": void 0,
    options: {
      inputValidator: options.inputValidator,
      client: async ({ next, sendContext, fetch: fetch2, ...ctx }) => {
        const payload = {
          ...ctx,
          context: sendContext,
          fetch: fetch2
        };
        return next(await options.extractedFn?.(payload));
      },
      server: async ({ next, ...ctx }) => {
        const result = await options.serverFn?.(ctx);
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
var createMiddleware = (options, __opts) => {
  const resolvedOptions = {
    type: "request",
    ...__opts || options
  };
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
    },
    inputValidator: (inputValidator) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { inputValidator }));
    },
    client: (client) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { client }));
    },
    server: (server2) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { server: server2 }));
    }
  };
};
var innerCreateCsrfMiddleware = (opts = {}) => {
  const middleware = createMiddleware().server(async (ctx) => {
    const csrfCtx = ctx;
    if (opts.filter && !await opts.filter(csrfCtx)) return ctx.next();
    if (await isCsrfRequestAllowed(opts, csrfCtx)) return ctx.next();
    return getFailureResponse(opts, csrfCtx);
  });
  return middleware;
};
var createCsrfMiddleware = innerCreateCsrfMiddleware;
async function isCsrfRequestAllowed(opts, ctx) {
  const result = await getCsrfRequestValidationResult(opts, ctx);
  return result === true || result === void 0 && opts.allowRequestsWithoutOriginCheck === true;
}
async function getCsrfRequestValidationResult(opts, ctx) {
  const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
  if (fetchSite !== null) return matchValue(opts.secFetchSite ?? "same-origin", fetchSite, ctx);
  const origin = ctx.request.headers.get("Origin");
  if (origin !== null) {
    if (opts.origin) return matchValue(opts.origin, origin, ctx);
    return origin === new URL(ctx.request.url).origin;
  }
  const referer = ctx.request.headers.get("Referer");
  if (referer === null || opts.referer === false) return;
  if (typeof opts.referer === "function") return opts.referer(referer, ctx);
  if (opts.origin) {
    const refererOrigin = getOriginFromUrl(referer);
    return refererOrigin !== void 0 && matchValue(opts.origin, refererOrigin, ctx);
  }
  return isRefererSameOrigin(referer, new URL(ctx.request.url).origin);
}
async function matchValue(matcher, value, ctx) {
  if (typeof matcher === "function") return matcher(value, ctx);
  if (Array.isArray(matcher)) return matcher.includes(value);
  return value === matcher;
}
function getOriginFromUrl(url) {
  try {
    return new URL(url).origin;
  } catch {
    return;
  }
}
function isRefererSameOrigin(referer, requestOrigin) {
  if (referer === requestOrigin) return true;
  if (!referer.startsWith(requestOrigin)) return false;
  if (referer.length === requestOrigin.length) return true;
  const code = referer.charCodeAt(requestOrigin.length);
  return code === 47 || code === 63 || code === 35;
}
async function getFailureResponse(opts, ctx) {
  if (typeof opts.failureResponse === "function") return opts.failureResponse(ctx);
  return opts.failureResponse?.clone() ?? new Response("Forbidden", {
    status: 403
  });
}
function getDefaultSerovalPlugins() {
  return [...getStartOptions()?.serializationAdapters?.map(makeSerovalPlugin) ?? [], ...defaultSerovalPlugins];
}
var textEncoder = new TextEncoder();
var EMPTY_PAYLOAD = new Uint8Array(0);
function encodeFrame(type, streamId, payload) {
  const frame = new Uint8Array(FRAME_HEADER_SIZE + payload.length);
  frame[0] = type;
  frame[1] = streamId >>> 24 & 255;
  frame[2] = streamId >>> 16 & 255;
  frame[3] = streamId >>> 8 & 255;
  frame[4] = streamId & 255;
  frame[5] = payload.length >>> 24 & 255;
  frame[6] = payload.length >>> 16 & 255;
  frame[7] = payload.length >>> 8 & 255;
  frame[8] = payload.length & 255;
  frame.set(payload, FRAME_HEADER_SIZE);
  return frame;
}
function encodeJSONFrame(json) {
  return encodeFrame(FrameType.JSON, 0, textEncoder.encode(json));
}
function encodeChunkFrame(streamId, chunk) {
  return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
function encodeEndFrame(streamId) {
  return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
function encodeErrorFrame(streamId, error) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return encodeFrame(FrameType.ERROR, streamId, textEncoder.encode(message));
}
function createMultiplexedStream(jsonStream, rawStreams, lateStreamSource) {
  let controller;
  let cancelled = false;
  const readers = [];
  const enqueue = (frame) => {
    if (cancelled) return false;
    try {
      controller.enqueue(frame);
      return true;
    } catch {
      return false;
    }
  };
  const errorOutput = (error) => {
    if (cancelled) return;
    cancelled = true;
    try {
      controller.error(error);
    } catch {
    }
    for (const reader of readers) reader.cancel().catch(() => {
    });
  };
  async function pumpRawStream(streamId, stream) {
    const reader = stream.getReader();
    readers.push(reader);
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) {
          enqueue(encodeEndFrame(streamId));
          return;
        }
        if (!enqueue(encodeChunkFrame(streamId, value))) return;
      }
    } catch (error) {
      enqueue(encodeErrorFrame(streamId, error));
    } finally {
      reader.releaseLock();
    }
  }
  async function pumpJSON() {
    const reader = jsonStream.getReader();
    readers.push(reader);
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) return;
        if (!enqueue(encodeJSONFrame(value))) return;
      }
    } catch (error) {
      errorOutput(error);
      throw error;
    } finally {
      reader.releaseLock();
    }
  }
  async function pumpLateStreams() {
    if (!lateStreamSource) return [];
    const lateStreamPumps = [];
    const reader = lateStreamSource.getReader();
    readers.push(reader);
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) break;
        lateStreamPumps.push(pumpRawStream(value.id, value.stream));
      }
    } finally {
      reader.releaseLock();
    }
    return lateStreamPumps;
  }
  return new ReadableStream({
    async start(ctrl) {
      controller = ctrl;
      const pumps = [pumpJSON()];
      for (const [streamId, stream] of rawStreams) pumps.push(pumpRawStream(streamId, stream));
      if (lateStreamSource) pumps.push(pumpLateStreams());
      try {
        const latePumps = (await Promise.all(pumps)).find(Array.isArray);
        if (latePumps && latePumps.length > 0) await Promise.all(latePumps);
        if (!cancelled) try {
          controller.close();
        } catch {
        }
      } catch {
      }
    },
    cancel() {
      cancelled = true;
      for (const reader of readers) reader.cancel().catch(() => {
      });
      readers.length = 0;
    }
  });
}
var serovalPlugins = void 0;
var FORM_DATA_CONTENT_TYPES = ["multipart/form-data", "application/x-www-form-urlencoded"];
var MAX_PAYLOAD_SIZE = 1e6;
var handleServerAction = async ({ request, context, serverFnId }) => {
  const methodUpper = request.method.toUpperCase();
  const url = new URL(request.url);
  const action = await getServerFnById(serverFnId);
  if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
    status: 405,
    headers: { Allow: action.method }
  });
  const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
  if (!serovalPlugins) serovalPlugins = getDefaultSerovalPlugins();
  const contentType = request.headers.get("Content-Type");
  function parsePayload(payload) {
    return fromJSON(payload, { plugins: serovalPlugins });
  }
  return await (async () => {
    try {
      let serializeResult = function(res2) {
        let nonStreamingBody = void 0;
        const alsResponse = getResponse();
        if (res2 !== void 0) {
          const rawStreams = /* @__PURE__ */ new Map();
          let initialPhase = true;
          let lateStreamWriter;
          let lateStreamReadable = void 0;
          const pendingLateStreams = [];
          const plugins = [createRawStreamRPCPlugin((id, stream) => {
            if (initialPhase) {
              rawStreams.set(id, stream);
              return;
            }
            if (lateStreamWriter) {
              lateStreamWriter.write({
                id,
                stream
              }).catch(() => {
              });
              return;
            }
            pendingLateStreams.push({
              id,
              stream
            });
          }), ...serovalPlugins || []];
          let done = false;
          const callbacks = {
            onParse: (value) => {
              nonStreamingBody = value;
            },
            onDone: () => {
              done = true;
            },
            onError: (error) => {
              throw error;
            }
          };
          toCrossJSONStream(res2, {
            refs: /* @__PURE__ */ new Map(),
            plugins,
            onParse(value) {
              callbacks.onParse(value);
            },
            onDone() {
              callbacks.onDone();
            },
            onError: (error) => {
              callbacks.onError(error);
            }
          });
          initialPhase = false;
          if (done && rawStreams.size === 0) return new Response(nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0, {
            status: alsResponse.status,
            statusText: alsResponse.statusText,
            headers: {
              "Content-Type": "application/json",
              [X_TSS_SERIALIZED]: "true"
            }
          });
          const { readable, writable } = new TransformStream();
          lateStreamReadable = readable;
          lateStreamWriter = writable.getWriter();
          for (const registration of pendingLateStreams) lateStreamWriter.write(registration).catch(() => {
          });
          pendingLateStreams.length = 0;
          const multiplexedStream = createMultiplexedStream(new ReadableStream({
            start(controller) {
              callbacks.onParse = (value) => {
                controller.enqueue(JSON.stringify(value) + "\n");
              };
              callbacks.onDone = () => {
                try {
                  controller.close();
                } catch {
                }
                lateStreamWriter?.close().catch(() => {
                }).finally(() => {
                  lateStreamWriter = void 0;
                });
              };
              callbacks.onError = (error) => {
                controller.error(error);
                lateStreamWriter?.abort(error).catch(() => {
                }).finally(() => {
                  lateStreamWriter = void 0;
                });
              };
              if (nonStreamingBody !== void 0) callbacks.onParse(nonStreamingBody);
              if (done) callbacks.onDone();
            },
            cancel() {
              lateStreamWriter?.abort().catch(() => {
              });
              lateStreamWriter = void 0;
            }
          }), rawStreams, lateStreamReadable);
          return new Response(multiplexedStream, {
            status: alsResponse.status,
            statusText: alsResponse.statusText,
            headers: {
              "Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
              [X_TSS_SERIALIZED]: "true"
            }
          });
        }
        return new Response(void 0, {
          status: alsResponse.status,
          statusText: alsResponse.statusText
        });
      };
      let res = await (async () => {
        if (FORM_DATA_CONTENT_TYPES.some((type) => contentType && contentType.includes(type))) {
          if (methodUpper === "GET") {
            if (false) ;
            invariant();
          }
          const formData = await request.formData();
          const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
          formData.delete(TSS_FORMDATA_CONTEXT);
          const params = {
            context,
            data: formData,
            method: methodUpper
          };
          if (typeof serializedContext === "string") try {
            const deserializedContext = fromJSON(JSON.parse(serializedContext), { plugins: serovalPlugins });
            if (typeof deserializedContext === "object" && deserializedContext) params.context = safeObjectMerge(deserializedContext, context);
          } catch (e) {
            if (false) ;
          }
          return await action(params);
        }
        if (methodUpper === "GET") {
          const payloadParam = url.searchParams.get("payload");
          if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
          const payload2 = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
          payload2.context = safeObjectMerge(payload2.context, context);
          payload2.method = methodUpper;
          return await action(payload2);
        }
        let jsonPayload;
        if (contentType?.includes("application/json")) jsonPayload = await request.json();
        const payload = jsonPayload ? parsePayload(jsonPayload) : {};
        payload.context = safeObjectMerge(payload.context, context);
        payload.method = methodUpper;
        return await action(payload);
      })();
      const unwrapped = res.result || res.error;
      if (isNotFound(res)) res = isNotFoundResponse(res);
      if (!isServerFn) return unwrapped;
      if (unwrapped instanceof Response) {
        if (isRedirect(unwrapped)) return unwrapped;
        unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
        return unwrapped;
      }
      return serializeResult(res);
    } catch (error) {
      if (error instanceof Response) return error;
      if (isNotFound(error)) return isNotFoundResponse(error);
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      const serializedError = JSON.stringify(await Promise.resolve(toCrossJSONAsync(error, {
        refs: /* @__PURE__ */ new Map(),
        plugins: serovalPlugins
      })));
      const response = getResponse();
      return new Response(serializedError, {
        status: response.status ?? 500,
        statusText: response.statusText,
        headers: {
          "Content-Type": "application/json",
          [X_TSS_SERIALIZED]: "true"
        }
      });
    }
  })();
};
function isNotFoundResponse(error) {
  const { headers, ...rest } = error;
  return new Response(JSON.stringify(rest), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
  "fetch",
  "font",
  "image",
  "script",
  "style",
  "track"
]);
function buildLinkParam(name, value) {
  if (value === void 0) return name;
  if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
  return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
  const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
  if (hint.as) parts.push(buildLinkParam("as", hint.as));
  if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
  if (hint.type) parts.push(buildLinkParam("type", hint.type));
  if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
  if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
  if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
  return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
  const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
  return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
  const as = getStringAttr(attrs, "as");
  return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
  const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
  const type = getStringAttr(attrs, "type");
  const integrity = getStringAttr(attrs, "integrity");
  const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
  const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
  if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
  if (type) hint.type = type;
  if (integrity) hint.integrity = integrity;
  if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
  if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
  const href = getStringAttr(attrs, "href");
  const rel = getStringAttr(attrs, "rel");
  if (!href || !rel) return void 0;
  const relTokens = rel.split(/\s+/);
  let hintRel;
  let hintAs;
  if (relTokens.includes("modulepreload")) {
    hintRel = "modulepreload";
    hintAs = "script";
  } else if (relTokens.includes("stylesheet")) {
    hintRel = "preload";
    hintAs = "style";
  } else if (relTokens.includes("preload")) {
    hintAs = getPreloadAs(attrs);
    if (!hintAs) return void 0;
    hintRel = "preload";
  } else if (relTokens.includes("preconnect")) {
    hintRel = "preconnect";
    hintAs = void 0;
  } else if (relTokens.includes("dns-prefetch")) {
    hintRel = "dns-prefetch";
    hintAs = void 0;
  }
  if (!hintRel) return void 0;
  const hint = {
    href,
    rel: hintRel
  };
  if (hintAs) hint.as = hintAs;
  addEarlyHintFetchAttrs(hint, attrs);
  return hint;
}
function collectStaticHintsFromManifest(manifest2, matchedRoutes) {
  const hints = [];
  for (const route of matchedRoutes) {
    const routeManifest = manifest2.routes[route.id];
    if (!routeManifest) continue;
    for (const link of routeManifest.preloads ?? []) {
      const { href, crossOrigin } = resolveManifestAssetLink(link);
      const hint = {
        href,
        rel: "modulepreload",
        as: "script"
      };
      if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
      hints.push(hint);
    }
    for (const asset of routeManifest.assets ?? []) {
      if (asset.tag !== "link") continue;
      const stylesheetHref = getStylesheetHref(asset);
      if (stylesheetHref) {
        if (manifest2.inlineCss?.styles[stylesheetHref] !== void 0) continue;
        const hint2 = {
          href: stylesheetHref,
          rel: "preload",
          as: "style"
        };
        addEarlyHintFetchAttrs(hint2, asset.attrs);
        hints.push(hint2);
        continue;
      }
      const hint = linkAttrsToEarlyHint(asset.attrs);
      if (hint) hints.push(hint);
    }
  }
  return hints;
}
function collectDynamicHintsFromMatches(matches) {
  const hints = [];
  for (const match of matches) {
    const links = match.links;
    if (!Array.isArray(links)) continue;
    for (const link of links) {
      const hint = linkAttrsToEarlyHint(link);
      if (hint) hints.push(hint);
    }
  }
  return hints;
}
function createEarlyHintsEvent(opts) {
  const nextHints = [];
  const nextLinks = [];
  for (const hint of opts.hints) {
    const link = serializeEarlyHint(hint);
    if (opts.sentLinks.has(link)) continue;
    opts.sentLinks.add(link);
    opts.sentHints.push(hint);
    nextHints.push(hint);
    nextLinks.push(link);
  }
  if (!nextHints.length && opts.phase !== "dynamic") return void 0;
  return {
    phase: opts.phase,
    hints: nextHints,
    links: nextLinks,
    allHints: opts.sentHints.slice(),
    allLinks: Array.from(opts.sentLinks)
  };
}
function createResponseLinkHeaderEntries(opts) {
  for (const hint of opts.hints) {
    const link = serializeEarlyHint(hint);
    if (opts.sentLinks.has(link)) continue;
    opts.sentLinks.add(link);
    opts.entries.push({
      phase: opts.phase,
      hint,
      link
    });
  }
}
function getResponseLinkHeaderEntries(opts) {
  if (!opts.filter) return opts.entries.map((entry) => entry.link);
  try {
    const links = [];
    for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
    return links;
  } catch (err) {
    console.error("Error filtering response Link headers:", err);
    return [];
  }
}
function notifyEarlyHints(phase, event, onEarlyHints) {
  try {
    const result = onEarlyHints(event);
    if (result) Promise.resolve(result).catch((err) => {
      console.error(`Error sending ${phase} early hints:`, err);
    });
  } catch (err) {
    console.error(`Error sending ${phase} early hints:`, err);
  }
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
  if (typeof responseLinkHeader !== "object") return;
  return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
  for (const link of getResponseLinkHeaderEntries(opts)) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
  for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
    phase: opts.phase,
    hint: opts.event.hints[index],
    link: opts.event.links[index]
  });
}
function collectEarlyHintsPhase(opts) {
  const event = opts.onEarlyHints ? createEarlyHintsEvent({
    phase: opts.phase,
    hints: opts.hints,
    sentLinks: opts.sentLinks,
    sentHints: opts.sentHints
  }) : void 0;
  if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
  if (!opts.responseLinkHeaderEntries) return;
  if (event) {
    collectResponseLinkHeaderEntries({
      phase: opts.phase,
      event,
      entries: opts.responseLinkHeaderEntries
    });
    return;
  }
  createResponseLinkHeaderEntries({
    phase: opts.phase,
    hints: opts.hints,
    sentLinks: opts.sentLinks,
    entries: opts.responseLinkHeaderEntries
  });
}
function createEarlyHintsCollector(opts) {
  if (!opts?.onEarlyHints && !opts?.responseLinkHeader) return;
  const sentLinks = /* @__PURE__ */ new Set();
  const sentHints = opts.onEarlyHints ? new Array() : void 0;
  const responseLinkHeaderEntries = opts.responseLinkHeader ? new Array() : void 0;
  const responseLinkHeaderFilter = getResponseLinkHeaderFilter(opts.responseLinkHeader);
  return {
    collectStatic: ({ manifest: manifest2, matchedRoutes }) => {
      if (!matchedRoutes?.length) return;
      collectEarlyHintsPhase({
        phase: "static",
        hints: collectStaticHintsFromManifest(manifest2, matchedRoutes),
        sentLinks,
        sentHints,
        onEarlyHints: opts.onEarlyHints,
        responseLinkHeaderEntries
      });
    },
    collectDynamic: (matches) => {
      collectEarlyHintsPhase({
        phase: "dynamic",
        hints: collectDynamicHintsFromMatches(matches),
        sentLinks,
        sentHints,
        onEarlyHints: opts.onEarlyHints,
        responseLinkHeaderEntries
      });
    },
    appendResponseHeaders: (headers) => {
      if (!responseLinkHeaderEntries?.length) return;
      appendResponseLinkHeaders({
        responseHeaders: headers,
        entries: responseLinkHeaderEntries,
        filter: responseLinkHeaderFilter
      });
    }
  };
}
function normalizeTransformAssetResult(result) {
  if (typeof result === "string") return { href: result };
  return result;
}
function escapeCssString(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\a ").replace(/\r/g, "\\d ").replace(/\f/g, "\\c ");
}
async function transformInlineCssTemplate(options) {
  const { strings, urls } = options.template;
  if (strings.length !== urls.length + 1) throw new Error(`TanStack Start inlineCss template for ${options.stylesheetHref} is invalid`);
  let css = strings[0];
  for (let index = 0; index < urls.length; index++) {
    const transformed = normalizeTransformAssetResult(await options.transformFn({
      kind: "css-url",
      url: urls[index],
      stylesheetHref: options.stylesheetHref
    }));
    css += escapeCssString(transformed.href) + strings[index + 1];
  }
  return css;
}
async function transformInlineCssStyles(inlineCss, transformFn) {
  const transformedStyles = {};
  const transformedEntries = await Promise.all(Object.entries(inlineCss.styles).map(async ([stylesheetHref, css]) => {
    const template = inlineCss.templates?.[stylesheetHref];
    return [stylesheetHref, template ? await transformInlineCssTemplate({
      stylesheetHref,
      template,
      transformFn
    }) : css];
  }));
  for (const [stylesheetHref, css] of transformedEntries) transformedStyles[stylesheetHref] = css;
  return {
    styles: transformedStyles,
    ...inlineCss.templates ? { templates: inlineCss.templates } : {}
  };
}
function resolveTransformAssetsCrossOrigin(config, kind) {
  if (!config) return void 0;
  if (typeof config === "string") return config;
  return config[kind];
}
function isObjectShorthand(transform) {
  return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
  if (typeof transform === "string") {
    const prefix = transform;
    return {
      type: "transform",
      transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
      cache: true
    };
  }
  if (typeof transform === "function") return {
    type: "transform",
    transformFn: transform,
    cache: true
  };
  if (isObjectShorthand(transform)) {
    const { prefix, crossOrigin } = transform;
    return {
      type: "transform",
      transformFn: ({ url, kind }) => {
        const href = `${prefix}${url}`;
        if (kind === "clientEntry" || kind === "css-url") return { href };
        const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
        return co ? {
          href,
          crossOrigin: co
        } : { href };
      },
      cache: true
    };
  }
  if ("createTransform" in transform && transform.createTransform) return {
    type: "createTransform",
    createTransform: transform.createTransform,
    cache: transform.cache !== false
  };
  return {
    type: "transform",
    transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
    cache: transform.cache !== false
  };
}
function buildClientEntryScriptTag(clientEntry, injectedHeadScripts) {
  let script = `import(${JSON.stringify(clientEntry)})`;
  if (injectedHeadScripts) script = `${injectedHeadScripts};${script}`;
  return {
    tag: "script",
    attrs: {
      type: "module",
      async: true
    },
    children: script
  };
}
function assignManifestAssetLink(link, next) {
  if (typeof link === "string") return next.crossOrigin ? next : next.href;
  return next.crossOrigin ? next : { href: next.href };
}
async function transformManifestAssets(source, transformFn, _opts) {
  const manifest2 = structuredClone(source.manifest);
  if (!(_opts?.inlineCss !== false)) delete manifest2.inlineCss;
  else if (manifest2.inlineCss) manifest2.inlineCss = await transformInlineCssStyles(manifest2.inlineCss, transformFn);
  for (const route of Object.values(manifest2.routes)) {
    if (route.preloads) route.preloads = await Promise.all(route.preloads.map(async (link) => {
      const result = normalizeTransformAssetResult(await transformFn({
        url: resolveManifestAssetLink(link).href,
        kind: "modulepreload"
      }));
      return assignManifestAssetLink(link, {
        href: result.href,
        crossOrigin: result.crossOrigin
      });
    }));
    if (route.assets && !manifest2.inlineCss) {
      for (const asset of route.assets) if (asset.tag === "link" && asset.attrs?.href) {
        const rel = asset.attrs.rel;
        if (!(typeof rel === "string" ? rel.split(/\s+/) : []).includes("stylesheet")) continue;
        const result = normalizeTransformAssetResult(await transformFn({
          url: asset.attrs.href,
          kind: "stylesheet"
        }));
        asset.attrs.href = result.href;
        if (result.crossOrigin) asset.attrs.crossOrigin = result.crossOrigin;
        else delete asset.attrs.crossOrigin;
      }
    }
  }
  const transformedClientEntry = normalizeTransformAssetResult(await transformFn({
    url: source.clientEntry,
    kind: "clientEntry"
  }));
  const rootRoute = manifest2.routes[rootRouteId] = manifest2.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  rootRoute.assets.push(buildClientEntryScriptTag(transformedClientEntry.href, source.injectedHeadScripts));
  return manifest2;
}
function buildManifestWithClientEntry(source, opts) {
  const scriptTag = buildClientEntryScriptTag(source.clientEntry, source.injectedHeadScripts);
  const baseRootRoute = source.manifest.routes[rootRouteId];
  const routes = {
    ...source.manifest.routes,
    [rootRouteId]: {
      ...baseRootRoute,
      assets: [...baseRootRoute?.assets || [], scriptTag]
    }
  };
  return {
    ...opts?.inlineCss === false ? {} : { inlineCss: structuredClone(source.manifest.inlineCss) },
    routes
  };
}
function getStaticHandlerInlineCssDefault(handlerInlineCss) {
  if (typeof handlerInlineCss === "function") return;
  return handlerInlineCss ?? true;
}
async function resolveInlineCssForRequest(opts) {
  if (opts.requestInlineCss !== void 0) return opts.requestInlineCss;
  if (typeof opts.handlerInlineCss === "function") return await opts.handlerInlineCss({ request: opts.request });
  return opts.handlerInlineCss ?? true;
}
function createCachedBaseManifestLoader(loadBaseManifest) {
  let baseManifestPromise;
  return () => {
    if (!baseManifestPromise) baseManifestPromise = loadBaseManifest().catch((error) => {
      baseManifestPromise = void 0;
      throw error;
    });
    return baseManifestPromise;
  };
}
function createFinalManifestTransformResolver(transformAssets, opts) {
  const transformConfig = transformAssets !== void 0 ? resolveTransformAssetsConfig(transformAssets) : void 0;
  const cache = transformConfig ? transformConfig.cache : true;
  const warmup = !!transformAssets && typeof transformAssets === "object" && "warmup" in transformAssets && transformAssets.warmup === true;
  let cachedCreateTransformPromise;
  const clearCachedCreateTransform = () => {
    cachedCreateTransformPromise = void 0;
  };
  return {
    cache,
    warmup,
    clearCachedCreateTransform,
    getTransformFn: async (ctx) => {
      if (!transformConfig) return void 0;
      if (transformConfig.type !== "createTransform") return transformConfig.transformFn;
      if (!cache || false) return transformConfig.createTransform(ctx);
      if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(transformConfig.createTransform(ctx)).catch((error) => {
        clearCachedCreateTransform();
        throw error;
      });
      return cachedCreateTransformPromise;
    }
  };
}
function createFinalManifestResolver(opts) {
  const finalManifestCache = /* @__PURE__ */ new Map();
  const transformResolver = createFinalManifestTransformResolver(opts.transformAssets);
  const handlerDefaultInlineCss = getStaticHandlerInlineCssDefault(opts.inlineCss);
  const getRequestManifestOptions = async (requestOpts) => {
    const transformFn = await transformResolver.getTransformFn({
      warmup: false,
      request: requestOpts.request
    });
    const inlineCss = await resolveInlineCssForRequest({
      request: requestOpts.request,
      handlerInlineCss: opts.inlineCss,
      requestInlineCss: requestOpts.requestInlineCss
    });
    return {
      getBaseManifest: requestOpts.getBaseManifest,
      transformFn,
      cache: transformResolver.cache,
      inlineCss
    };
  };
  const resolveRequest = async (requestOpts, cache) => {
    return resolveFinalManifest({
      ...await getRequestManifestOptions(requestOpts),
      finalManifestCache: cache
    });
  };
  return {
    warmup: ({ getBaseManifest: getBaseManifest2 }) => warmupFinalManifest({
      enabled: transformResolver.warmup,
      handlerDefaultInlineCss,
      cache: transformResolver.cache,
      finalManifestCache,
      getBaseManifest: getBaseManifest2,
      getTransformFn: () => transformResolver.getTransformFn({ warmup: true }),
      onError: transformResolver.clearCachedCreateTransform
    }),
    resolveCached: (requestOpts) => resolveRequest(requestOpts, finalManifestCache),
    resolveUncached: (requestOpts) => resolveRequest(requestOpts, void 0)
  };
}
function getFinalManifestCacheKey(inlineCss) {
  return inlineCss ? "inline-css" : "linked-css";
}
function cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, promise) {
  const cachedFinalManifestPromise = promise.catch((error) => {
    if (cachedFinalManifestPromises.get(cacheKey) === cachedFinalManifestPromise) cachedFinalManifestPromises.delete(cacheKey);
    throw error;
  });
  cachedFinalManifestPromises.set(cacheKey, cachedFinalManifestPromise);
  return cachedFinalManifestPromise;
}
function getOrCreateCachedFinalManifestPromise(cachedFinalManifestPromises, cacheKey, computeFinalManifest) {
  const cachedFinalManifestPromise = cachedFinalManifestPromises.get(cacheKey);
  if (cachedFinalManifestPromise) return cachedFinalManifestPromise;
  return cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, Promise.resolve().then(computeFinalManifest));
}
async function buildFinalManifest(opts) {
  return opts.transformFn ? await transformManifestAssets(opts.base, opts.transformFn, { inlineCss: opts.inlineCss }) : buildManifestWithClientEntry(opts.base, { inlineCss: opts.inlineCss });
}
async function resolveFinalManifest(opts) {
  const computeFinalManifest = async () => {
    return buildFinalManifest({
      base: await opts.getBaseManifest(),
      transformFn: opts.transformFn,
      inlineCss: opts.inlineCss
    });
  };
  if (opts.finalManifestCache && (!opts.transformFn || opts.cache)) return getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(opts.inlineCss), computeFinalManifest);
  return computeFinalManifest();
}
function warmupFinalManifest(opts) {
  if (!opts.enabled || opts.handlerDefaultInlineCss === void 0 || !opts.cache) return;
  const inlineCss = opts.handlerDefaultInlineCss;
  const warmupPromise = getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(inlineCss), async () => {
    const [base, transformFn] = await Promise.all([opts.getBaseManifest(), opts.getTransformFn()]);
    return buildFinalManifest({
      base,
      transformFn,
      inlineCss
    });
  });
  if (opts.onError) warmupPromise.catch(opts.onError);
  return warmupPromise;
}
var ServerFunctionSerializationAdapter = createSerializationAdapter({
  key: "$TSS/serverfn",
  test: (v) => {
    if (typeof v !== "function") return false;
    if (!(TSS_SERVER_FUNCTION in v)) return false;
    return !!v[TSS_SERVER_FUNCTION];
  },
  toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
  fromSerializable: ({ functionId }) => {
    const fn = async (opts, signal) => {
      return (await (await getServerFnById(functionId))(opts ?? {}, signal)).result;
    };
    return fn;
  }
});
function getStartResponseHeaders(opts) {
  return mergeHeaders({ "Content-Type": "text/html; charset=utf-8" }, ...opts.router.stores.matches.get().map((match) => {
    return match.headers;
  }));
}
var entriesPromise;
var hasWarnedMissingCsrfMiddleware = false;
var defaultCsrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var getCachedBaseManifest = createCachedBaseManifestLoader(() => getStartManifest());
var getProdBaseManifest = () => getCachedBaseManifest();
var getBaseManifest = getProdBaseManifest;
var createEarlyHintsForRequest = createEarlyHintsCollector;
async function loadEntries() {
  const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
    import("./router-B21PHlE4.js").then((n) => n.r),
    import("./start-DYr4QhHk.js"),
    import("./__23tanstack-start-plugin-adapters-Cwee5PKy.js")
  ]);
  return {
    routerEntry,
    startEntry,
    pluginAdapters
  };
}
function getEntries() {
  if (!entriesPromise) entriesPromise = loadEntries();
  return entriesPromise;
}
function warnMissingCsrfMiddlewareOnce() {
  if (hasWarnedMissingCsrfMiddleware) return;
  hasWarnedMissingCsrfMiddleware = true;
  console.warn(`TanStack Start server functions are not protected by the CSRF middleware.

Server functions are same-origin RPC endpoints and should be protected from cross-site requests.

Add the CSRF middleware in src/start.ts:

  const csrfMiddleware = createCsrfMiddleware({
    filter: (ctx) => ctx.handlerType === 'serverFn',
  })

  export const startInstance = createStart(() => ({
    requestMiddleware: [csrfMiddleware],
  }))

If you intentionally handle CSRF another way, disable this warning:

  tanstackStart({
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  })`);
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var ERR_NO_RESPONSE = "Internal Server Error";
var ERR_NO_DEFER = "Internal Server Error";
function throwRouteHandlerError() {
  throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
  throw new Error(ERR_NO_DEFER);
}
function isSpecialResponse(value) {
  return value instanceof Response || isRedirect(value);
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) return { response: result };
  return result;
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (nextCtx) => {
    if (nextCtx) {
      if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
      for (const key of Object.keys(nextCtx)) if (key !== "context") ctx[key] = nextCtx[key];
    }
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx;
    let result;
    try {
      result = await middleware({
        ...ctx,
        next
      });
    } catch (err) {
      if (isSpecialResponse(err)) {
        ctx.response = err;
        return ctx;
      }
      throw err;
    }
    const normalized = handleCtxResult(result);
    if (normalized) {
      if (normalized.response !== void 0) ctx.response = normalized.response;
      if (normalized.context) ctx.context = safeObjectMerge(ctx.context, normalized.context);
    }
    return ctx;
  };
  return next();
}
function handlerToMiddleware(handler, mayDefer = false) {
  if (mayDefer) return handler;
  return async (ctx) => {
    const response = await handler({
      ...ctx,
      next: throwIfMayNotDefer
    });
    if (!response) throwRouteHandlerError();
    return response;
  };
}
function createStartHandler(cbOrOptions) {
  const handlerOptions = typeof cbOrOptions === "function" ? {} : cbOrOptions;
  const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
  const finalManifestResolver = createFinalManifestResolver({
    ...handlerOptions
  });
  const resolveManifestForRequest = finalManifestResolver.resolveCached;
  finalManifestResolver.warmup({ getBaseManifest: () => getBaseManifest() });
  const startRequestResolver = async (request, requestOpts) => {
    let router = null;
    let cbWillCleanup = false;
    try {
      const { url, handledProtocolRelativeURL } = getNormalizedURL(request.url);
      const href = url.pathname + url.search + url.hash;
      const origin = getOrigin(request);
      if (handledProtocolRelativeURL) return Response.redirect(url, 308);
      const entries = await getEntries();
      const hasStartInstance = !!entries.startEntry.startInstance;
      const startOptions = await entries.startEntry.startInstance?.getOptions() || {};
      const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
      const serializationAdapters = [
        ...startOptions.serializationAdapters || [],
        ...hasPluginAdapters ? pluginSerializationAdapters : [],
        ServerFunctionSerializationAdapter
      ];
      const requestStartOptions = {
        ...startOptions,
        requestMiddleware: hasStartInstance ? startOptions.requestMiddleware : [defaultCsrfMiddleware],
        serializationAdapters
      };
      const flattenedRequestMiddlewares = requestStartOptions.requestMiddleware ? flattenMiddlewares(requestStartOptions.requestMiddleware) : [];
      const executedRequestMiddlewares = new Set(flattenedRequestMiddlewares);
      const getRouter = async () => {
        if (router) return router;
        router = await entries.routerEntry.getRouter();
        let isShell = IS_SHELL_ENV;
        if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
        const history = createMemoryHistory({ initialEntries: [href] });
        router.update({
          history,
          isShell,
          isPrerendering: IS_PRERENDERING,
          origin: router.options.origin ?? origin,
          defaultSsr: requestStartOptions.defaultSsr,
          serializationAdapters: [...requestStartOptions.serializationAdapters, ...router.options.serializationAdapters || []],
          basepath: ROUTER_BASEPATH
        });
        return router;
      };
      if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
        if (false) ;
        const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
        if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
        const serverFnHandler = async ({ context }) => {
          return runWithStartContext({
            getRouter,
            startOptions: requestStartOptions,
            contextAfterGlobalMiddlewares: context,
            request,
            executedRequestMiddlewares,
            handlerType: "serverFn"
          }, () => handleServerAction({
            request,
            context: requestOpts?.context,
            serverFnId
          }));
        };
        return handleRedirectResponse((await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), serverFnHandler], {
          request,
          pathname: url.pathname,
          handlerType: "serverFn",
          context: createNullProtoObject(requestOpts?.context)
        })).response, request, getRouter);
      }
      const executeRouter = async (serverContext, matchedRoutes) => {
        const acceptParts = (request.headers.get("Accept") || "*/*").split(",");
        if (!["*/*", "text/html"].some((mimeType) => acceptParts.some((part) => part.trim().startsWith(mimeType)))) return Response.json({ error: "Only HTML requests are supported here" }, { status: 500 });
        const manifest2 = await resolveManifestForRequest({
          request,
          requestInlineCss: requestOpts?.inlineCss,
          getBaseManifest: () => getBaseManifest(matchedRoutes)
        });
        const earlyHints = createEarlyHintsForRequest({
          onEarlyHints: requestOpts?.onEarlyHints,
          responseLinkHeader: requestOpts?.responseLinkHeader
        });
        earlyHints?.collectStatic({
          manifest: manifest2,
          matchedRoutes
        });
        const routerInstance = await getRouter();
        attachRouterServerSsrUtils({
          router: routerInstance,
          manifest: manifest2,
          getRequestAssets: () => getStartContext({ throwIfNotFound: false })?.requestAssets,
          includeUnmatchedRouteAssets: false
        });
        routerInstance.update({ additionalContext: { serverContext } });
        await routerInstance.load();
        if (routerInstance.state.redirect) return routerInstance.state.redirect;
        earlyHints?.collectDynamic(routerInstance.stores.matches.get());
        const ctx = getStartContext({ throwIfNotFound: false });
        await routerInstance.serverSsr.dehydrate({ requestAssets: ctx?.requestAssets });
        const responseHeaders = getStartResponseHeaders({ router: routerInstance });
        earlyHints?.appendResponseHeaders(responseHeaders);
        cbWillCleanup = true;
        return cb({
          request,
          router: routerInstance,
          responseHeaders
        });
      };
      const requestHandlerMiddleware = async ({ context }) => {
        return runWithStartContext({
          getRouter,
          startOptions: requestStartOptions,
          contextAfterGlobalMiddlewares: context,
          request,
          executedRequestMiddlewares,
          handlerType: "router"
        }, async () => {
          try {
            return await handleServerRoutes({
              getRouter,
              request,
              url,
              executeRouter,
              context,
              executedRequestMiddlewares
            });
          } catch (err) {
            if (err instanceof Response) return err;
            throw err;
          }
        });
      };
      return handleRedirectResponse((await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), requestHandlerMiddleware], {
        request,
        pathname: url.pathname,
        handlerType: "router",
        context: createNullProtoObject(requestOpts?.context)
      })).response, request, getRouter);
    } finally {
      if (router && !cbWillCleanup) router.serverSsr?.cleanup();
      router = null;
    }
  };
  return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter) {
  if (!isRedirect(response)) return response;
  if (isResolvedRedirect(response)) {
    if (request.headers.get("x-tsr-serverFn") === "true") return Response.json({
      ...response.options,
      isSerializedRedirect: true
    }, { headers: response.headers });
    return response;
  }
  const opts = response.options;
  if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
  if ([
    "params",
    "search",
    "hash"
  ].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
  const redirect = (await getRouter()).resolveRedirect(response);
  if (request.headers.get("x-tsr-serverFn") === "true") return Response.json({
    ...response.options,
    isSerializedRedirect: true
  }, { headers: response.headers });
  return redirect;
}
async function handleServerRoutes({ getRouter, request, url, executeRouter, context, executedRequestMiddlewares }) {
  const router = await getRouter();
  const pathname = executeRewriteInput(router.rewrite, url).pathname;
  const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname);
  const isExactMatch = foundRoute && routeParams["**"] === void 0;
  const routeMiddlewares = [];
  for (const route of matchedRoutes) {
    const serverMiddleware = route.options.server?.middleware;
    if (serverMiddleware) {
      const flattened = flattenMiddlewares(serverMiddleware);
      for (const m of flattened) if (!executedRequestMiddlewares.has(m)) routeMiddlewares.push(m.options.server);
    }
  }
  const server2 = foundRoute?.options.server;
  let isHeadFallback = false;
  if (server2?.handlers && isExactMatch) {
    const handlers = typeof server2.handlers === "function" ? server2.handlers({ createHandlers: (d) => d }) : server2.handlers;
    const requestMethod = request.method.toUpperCase();
    const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
    isHeadFallback = requestMethod === "HEAD" && handler !== void 0 && !handlers["HEAD"];
    if (handler) {
      const mayDefer = !!foundRoute.options.component;
      if (typeof handler === "function") routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
      else {
        if (handler.middleware?.length) {
          const handlerMiddlewares = flattenMiddlewares(handler.middleware);
          for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
        }
        if (handler.handler) routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
      }
    }
  }
  routeMiddlewares.push((ctx2) => executeRouter(ctx2.context, matchedRoutes));
  const ctx = await executeMiddleware(routeMiddlewares, {
    request,
    context,
    params: routeParams,
    pathname,
    handlerType: "router"
  });
  if (isHeadFallback) {
    if (!ctx.response) throwRouteHandlerError();
    const resolved = await handleRedirectResponse(ctx.response, request, getRouter);
    return new Response(null, resolved);
  }
  return ctx.response;
}
var fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
  return { async fetch(...args) {
    return await entry.fetch(...args);
  } };
}
var server_default = createServerEntry({ fetch });
const server = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createServerEntry,
  default: server_default
}, Symbol.toStringTag, { value: "Module" }));
export {
  TSS_SERVER_FUNCTION as T,
  createServerFn as a,
  getServerFnById as b,
  createMiddleware as c,
  getRequest as g,
  server as s
};
