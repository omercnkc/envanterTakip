/**
 * React Navigation Rota ve Parametre Tipleri
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from './database.types';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string } | undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ProductsTab: { categoryId?: number; filterStatus?: string } | undefined;
  AddProductTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  ProductDetail: { productId: string; initialProduct?: Product };
  EditProduct: { productId: string; product?: Product };
  Search: undefined;
  Filter: undefined;
};
