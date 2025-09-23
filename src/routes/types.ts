export interface RouteParams {
  id?: string;
}

export interface AppRouteParams {
  home: undefined;
  about: undefined;
  contact: undefined;
  professionals: undefined;
}

export type AppRouteNames = keyof AppRouteParams;
