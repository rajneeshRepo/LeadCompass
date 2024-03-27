import { DashboardOutlined, UserAddOutlined, UserOutlined, AimOutlined, UnorderedListOutlined, DatabaseOutlined, UploadOutlined, FileDoneOutlined, AppstoreAddOutlined, FundOutlined, ClockCircleOutlined, NodeIndexOutlined, CloudUploadOutlined} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'


const dataSourceNavTree = [{
  key: 'dashboards',
  path: `${APP_PREFIX_PATH}/source`,
  title: 'sidenav.dataSource',
  icon: CloudUploadOutlined,
  breadcrumb: true,
  submenu: []
}]

const visualizationNavTree = [{
  key: 'reports',
  path: `${APP_PREFIX_PATH}/visualization`,
  title: 'sidenav.visualization',
  icon: FundOutlined,
  breadcrumb: true,
  submenu: []
}]

const uploadLeadsNavTree = [{
  key: 'upload',
  path: `${APP_PREFIX_PATH}/upload-leads`,
  title: 'sidenav.uploadLeads',
  icon: UploadOutlined,
  breadcrumb: true,
  submenu: []
}]

// const userNavTree = [{
//   key: 'users',
//   path: `${APP_PREFIX_PATH}/users`,
//   title: 'sidenav.users',
//   icon: UserOutlined,
//   breadcrumb: false,
//   // isGroupTitle: true,
//   submenu: [
//     {
//       key: 'users-register',
//       path: `${APP_PREFIX_PATH}/users/add`,
//       title: 'sidenav.users.add',
//       icon: UserAddOutlined,
//       breadcrumb: false,
//       submenu: []
//     },
//     {
//       key: 'users-list',
//       path: `${APP_PREFIX_PATH}/users/list`,
//       title: 'sidenav.users.list',
//       icon: UnorderedListOutlined,
//       breadcrumb: true,
//       submenu: []
//     }
//   ]
// }]

const leadNavTree = [{
  key: 'leads',
  path: `${APP_PREFIX_PATH}/leads`,
  title: 'sidenav.leads',
  icon: AimOutlined,
  breadcrumb: true,
  submenu: []
}]

const timelineNavTree = [{
  key: 'status',
  path: `${APP_PREFIX_PATH}/timeline`,
  title: 'sidenav.timeline',
  icon: NodeIndexOutlined,
  breadcrumb: true,
  submenu: []
}]

const navigationConfig = [
  ...dataSourceNavTree,
  ...visualizationNavTree,
  ...uploadLeadsNavTree,
  ...leadNavTree,
  ...timelineNavTree,
]

export default navigationConfig;
