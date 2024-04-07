import { DashboardOutlined , ProjectOutlined,FileOutlined} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'
const user = {
  firstName: localStorage.getItem('first_name') || null,
  lastName: localStorage.getItem('last_name') || null,
  email: localStorage.getItem('email') || null,
  role: localStorage.getItem('role') || null
}

const dashBoardNavTree = [{
  key: 'dashboards',
  path: `${APP_PREFIX_PATH}/dashboards`,
  title: 'sidenav.dashboard',
  icon: DashboardOutlined,
  breadcrumb: false,
  isGroupTitle: true,
  submenu: [
    {
      key: 'dashboards-default',
      path: `${APP_PREFIX_PATH}/dashboards/default`,
      title: 'sidenav.dashboard.default',
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: []
    }
  ]
}]

const admin =[
  {
    key: 'report',
    path: `${APP_PREFIX_PATH}/report`,
    title: "Report",
    icon: FileOutlined,
    breadcrumb: false,
    isGroupTitle: false,
    submenu: []
  },

  {
    key: 'manage_resources',
    path: `${APP_PREFIX_PATH}/resource_info`,
    title: "Manage Resources",
    icon: FileOutlined,
    breadcrumb: false,
    isGroupTitle: false,
    submenu: []
  },


]

// const organizationNavTree = [
//   {
//     key: 'organizations',
//     path: `${APP_PREFIX_PATH}/organizations/*`,
//     title: "sidenav.organizations",
//     icon: ProjectOutlined,
//     breadcrumb: false,
//   },
// ];

const navigationConfig = [
  ...dashBoardNavTree,
  ...(user.role === 'admin' ? admin : [])
  // ...organizationNavTree
]

export default navigationConfig;
