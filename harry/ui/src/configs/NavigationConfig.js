import { DashboardOutlined , ProjectOutlined} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'


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
  // ...organizationNavTree
]

export default navigationConfig;
