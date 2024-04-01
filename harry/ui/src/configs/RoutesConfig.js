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
    // {
    //     key: 'dashboard.default',
    //     path: `${APP_PREFIX_PATH}/dashboards/default`,
    //     component: React.lazy(() => import('views/app-views/dashboards/default')),
    // },
    {
        key: 'organizations',
        path: `${APP_PREFIX_PATH}/organizations/*`,
        component: React.lazy(() => import('views/app-views/organizations')),
    },
    {
        key: 'report',
        path: `${APP_PREFIX_PATH}/report`,
        component: React.lazy(() => import('views/app-views/admin/report')),
    },
    {
        key: 'resource',
        path: `${APP_PREFIX_PATH}/resource_info/:type`,
        component: React.lazy(() => import('views/app-views/admin/add_resource')),
    },
    {
        key:'resource_info',
        path: `${APP_PREFIX_PATH}/resource_info`,
        component: React.lazy(() => import('views/app-views/admin/resource_info')),
    }

]