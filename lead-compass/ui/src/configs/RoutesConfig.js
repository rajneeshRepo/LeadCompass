import React from 'react'
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig'

export const publicRoutes = [
    {
        key: 'login',
        path: `${AUTH_PREFIX_PATH}/login`,
        component: React.lazy(() => import('views/auth-views/authentication/login')),
    },
    {
        key: 'register',
        path: `${AUTH_PREFIX_PATH}/register`,
        component: React.lazy(() => import('views/auth-views/authentication/register')),
    },
    {
        key: 'forgot-password',
        path: `${AUTH_PREFIX_PATH}/forgot-password`,
        component: React.lazy(() => import('views/auth-views/authentication/forgot-password')),
    }
]

export const protectedRoutes = [
    {
        key: 'source',
        path: `${APP_PREFIX_PATH}/source`,
        component: React.lazy(() => import('views/app-views/upload/companies')),
    },
    {
        key: 'visualization',
        path: `${APP_PREFIX_PATH}/visualization`,
        component: React.lazy(() => import('views/app-views/reports/powerBI'))
    },
    {
        key: 'upload.leads',
        path: `${APP_PREFIX_PATH}/upload-leads`,
        component: React.lazy(() => import('views/app-views/upload/leads'))
    },
    {
        key: 'leads.list',
        path: `${APP_PREFIX_PATH}/leads`,
        component: React.lazy(() => import('views/app-views/leads/lead-list'))
    },
    {
        key: 'leads.viewLead',
        path: `${APP_PREFIX_PATH}/leads/view-lead/:id`,
        component: React.lazy(() => import('views/app-views/leads/view-lead'))
    },
    {
        key: 'timeline',
        path:  `${APP_PREFIX_PATH}/timeline`,
        component: React.lazy(() => import('views/app-views/status/files'))
    },
    {
        key: 'users.add',
        path: `${APP_PREFIX_PATH}/users/add`,
        component: React.lazy(() => import('views/app-views/users/add-user'))
    },
    {
        key: 'users.list',
        path: `${APP_PREFIX_PATH}/users/list`,
        component: React.lazy(() => import('views/app-views/users/user-list'))
    },
    {
        key: 'users.setting',
        path: `${APP_PREFIX_PATH}/user/setting/*`,
        component: React.lazy(() => import('views/app-views/users/setting'))
    }
]