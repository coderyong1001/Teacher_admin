/*
 * @Author: yuanhang 
 * @Date: 2019-10-14 11:02:51 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2019-12-20 17:57:29
 */
import Login from '../pages/login/index'                // 登录
import MyError from '../pages/error/index'              // 错误页
import Index from '../pages/index/index'                // 首页
import Course from '../pages/course/index'              // 课程信息管理
import CourseNew from '../pages/course/new/index'       // 新建 课程信息管理
import CourseEdit from '../pages/course/edit/index'     // 编辑 课程信息管理
import User from '../pages/user/index'                  // 用户管理
import Finance from '../pages/finance/index'            // 财务统计
import UserData from '../pages/userdata/index'          // 用户数据
import Invoice from '../pages/invoice/index'          // 用户数据

/* 路由
** isAuth 判断无需验证登录的页面
** Redirect 路由重定向 重定向必须放到最后
** '/' 的重定向必须加上exact，不然会匹配其它路由
*/
export const main = [
    { path: '/index', name: '首页', component: Index },
    { path: '/login', name: '登录', component: Login, isAuth: true },
    { path: '/course', exact: true, name: '课程信息管理', component: Course },
    { path: '/course/new', name: '新建课程', component: CourseNew, parent: '/course' },
    { path: '/course/edit/:id', name: '编辑课程', component: CourseEdit, parent: '/course' },
    { path: '/user', name: '用户管理', component: User },
    { path: '/finance', name: '财务统计', component: Finance },
    { path: '/userdata', name: '用户数据', component: UserData },
    { path: '/invoice', name: '发票信息', component: Invoice },
    { path: '/', exact: true, name: '课程信息管理', Redirect: '/course' },
    { path: '/error', name: '错误页', component: MyError, isAuth: true },
]

// 左侧菜单相关路由
export const menus = [
    { path: '/course', name: '课程信息管理', icon: 'file-search' },
    { path: '/user', name: '用户管理', icon: 'team' },
    { path: '/finance', name: '财务统计', icon: 'area-chart' },
    { path: '/userdata', name: '用户数据', icon: 'bar-chart' },
    { path: '/invoice', name: '发票信息', icon: 'account-book' },
]

export const routerConfig = {
    main, menus
}