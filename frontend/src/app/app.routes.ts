import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'login', loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./features/auth/pages/register/register').then(m => m.Register) },

  { path: 'home', loadComponent: () => import('./features/home/pages/home-page/home-page').then(m => m.HomePage) },

  { path: 'subjects', loadComponent: () => import('./features/subjects/pages/subjects-list/subjects-list').then(m => m.SubjectsList) },
  { path: 'subjects/:id', loadComponent: () => import('./features/subjects/pages/subject-detail/subject-detail').then(m => m.SubjectDetailPage) },

  { path: 'professors', loadComponent: () => import('./features/professors/pages/professors-list/professors-list').then(m => m.ProfessorsList) },
  { path: 'professors/:id', loadComponent: () => import('./features/professors/pages/professor-detail/professor-detail').then(m => m.ProfessorDetail) },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'wishlist', loadComponent: () => import('./features/wishlist/pages/wishlist-page/wishlist-page').then(m => m.WishlistPage) },
      { path: 'profile', loadComponent: () => import('./features/profile/pages/profile-page/profile-page').then(m => m.ProfilePage) },
    ]
  },

  { path: '**', loadComponent: () => import('./features/not-found/pages/not-found-page/not-found-page').then(m => m.NotFoundPage) }
];