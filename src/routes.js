import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Dashboard = React.lazy(() => import('./App/pages/DashBoard/index'));

const SubjectManager = React.lazy(() => import('./App/pages/SubjectManager/SubjectManager'));

const UserManager = React.lazy(() => import('./App/pages/UserManager/UserManager'));

const CourseManager = React.lazy(() => import('./App/pages/CourseManager/CourseManager'));

const FacultyManager = React.lazy(() => import('./App/pages/FacultyManager'));

const CurriculumManager = React.lazy(() => import('./App/pages/CurriculumManager'));


const routes = [
    { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
    { path: '/course', exact: true, name: 'Course Manager', component: CourseManager },
    { path: '/faculty', exact: true, name: 'Faculty Manager', component: FacultyManager },
    { path: '/curriculum', exact: true, name: 'Curriculum Manager', component: CurriculumManager },
    { path: '/subject', exact: true, name: 'Subject Manager', component: SubjectManager },
    { path: '/manager/teacher', exact: true, name: 'Manager', component: UserManager },
    { path: '/manager/student', exact: true, name: 'Manager', component: UserManager },
    { path: '/manager/register', exact: true, name: 'Manager', component: UserManager },
];

export default routes;