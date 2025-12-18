import { CommonActions } from "@react-navigation/native";

export type ScreenType = "list" | "detail" | "form";

export const navigateBack = (navigation: any) => {
  navigation.goBack();
};

export const getScreenType = (route: any) => {
  if (route.params?.screenType) {
    return route.params.screenType;
  }

  // Special case: Marketplace with params should be treated as detail
  if (
    (route.name === "Marketplace" || route.name === "Store List") &&
    route.params &&
    Object.keys(route.params).length > 0
  ) {
    return "detail";
  }

  if (route.name.includes("Detail")) {
    return "detail";
  } else if (
    route.name.includes("Form") ||
    route.name.includes("Add") ||
    route.name.includes("Edit")
  ) {
    return "form";
  } else {
    return "list";
  }
};

export const getScreenTitle = (route: any, defaultTitle?: string) => {
  if (route.params?.screenTitle) {
    return route.params.screenTitle;
  }

  const screenType = getScreenType(route);
  const baseName = route.name
    .replace(/Form$|Detail$|Screen$|Main$|List$|Add|Edit/, "")
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2") // space between camelCase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2"); //space between PascalCase

  switch (screenType) {
    case "form":
      return `${baseName} Form`;
    case "detail":
      return `${baseName} ${
        route.name === "Marketplace" || route.name === "Store List"
          ? "List"
          : "Details"
      }`;
    default:
      return defaultTitle || baseName;
  }
};

export const navigateWithReset = (
  navigation: any,
  routeName: string,
  params: any = {}
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    })
  );
};
